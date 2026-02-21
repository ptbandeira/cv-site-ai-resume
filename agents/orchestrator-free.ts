// Orchestrator Agent — FREE VERSION
// Runs all agents in sequence, saves to Supabase, syncs to HubSpot

import { createClient } from '@supabase/supabase-js';
import { runLeadFinderSwarmFree } from './lead-finder-free';
import { syncLeadBatch } from './hubspot-sync';
import type { Lead, ScrapingJob } from './types';
import { enrichLead } from './enricher';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_KEY!
);

/**
 * Post daily lead digest to Slack
 */
async function sendSlackDigest(leads: Lead[]): Promise<void> {
  const hotLeads  = leads.filter(l => (l as any).priority === 'hot');
  const warmLeads = leads.filter(l => (l as any).priority === 'warm');
  const coldLeads = leads.filter(l => (l as any).priority === 'cold');

  // ── Enrich hot leads with Apollo (fully null-safe) ──────────────────────────
  let enrichedLeads: Array<{ contact: null | { name?: string; title?: string; email?: string; linkedin?: string }; draft?: string }> = [];

  try {
    enrichedLeads = await Promise.all(
      hotLeads.map(lead =>
        enrichLead(
          (lead as any).company_name ?? 'Unknown',
          lead.industry ?? 'Enterprise AI',
          (lead as any).signal ?? (lead as any).signal_url ?? 'AI news'
        ).catch((err: Error) => ({
          contact: null,
          draft: `[Apollo error: ${err?.message ?? 'unknown'}]`,
        }))
      )
    );
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.warn('⚠️  Apollo enrichment batch failed:', msg);
    enrichedLeads = hotLeads.map(() => ({ contact: null, draft: '' }));
  }

  // ── Build hot leads section ─────────────────────────────────────────────────
  const hotSection =
    hotLeads.length === 0
      ? ''
      : [`*🔥 HOT LEADS (${hotLeads.length})*`]
          .concat(
            hotLeads.map((lead, i) => {
              const enriched = enrichedLeads[i] ?? { contact: null, draft: '' };
              const contact = enriched?.contact ?? null;
              const draft = (enriched?.draft ?? '').slice(0, 200);
              const title = ((lead as any).signal ?? "AI implementation").slice(0, 80);
              const company = (lead as any).company_name ?? (lead as any).signal_url ?? 'Unknown';
              const url = (lead as any).signal_url ?? '';

              const lines: string[] = [
                `*${company}* — <${url}|${title}>`,
              ];
              if (contact) {
                const who = [contact.name, contact.title].filter(Boolean).join(' · ');
                if (who) lines.push(`👤 ${who}`);
                if (contact.email) lines.push(`📧 ${contact.email}`);
                if (contact.linkedin) lines.push(`🔗 ${contact.linkedin}`);
              }
              if (draft) lines.push(`📝 _${draft}_`);
              return lines.join('\n');
            })
          )
          .join('\n---\n');

  // ── Build warm leads section (top 5) ────────────────────────────────────────
  const warmSection =
    warmLeads.length === 0
      ? ''
      : [`*🟡 WARM LEADS (${warmLeads.length})*`]
          .concat(
            warmLeads.slice(0, 5).map(lead => {
              const title = ((lead as any).signal ?? '').slice(0, 60);
              const company = (lead as any).company_name ?? 'Unknown';
              const url = (lead as any).signal_url ?? '';
              return `• *${company}* — <${url}|${title}${title.length === 60 ? '…' : ''}>`;
            })
          )
          .concat(warmLeads.length > 5 ? [`_…and ${warmLeads.length - 5} more_`] : [])
          .join('\n');

  // ── Cold summary ────────────────────────────────────────────────────────────
  const coldSection = coldLeads.length === 0 ? '' : `❄️ *${coldLeads.length} cold leads* saved to Supabase`;

  // ── Compose and send ────────────────────────────────────────────────────────
  const date = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  const message = [
    `*🤖 Analog AI Lead Digest — ${date}*`,
    hotSection,
    warmSection,
    coldSection,
  ]
    .filter(Boolean)
    .join('\n\n');

  const webhookUrl = process.env.SLACK_WEBHOOK_URL;
  if (!webhookUrl) {
    console.log('⚠️  SLACK_WEBHOOK_URL not set — skipping digest');
    return;
  }
  const slackRes = await fetch(webhookUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text: message }),
  });
  if (slackRes.ok) {
    console.log('📬 Slack digest sent');
  } else {
    const errBody = await slackRes.text();
    console.error('Slack error ' + slackRes.status + ': ' + errBody);
  }
}

async function postToSlack(webhookUrl: string, blocks: any[]): Promise<void> {
  try {
    const res = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ blocks }),
    });
    if (!res.ok) {
      const body = await res.text();
      console.error(`❌ Slack returned ${res.status}: ${body}`);
    } else {
      console.log('📬 Slack digest sent');
    }
  } catch (err: any) {
    console.error(`❌ Slack FAILED: ${err.message}`);
  }
}

/**
 * Main orchestrator function
 */
export async function orchestrate() {
  console.log('🚀 Starting Agent Swarm Orchestration (FREE VERSION)');
  console.log('⏰', new Date().toISOString());

  const jobId = `job-${Date.now()}`;
  const startTime = new Date().toISOString();

  // Create scraping job record
  const job: ScrapingJob = {
    id: jobId,
    agent: 'lead-finder-swarm-free',
    status: 'running',
    started_at: startTime,
    leads_found: 0
  };

  try {
    // Insert job record
    await supabase.from('scraping_jobs').insert(job);

    // 🔍 STEP 1: Run Lead Finder Swarm
    console.log('\n🔍 Running Lead Finder Swarm...');
    const leads = await runLeadFinderSwarmFree();

    if (leads.length === 0) {
      console.log('⚠️  No leads found this run');
      await supabase.from('scraping_jobs').update({
        status: 'completed',
        completed_at: new Date().toISOString(),
        leads_found: 0
      }).eq('id', jobId);
      // Still send Slack heartbeat so you know the system ran
      await sendSlackDigest([]);
      return;
    }

    // 💾 STEP 2: Save to Supabase
    console.log(`\n💾 Saving ${leads.length} leads to Supabase...`);
    const { data: savedLeads, error: saveError } = await supabase
      .from('leads')
      .upsert(leads, { onConflict: 'id', ignoreDuplicates: true })
      .select();

    if (saveError) {
      throw new Error(`Failed to save leads: ${saveError.message}`);
    }

    console.log(`✅ Saved ${savedLeads?.length || 0} leads to database`);

    // 🔄 STEP 3: Sync to HubSpot (optional — skipped if no API key or on failure)
    if (process.env.HUBSPOT_API_KEY) {
      try {
        console.log('\n🔄 Syncing to HubSpot CRM...');
        const syncResult = await syncLeadBatch(leads);
        console.log(`✅ HubSpot Sync: ${syncResult.success}/${leads.length} pushed`);
        if (syncResult.errors.length > 0) {
          console.log(`⚠️  Sync errors (non-fatal):`);
          syncResult.errors.slice(0, 5).forEach(err => console.log(`     - ${err}`));
        }
      } catch (syncErr: any) {
        console.log(`⚠️  HubSpot sync skipped: ${syncErr.message} (leads saved to Supabase)`);
      }
    } else {
      console.log('\n⏭️  HubSpot sync skipped (no API key — leads saved to Supabase for manual review)');
    }

    // 📬 STEP 4: Send Slack digest (always — confirms system health)
    await sendSlackDigest(leads);

    // Update job as completed
    await supabase.from('scraping_jobs').update({
      status: 'completed',
      completed_at: new Date().toISOString(),
      leads_found: leads.length
    }).eq('id', jobId);

    console.log('\n✅ Orchestration Complete!');
    console.log(`📊 Summary:`);
    console.log(`   Total Leads: ${leads.length}`);
    console.log(`   Hot Priority: ${leads.filter(l => l.priority === 'hot').length}`);
    console.log(`   Warm Priority: ${leads.filter(l => l.priority === 'warm').length}`);
    console.log(`   Cold Priority: ${leads.filter(l => l.priority === 'cold').length}`);

  } catch (error) {
    console.error('❌ Orchestration Failed:', error);

    // Mark job as failed
    await supabase.from('scraping_jobs').update({
      status: 'failed',
      completed_at: new Date().toISOString(),
      error_message: error instanceof Error ? error.message : String(error)
    }).eq('id', jobId);

    throw error;
  }
}

// Run if executed directly - FIXED ES MODULE CHECK
orchestrate()
  .then(() => {
    console.log('\n✨ Done!');
    process.exit(0);
  })
  .catch(error => {
    console.error('\n💥 Fatal Error:', error);
    process.exit(1);
  });
