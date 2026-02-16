export interface Lead {
  id: string;
  source: 'job_board' | 'news' | 'linkedin';
  company_name: string;
  industry: 'pharma' | 'finance' | 'legal' | 'healthcare' | 'other';
  decision_maker?: {
    name: string;
    title: string;
    linkedin_url?: string;
    email?: string;
  };
  signal: string;
  signal_url: string;
  priority: 'hot' | 'warm' | 'cold';
  scraped_at: string;
  synced_to_hubspot: boolean;
  hubspot_contact_id?: string;
  hubspot_company_id?: string;
}

export interface ScrapingJob {
  id: string;
  agent: string;
  status: 'running' | 'completed' | 'failed';
  started_at: string;
  completed_at?: string;
  leads_found: number;
  error_message?: string;
}
