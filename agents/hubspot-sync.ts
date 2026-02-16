import type { Lead } from './types';

const HUBSPOT_API_KEY = process.env.HUBSPOT_API_KEY;
const HUBSPOT_API_URL = 'https://api.hubapi.com';

export async function syncLeadBatch(leads: Lead[]): Promise<{
  success: number;
  failed: number;
  errors: string[];
}> {
  console.log(`📤 Syncing ${leads.length} leads to HubSpot...`);
  
  let success = 0;
  let failed = 0;
  const errors: string[] = [];

  for (const lead of leads) {
    try {
      // Create company in HubSpot
      const response = await fetch(`${HUBSPOT_API_URL}/crm/v3/objects/companies`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${HUBSPOT_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          properties: {
            name: lead.company_name,
            industry: lead.industry,
            description: `${lead.signal} - Source: ${lead.source}`,
            hs_lead_status: lead.priority === 'hot' ? 'HOT_LEAD' : 'NEW'
          }
        })
      });

      if (response.ok) {
        const result = await response.json();
        lead.hubspot_company_id = result.id;
        lead.synced_to_hubspot = true;
        success++;
      } else {
        failed++;
        errors.push(`${lead.company_name}: ${response.statusText}`);
      }
      
      await new Promise(resolve => setTimeout(resolve, 100));
    } catch (error: any) {
      failed++;
      errors.push(`${lead.company_name}: ${error.message}`);
    }
  }

  console.log(`✅ Synced ${success}/${leads.length} leads`);
  return { success, failed, errors };
}
