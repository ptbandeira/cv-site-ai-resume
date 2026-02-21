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
  const webhookUrl = process.env.SLACK_WEBHOOK_URL;
  if (!webhookUrl) {
    console.log('⚠️  SLACK_WEBHOOK_URL not set — skipping digest');
    return;
  }

  const hot  = leads.filter(l => l.priority === 'hot');
  const warm = leads.filter(l => l.priority === 'warm');
  const cold = leads.filter(l => l.priority === 'cold');

  // Enrich hot leads with Apollo contact data
  console.log(`🔍 Enriching ${hot.length} hot leads with Apollo...`);
  const hotEnriched = await Promise.all(
    hot.map(async (lead) => {
      const enriched = await enrichLead(
        lead.company ?? 'Unknown',
        lead.industry ?? 'Enterprise AI',
        lead.title
      );
      return { lead, ...enriched };
    })
  );

  const blocks: any[] = [];

  if (leads.length === 0) {
    blocks.push({
      type: 'section',
      text: { type: 'mrkdwn', text: '*0 leads today* — system ran OK. Google News may have been quiet.' },
    });
    await postToSlack(webhookUrl, blocks);
    return;
  }

  // Header
  blocks.push({
    type: 'header',
    text: {
      type: 'plain_text',
      text: `🎯 ${leads.length} leads · ${new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'short' })}`,
      emoji: true,
    },
  });
  blocks.push({
    type: 'context',
    elements: [{ type: 'mrkdwn', text: `🔴 ${hot.length} hot · 🟡 ${warm.length} warm · ⚪ ${cold.length} cold  |  Apollo enrichment on hot leads` }],
  });
  blocks.push({ type: 'divider' });

  // HOT leads with contact + draft
  if (hotEnriched.length > 0) {
    blocks.push({ type: 'section', text: { type: 'mrkdwn', text: '*🔴 HOT LEADS — Act today*' } });

    for (const { lead, contact, draft } of hotEnriched) {
      blocks.push({
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: `*<${lead.url}|${lead.title}>*\n` +
            (lead.company && lead.company !== 'Unknown' ? `🏢 *${lead.company}*  ` : '') +
            (lead.industry ? `📂 ${lead.industry}  ` : '') +
            `🗞 ${lead.source}`,
        },
      });

      if (contact && contact.email && contact.email !== '(not found)') {
        const icon = contact.confidence === 'verified' ? '✅' : '⚡';
        const liLink = contact.linkedinUrl ? `  |  <${contact.linkedinUrl}|LinkedIn>` : '';
        blocks.push({
          type: 'context',
          elements: [{ type: 'mrkdwn', text: `👤 *${contact.name}*, ${contact.title}  |  📧 ${contact.email} ${icon}${liLink}` }],
        });
      } else {
        blocks.push({
          type: 'context',
          elements: [{ type: 'mrkdwn', text: `👤 Apollo: no contact found — search manually at ${lead.company ?? 'this company'}` }],
        });
      }

      if (draft) {
        blocks.push({
          type: 'section',
          text: { type: 'mrkdwn', text: `📩 *Draft pitch:*\n\`\`\`${draft}\`\`\`` },
        });
      }

      blocks.push({ type: 'divider' });
    }
  }

  // WARM leads — condensed list
  if (warm.length > 0) {
    blocks.push({ type: 'section', text: { type: 'mrkdwn', text: '*🟡 WARM LEADS — Worth a read*' } });
    const warmLines = warm.slice(0, 5).map(l => {
      const title = l.title.length > 72 ? l.title.slice(0, 69) + '…' : l.title;
      const co = l.company && l.company !== 'Unknown' ? l.company : l.source;
      return `• <${l.url}|${title}> — ${co}`;
    }).join('\n');
    blocks.push({ type: 'section', text: { type: 'mrkdwn', text: warmLines } });
    if (warm.length > 5) {
      blocks.push({ type: 'context', elements: [{ type: 'mrkdwn', text: `+${warm.length - 5} more warm leads in Supabase` }] });
    }
    blocks.push({ type: 'divider' });
  }

  // COLD — summary only
  if (cold.length > 0) {
    blocks.push({ type: 'context', elements: [{ type: 'mrkdwn', text: `⚪ *${cold.length} cold leads* stored in Supabase — low priority` }] });
  }

  await postToSlack(webhookUrl, blocks);
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
