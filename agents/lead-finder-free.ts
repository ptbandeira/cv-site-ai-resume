// Lead Finder Agent — ANALOG AI VERSION
// ICP: Gen X executives and SMB owners in regulated industries who need
//      a business-side AI implementation partner (not a technical hire)
// Signal: Companies/execs publicly starting, struggling with, or asking about AI adoption
// Sources: Google News RSS, TechCrunch RSS, Hacker News API
// No Playwright needed — pure HTTP fetch

import { load } from 'cheerio';
import { createHash } from 'crypto';
import type { Lead } from './types';

// ── Known publishers / enterprises to exclude from leads ─────────────────────
// These are media outlets, think tanks, large enterprises — NOT SMB prospects.
// If company_name matches, the article is a source, not a lead.
const KNOWN_PUBLISHERS = new Set([
  // Legal media
  'law360', 'legaltech news', 'above the law', 'american lawyer', 'legal week',
  'the national law review', 'the national law journal', 'legal cheek',
  'lawyers monthly', 'the lawyer', 'legal futures', 'attorneys at law magazine',
  // Privacy / AI associations & think tanks
  'iapp', 'international association of privacy professionals',
  'future of privacy forum', 'electronic frontier foundation', 'eff',
  'ai now institute', 'partnership on ai', 'center for ai safety',
  'ada lovelace institute', 'alan turing institute', 'real instituto elcano',
  // General tech & business media
  'techcrunch', 'the verge', 'wired', 'ars technica', 'zdnet', 'cnet',
  'venturebeat', 'the information', 'protocol', 'semafor', 'axios',
  'business insider', 'fortune', 'forbes', 'bloomberg', 'reuters',
  'the guardian', 'financial times', 'ft', 'wall street journal', 'wsj',
  'new york times', 'nyt', 'washington post',
  // AI-specific media
  'the ai journal', 'ai business', 'ai news', 'towards data science',
  'analytics vidhya', 'kdnuggets', 'papers with code', 'financialcontent',
  'tmx newsfile', 'tmxnewsfile', 'newswire', 'pr newswire', 'businesswire',
  'globe newswire', 'accesswire', 'ein presswire',
  // Large enterprises (not SMBs)
  'wolters kluwer', 'lexisnexis', 'thomson reuters', 'westlaw', 'relx',
  'microsoft', 'google', 'amazon', 'meta', 'apple', 'ibm', 'oracle', 'sap',
  'deloitte', 'pwc', 'kpmg', 'ey', 'ernst & young', 'mckinsey', 'bcg', 'bain',
  'accenture', 'capgemini', 'infosys', 'tcs', 'wipro', 'cognizant',
  // Universities
  'mit', 'stanford', 'harvard', 'oxford', 'cambridge',
  'london school of economics', 'lse', 'imperial college', 'startups',
  // Additional publishers found in run logs
  'jd supra',
    // Additional publishers found in run logs
  'tech policy press',
    // Additional publishers found in run logs
  'digitaleurope',
    // Additional publishers found in run logs
  'economist impact',
    // Additional publishers found in run logs
  'oracle blogs',
    // Additional publishers found in run logs
  'microsoft source',
    // Additional publishers found in run logs
  'thomson reuters legal solutions',
    // Additional publishers found in run logs
  'orrick',
    // Additional publishers found in run logs
  'orrick.com',
    // Additional publishers found in run logs
  'crowell',
    // Additional publishers found in run logs
  'crowell & moring',
    // Additional publishers found in run logs
  'allen & overy',
    // Additional publishers found in run logs
  'linklaters',
    // Additional publishers found in run logs
  'freshfields',
    // Additional publishers found in run logs
  'clifford chance',
    // Additional publishers found in run logs
  'baker mckenzie',
    // Additional publishers found in run logs
  'dentons',
    // Additional publishers found in run logs
  'norton rose',
    // Additional publishers found in run logs
  'hogan lovells',
    // Additional publishers found in run logs
  'latham & watkins',
    // Additional publishers found in run logs
  'skadden',
    // Additional publishers found in run logs
  'sidley',
    // Additional publishers found in run logs
  'kirkland',
    // Additional publishers found in run logs
  'weil gotshal',
    // Polish media
  'rzeczpospolita', 'gazeta prawna', 'prawo.pl', 'lex.pl', 'nowoczesna firma',
  // Portuguese media
  'publico', 'jornal de negocios', 'expresso', 'observador', 'eco',
]);

function isKnownPublisher(name: string | null | undefined): boolean {
  if (!name) return false;
  const lower = name.toLowerCase().trim();
  // Strip common leading articles so "The Guardian" matches "guardian" etc.
  const stripped = lower.replace(/^(the|a|an) /, '');
  if (KNOWN_PUBLISHERS.has(lower)) return true;
  if (KNOWN_PUBLISHERS.has(stripped)) return true;
  // Also catch patterns like "Startups.co.uk", "TechCrunch | AI", or partial name matches
  for (const pub of KNOWN_PUBLISHERS) {
    if (lower.startsWith(pub) || stripped.startsWith(pub)) return true;
    if (lower.includes(' | ' + pub)) return true;
    // Catch "The London School of Economics and Political Science" matching "london school of economics"
    if (stripped.startsWith(pub) || lower.includes(pub)) return true;
  }
  return false;
}


// Stable ID from URL — same article = same ID across runs (enables Supabase dedup)
function stableId(prefix: string, url: string): string {
  return `${prefix}-${createHash('md5').update(url).digest('hex').slice(0, 16)}`;
}

// ─── ICP-tuned search queries ────────────────────────────────────────────────
// ICP: SMBs 50-500 employees. NOT Fortune 500.
// Target: Skeptical Stabilizer, Compliance Guardian, Frustrated Visionary, Legacy Modernizer
// AVOID: Big pharma, big tech, logistics giants, VC-backed startups
const GOOGLE_NEWS_QUERIES = [
  // EU AI Act — SMB and compliance focus (NOT Fortune 500)
  '"EU AI Act" ("law firm" OR "legal" OR "SMB" OR "compliance" OR "small business")',
  '"AI Act" ("kancelaria" OR "prawna" OR "compliance" OR "RODO" OR "mala firma")',

  // Law firm AI adoption (boutique / independent firms)
  '"law firm" ("AI" OR "artificial intelligence") ("compliance" OR "risk" OR "data privacy")',
  '"kancelaria" ("sztuczna inteligencja" OR "AI" OR "automatyzacja" OR "dane")',

  // Pharma SMB / CRO / Biotech (NOT Pfizer, Roche, Novartis)
  '"pharma" ("AI" OR "artificial intelligence") ("SMB" OR "small" OR "mid-market" OR "compliance" OR "CRO")',
  '"farmaceutyczna" ("AI" OR "sztuczna inteligencja" OR "automatyzacja" OR "zgodnosc")',

  // Logistics / Retail mid-market (NOT DHL, FedEx, Maersk)
  '"logistics" ("AI" OR "automation") ("mid-market" OR "regional" OR "independent" OR "SMB")',
  '"retail" ("AI" OR "automation") ("independent" OR "regional" OR "chain" OR "SMB")',

  // Poland market (ASCII-safe Polish queries)
  '"sztuczna inteligencja" ("firma" OR "mala firma" OR "wdrozenie" OR "compliance")',
  '"automatyzacja" ("kancelaria" OR "logistyka" OR "farmacja" OR "handel")',

  // Portugal market
  '"inteligencia artificial" ("empresa" OR "PME" OR "implementacao" OR "conformidade")',
  '"automacao" ("juridico" OR "farmaceutica" OR "logistica" OR "retalho")',

  // AI governance / data sovereignty (SMB angle)
  '"AI governance" ("SMB" OR "small business" OR "mid-market" OR "compliance")',
  '"data sovereignty" ("AI" OR "artificial intelligence") ("SMB" OR "enterprise" OR "compliance")',
];
// Companies to ignore — Pedro's ICP is SMBs, not Fortune 500
const NEGATIVE_COMPANY_FILTER = [
  'google', 'microsoft', 'amazon', 'meta', 'apple', 'nvidia',
  'novo nordisk', 'pfizer', 'roche', 'johnson', 'novartis', 'astrazeneca',
  'goldman sachs', 'jpmorgan', 'blackrock',
  'series a', 'series b', 'funding round', 'raises $', 'raises €',
];

function isNegativeLead(text: string): boolean {
  const t = text.toLowerCase();
  return NEGATIVE_COMPANY_FILTER.some(term => t.includes(term));
}


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
    'pilot went wrong', 'implementation issue', 'compliance risk',
    // EU AI Act urgency signals
    'deadline', 'penalty', 'fine', 'non-compliant', 'audit', 'enforcement',
    'august 2026', 'must comply', 'required to'
  ];
  const warmSignals = [
    'announced', 'launches', 'launched', 'beginning', 'starting',
    'partnership', 'initiative', 'exploring', 'piloting', 'strategy',
    // EU AI Act preparedness signals
    'eu ai act', 'ai regulation', 'ai governance', 'compliance program',
    'preparing for', 'getting ready', 'ai policy'
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
      // Keep ALL results from ICP queries — don't filter on industry
      // (EU AI Act / compliance articles affect all industries)
      const priority    = scorePriority(fullText);
      const companyName = extractCompanyFromTitle(title, sourceName);

      // ── Publisher filter: skip if company is a known media/enterprise source ──
      if (isKnownPublisher(companyName)) {
        console.log(`  ⏭  Skip publisher: ${companyName} — not an SMB prospect`);
        return; // skip to next in .each()
      }
      // ── end publisher filter ─────────────────────────────────────────────────

      leads.push({
        id: stableId('gn', link),
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
        id: stableId('tc', link),
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
