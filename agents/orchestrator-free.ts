// Orchestrator Agent — FREE VERSION
// Runs all agents in sequence, saves to Supabase, syncs to HubSpot

import { createClient } from '@supabase/supabase-js';
import { runLeadFinderSwarmFree } from './lead-finder-free';
import { syncLeadBatch } from './hubspot-sync';
import type { Lead, ScrapingJob } from './types';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_KEY!
);

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
      return;
    }

    // 💾 STEP 2: Save to Supabase
    console.log(`\n💾 Saving ${leads.length} leads to Supabase...`);
    const { data: savedLeads, error: saveError } = await supabase
      .from('leads')
      .insert(leads)
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
