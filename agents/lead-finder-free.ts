// Lead Finder Agent — ANALOG AI VERSION
// ICP: Gen X executives and SMB owners in regulated industries who need
//      a business-side AI implementation partner (not a technical hire)
// Signal: Companies/execs publicly starting, struggling with, or asking about AI adoption
// Sources: Google News RSS, TechCrunch RSS, Hacker News API
// No Playwright needed — pure HTTP fetch

import { load } from 'cheerio';
import type { Lead } from './types';

// ─── ICP-tuned search queries ────────────────────────────────────────────────
const GOOGLE_NEWS_QUERIES = [
  '"AI implementation" ("law firm" OR "legal" OR "pharma" OR "healthcare" OR "financial services")',
  '"artificial intelligence" "we don\'t know where to start" OR "struggling to implement" OR "failed pilot"',
  '"AI strategy" ("SMB" OR "small business" OR "mid-size" OR "family business")',
  '"AI governance" ("compliance" OR "regulated" OR "risk") -"job" -"hiring"',
  '"digital transformation" ("overwhelmed" OR "behind" OR "don\'t know how") AI',
  '"Chief AI Officer" OR "fractional AI" ("need" OR "looking for" OR "hire")',
];

// ─── Industry classifier ─────────────────────────────────────────────────────
const INDUSTRY_KEYWORDS: [string, Lead['industry']][] = [
  ['pharma', 'pharma'], ['pharmaceutical', 'pharma'], ['biotech', 'pharma'], ['drug', 'pharma'],
  ['bank', 'finance'], ['financ', 'finance'], ['insurance', 'finance'], ['wealth', 'finance'], ['hedge fund', 'finance'],
  ['law firm', 'legal'], ['legal', 'legal'], ['attorney', 'legal'], ['counsel', 'legal'], ['barrister', 'legal'],
  ['hospital', 'healthcare'], ['healthcare', 'healthcare'], ['health care', 'healthcare'], ['clinic', 'healthcare'], ['medical', 'healthcare'],
];

function detectIndustry(text: string): Lead['industry'] {
  const lower = text.toLowerCase();
  for (const [kw, industry] of INDUSTRY_KEYWORDS) {
    if (lower.includes(kw)) return industry;
  }
  return 'other';
}

// ─── Priority scorer ─────────────────────────────────────────────────────────
// Hot = explicit pain / active search for help
// Warm = announced initiative (will need help soon)
// Cold = general AI news in target industry
function scorePriority(text: string): Lead['priority'] {
  const t = text.toLowerCase();
  const hotSignals = [
    'struggling', 'failed', 'failure', 'challenge', 'problem', 'behind',
    'don\'t know', "don't know", 'overwhelmed', 'confused', 'worried',
    'seeking help', 'looking for', 'need a', 'hire a', 'fractional',
    'pilot went wrong', 'implementation issue', 'compliance risk'
  ];
  const warmSignals = [
    'announced', 'launches', 'launched', 'beginning', 'starting',
    'partnership', 'initiative', 'exploring', 'piloting', 'strategy'
  ];

  if (hotSignals.some(s => t.includes(s))) return 'hot';
  if (warmSignals.some(s => t.includes(s))) return 'warm';
  return 'cold';
}

// ─── Company name extractor from news headline ───────────────────────────────
// Tries to pull the org name from a title like "Acme Corp launches AI initiative"
function extractCompanyFromTitle(title: string, sourceName: string): string {
  // Pattern: "OrgName verb AI..." at start of sentence
  const match = title.match(/^([A-Z][A-Za-z0-9&\s',.-]{2,40}?)\s+(launches|announces|says|warns|faces|struggles|adopts|pilots|hires|seeks)/);
  if (match) return match[1].trim();
  // Fallback: "How OrgName is..."
  const match2 = title.match(/(?:How|Why|When)\s+([A-Z][A-Za-z0-9&\s',.-]{2,40}?)\s+(?:is|are|was|has)/);
  if (match2) return match2[1].trim();
  // Fallback to news source name
  return sourceName || 'Unknown';
}

// ─── Google News RSS scraper ─────────────────────────────────────────────────
async function scrapeGoogleNews(query: string): Promise<Lead[]> {
  const leads: Lead[] = [];
  try {
    const url = `https://news.google.com/rss/search?q=${encodeURIComponent(query)}&hl=en-US&gl=US&ceid=US:en`;
    const res = await fetch(url, {
      headers: { 'Accept': 'application/rss+xml,application/xml,text/xml,*/*' },
      signal: AbortSignal.timeout(15000),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const xml = await res.text();
    const $ = load(xml, { xmlMode: true });

    $('item').slice(0, 8).each((_, el) => {
      const title       = $(el).find('title').first().text().trim();
      const link        = $(el).find('link').first().text().trim();
      const sourceName  = $(el).find('source').first().text().trim();
      const description = $(el).find('description').first().text().replace(/<[^>]*>/g, '').trim();

      if (!title || !link) return;

      const fullText = `${title} ${description} ${sourceName}`;
      const industry = detectIndustry(fullText);
      if (industry === 'other') return;

      const priority    = scorePriority(fullText);
      const companyName = extractCompanyFromTitle(title, sourceName);

      leads.push({
        id: `gn-${Buffer.from(link).toString('base64').slice(0, 16)}-${Date.now()}`,
        source: 'news',
        company_name: companyName,
        industry,
        signal: title,
        signal_url: link,
        priority,
        scraped_at: new Date().toISOString(),
        synced_to_hubspot: false,
      });
    });

    console.log(`  ✓ Google News [${query.slice(0, 50)}...]: ${leads.length} leads`);
  } catch (err: any) {
    console.log(`  ✗ Google News [${query.slice(0, 50)}...]: ${err.message}`);
  }
  return leads;
}

// ─── TechCrunch RSS ───────────────────────────────────────────────────────────
async function scrapeTechCrunch(): Promise<Lead[]> {
  const leads: Lead[] = [];
  try {
    const res = await fetch('https://techcrunch.com/feed/', {
      headers: { 'Accept': 'application/rss+xml,*/*' },
      signal: AbortSignal.timeout(15000),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const xml = await res.text();
    const $ = load(xml, { xmlMode: true });

    $('item').each((_, el) => {
      const title       = $(el).find('title').first().text().trim();
      const link        = $(el).find('link').first().text().trim();
      const description = $(el).find('description').first().text().replace(/<[^>]*>/g, '').trim();

      const fullText = `${title} ${description}`;
      const lower = fullText.toLowerCase();

      const isAI      = lower.includes(' ai ') || lower.includes('artificial intelligence') || lower.includes('machine learning');
      const industry  = detectIndustry(fullText);
      const isSMB     = lower.includes('smb') || lower.includes('small business') || lower.includes('mid-market');

      if (!isAI || (industry === 'other' && !isSMB)) return;

      leads.push({
        id: `tc-${Buffer.from(link).toString('base64').slice(0, 16)}-${Date.now()}`,
        source: 'news',
        company_name: extractCompanyFromTitle(title, 'TechCrunch'),
        industry: industry === 'other' ? 'other' : industry,
        signal: title,
        signal_url: link,
        priority: scorePriority(fullText),
        scraped_at: new Date().toISOString(),
        synced_to_hubspot: false,
      });
    });

    console.log(`  ✓ TechCrunch: ${leads.length} relevant items`);
  } catch (err: any) {
    console.log(`  ✗ TechCrunch: ${err.message}`);
  }
  return leads;
}

// ─── Hacker News API (recent stories about AI + business) ───────────────────
async function scrapeHackerNews(): Promise<Lead[]> {
  const leads: Lead[] = [];
  try {
    const queries = [
      'AI implementation business regulated',
      'artificial intelligence SMB governance',
      'fractional Chief AI Officer',
    ];
    const since = Math.floor(Date.now() / 1000) - 7 * 24 * 3600; // last 7 days

    for (const q of queries) {
      const url = `https://hn.algolia.com/api/v1/search?query=${encodeURIComponent(q)}&tags=story&hitsPerPage=10&numericFilters=created_at_i>${since}`;
      const res = await fetch(url, { signal: AbortSignal.timeout(10000) });
      const data: any = await res.json();

      for (const hit of data.hits || []) {
        if (!hit.title) continue;
        const storyUrl = hit.url || `https://news.ycombinator.com/item?id=${hit.objectID}`;
        const fullText = `${hit.title} ${hit.story_text || ''}`;
        const industry = detectIndustry(fullText);

        leads.push({
          id: `hn-${hit.objectID}`,
          source: 'news',
          company_name: extractCompanyFromTitle(hit.title, 'HN Discussion'),
          industry: industry === 'other' ? 'other' : industry,
          signal: hit.title,
          signal_url: storyUrl,
          priority: hit.points > 100 ? 'hot' : hit.points > 30 ? 'warm' : 'cold',
          scraped_at: new Date().toISOString(),
          synced_to_hubspot: false,
        });
      }
    }
    console.log(`  ✓ Hacker News: ${leads.length} items`);
  } catch (err: any) {
    console.log(`  ✗ Hacker News: ${err.message}`);
  }
  return leads;
}

// ─── Main export ─────────────────────────────────────────────────────────────
export async function runLeadFinderSwarmFree(): Promise<Lead[]> {
  console.log('🎯 ICP: Regulated industry execs + SMB owners needing AI implementation help\n');

  // Run all scrapers in parallel
  console.log('📰 Scraping Google News...');
  const googleLeads = await Promise.all(GOOGLE_NEWS_QUERIES.map(q => scrapeGoogleNews(q)));

  console.log('\n🟢 Scraping TechCrunch RSS...');
  const tcLeads = await scrapeTechCrunch();

  console.log('\n🔶 Scraping Hacker News...');
  const hnLeads = await scrapeHackerNews();

  // Merge + deduplicate by signal_url
  const all = [...googleLeads.flat(), ...tcLeads, ...hnLeads];
  const seen = new Set<string>();
  const unique = all.filter(lead => {
    if (seen.has(lead.signal_url)) return false;
    seen.add(lead.signal_url);
    return true;
  });

  const hot  = unique.filter(l => l.priority === 'hot');
  const warm = unique.filter(l => l.priority === 'warm');
  const cold = unique.filter(l => l.priority === 'cold');

  console.log(`\n✅ Found ${unique.length} unique leads`);
  console.log(`   Hot:  ${hot.length}`);
  console.log(`   Warm: ${warm.length}`);
  console.log(`   Cold: ${cold.length}`);

  return unique;
}
