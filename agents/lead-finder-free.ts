// Lead Finder Agent — ANALOG AI VERSION v3
// ICP: 1–50 employee traditional professional services (law, accounting, insurance, finance)
//      LAGGARDS who are BEHIND competitors on digital/AI adoption — NOT early adopters
//
// v3 CHANGES:
//   - Simplified queries (Google News RSS handles simple queries better than complex boolean)
//   - Removed over-aggressive publisher source filter (articles IN media ABOUT firms are valuable)
//   - Added Gemini AI analysis to extract actual company names and qualify leads
//   - Focused on Pedro's actual markets: Portugal, Spain, Poland, UK/Europe
//   - Batch headlines → Gemini → structured lead extraction
//
// Sources: Google News RSS (multilingual), Hacker News
// No Playwright needed — pure HTTP fetch + Gemini

import { load } from 'cheerio';
import { createHash } from 'crypto';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import type { Lead } from './types';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ── Feedback boosts ─────────────────────────────────────────────────────────
interface FeedbackBoosts { domains: Set<string> }
let FEEDBACK_BOOSTS: FeedbackBoosts = { domains: new Set() };

function loadFeedbackBoosts(): void {
  const feedbackPath = path.join(__dirname, '..', 'feedback', 'good-leads.txt');
  if (!fs.existsSync(feedbackPath)) return;
  const lines = fs.readFileSync(feedbackPath, 'utf-8').split('\n');
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    try {
      const hostname = new URL(trimmed).hostname.replace(/^www\./, '');
      FEEDBACK_BOOSTS.domains.add(hostname);
    } catch (_) { /* skip non-URL lines */ }
  }
  if (FEEDBACK_BOOSTS.domains.size > 0) {
    console.log(`📚 Feedback: ${FEEDBACK_BOOSTS.domains.size} trusted domains loaded`);
  }
}

// ── Stable ID from URL ──────────────────────────────────────────────────────
function stableId(prefix: string, url: string): string {
  return `${prefix}-${createHash('md5').update(url).digest('hex').slice(0, 16)}`;
}

// ── Negative filters (Fortune 500, VC, Big 4 — NOT Pedro's ICP) ─────────────
const NEGATIVE_SIGNALS = [
  'google', 'microsoft', 'amazon', 'meta', 'apple', 'nvidia', 'openai', 'anthropic',
  'novo nordisk', 'pfizer', 'roche', 'novartis', 'astrazeneca',
  'goldman sachs', 'jpmorgan', 'blackrock', 'bank of america',
  'series a', 'series b', 'series c', 'funding round', 'raises $', 'raises €',
  'venture capital', 'deloitte', 'pwc', 'kpmg', 'ernst & young', 'mckinsey',
  'allen & overy', 'linklaters', 'freshfields', 'clifford chance', 'baker mckenzie',
  'dentons', 'latham & watkins', 'skadden', 'kirkland',
];

function isNegativeLead(text: string): boolean {
  const t = text.toLowerCase();
  return NEGATIVE_SIGNALS.some(term => t.includes(term));
}

// ── Raw article from RSS ────────────────────────────────────────────────────
interface RawArticle {
  title: string;
  link: string;
  source: string;
  market: string;
  lang: string;
}

// ── Search queries — SIMPLIFIED for better Google News RSS results ───────────
// Google News RSS works best with simple 2-4 word queries, not complex boolean
interface NewsQuery {
  query: string;
  lang: string;
  country: string;
  ceid: string;
  market: string;
}

const GOOGLE_NEWS_QUERIES: NewsQuery[] = [
  // ── English (UK/Europe) — simple, effective queries ─────────────────────
  { query: 'small law firm AI adoption', lang: 'en', country: 'GB', ceid: 'GB:en', market: 'UK' },
  { query: 'law firm automation struggling', lang: 'en', country: 'GB', ceid: 'GB:en', market: 'UK' },
  { query: 'small accounting firm technology', lang: 'en', country: 'GB', ceid: 'GB:en', market: 'UK' },
  { query: 'insurance broker digital transformation', lang: 'en', country: 'GB', ceid: 'GB:en', market: 'UK' },
  { query: 'SMB professional services AI behind', lang: 'en', country: 'GB', ceid: 'GB:en', market: 'Europe' },
  { query: 'EU AI Act small business compliance', lang: 'en', country: 'GB', ceid: 'GB:en', market: 'Europe' },
  { query: 'boutique law firm technology adoption', lang: 'en', country: 'US', ceid: 'US:en', market: 'US/Global' },

  // ── Polish ─────────────────────────────────────────────────────────────
  { query: 'kancelaria prawna AI automatyzacja', lang: 'pl', country: 'PL', ceid: 'PL:pl', market: 'Poland' },
  { query: 'biuro rachunkowe sztuczna inteligencja', lang: 'pl', country: 'PL', ceid: 'PL:pl', market: 'Poland' },
  { query: 'małe firmy digitalizacja wyzwania', lang: 'pl', country: 'PL', ceid: 'PL:pl', market: 'Poland' },
  { query: 'kancelaria technologia wdrożenie', lang: 'pl', country: 'PL', ceid: 'PL:pl', market: 'Poland' },

  // ── Portuguese ─────────────────────────────────────────────────────────
  { query: 'escritório advogados inteligência artificial', lang: 'pt-PT', country: 'PT', ceid: 'PT:pt-PT', market: 'Portugal' },
  { query: 'PME digitalização transformação digital', lang: 'pt-PT', country: 'PT', ceid: 'PT:pt-PT', market: 'Portugal' },
  { query: 'contabilidade automatização tecnologia', lang: 'pt-PT', country: 'PT', ceid: 'PT:pt-PT', market: 'Portugal' },
  { query: 'pequenas empresas IA adoção', lang: 'pt-PT', country: 'PT', ceid: 'PT:pt-PT', market: 'Portugal' },

  // ── Spanish ────────────────────────────────────────────────────────────
  { query: 'despacho abogados inteligencia artificial', lang: 'es', country: 'ES', ceid: 'ES:es', market: 'Spain' },
  { query: 'asesoría gestoría automatización', lang: 'es', country: 'ES', ceid: 'ES:es', market: 'Spain' },
  { query: 'PYME digitalización atrás competencia', lang: 'es', country: 'ES', ceid: 'ES:es', market: 'Spain' },
  { query: 'pequeña empresa IA adopción', lang: 'es', country: 'ES', ceid: 'ES:es', market: 'Spain' },

  // ── French ─────────────────────────────────────────────────────────────
  { query: "cabinet avocats intelligence artificielle", lang: 'fr', country: 'FR', ceid: 'FR:fr', market: 'France' },
  { query: "PME transformation numérique retard", lang: 'fr', country: 'FR', ceid: 'FR:fr', market: 'France' },

  // ── German ─────────────────────────────────────────────────────────────
  { query: 'Kanzlei KI Digitalisierung', lang: 'de', country: 'DE', ceid: 'DE:de', market: 'Germany' },
  { query: 'Mittelstand KI Automatisierung', lang: 'de', country: 'DE', ceid: 'DE:de', market: 'Germany' },

  // ── Italian ────────────────────────────────────────────────────────────
  { query: 'studio legale intelligenza artificiale', lang: 'it', country: 'IT', ceid: 'IT:it', market: 'Italy' },
  { query: 'PMI digitalizzazione automazione', lang: 'it', country: 'IT', ceid: 'IT:it', market: 'Italy' },
];

// ── Google News RSS fetcher ─────────────────────────────────────────────────
async function fetchGoogleNewsRSS(nq: NewsQuery): Promise<RawArticle[]> {
  const articles: RawArticle[] = [];
  try {
    const url = `https://news.google.com/rss/search?q=${encodeURIComponent(nq.query)}+when:3d&hl=${nq.lang}&gl=${nq.country}&ceid=${nq.ceid}`;
    const res = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; AnalogAI-LeadFinder/3.0)' },
      signal: AbortSignal.timeout(15000),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const xml = await res.text();
    const $ = load(xml, { xmlMode: true });

    $('item').slice(0, 8).each((_, el) => {
      const title = $(el).find('title').first().text().trim();
      const link = $(el).find('link').first().text().trim();
      const source = $(el).find('source').first().text().trim();
      if (!title || !link) return;

      // Only skip if the headline itself is about Fortune 500 / VC
      const fullText = `${title} ${source}`;
      if (isNegativeLead(fullText)) return;

      articles.push({ title, link, source, market: nq.market, lang: nq.lang });
    });

    console.log(`  ✓ [${nq.market}/${nq.lang}] "${nq.query.slice(0, 35)}..." → ${articles.length} articles`);
  } catch (err: any) {
    console.log(`  ✗ [${nq.market}] "${nq.query.slice(0, 35)}...": ${err.message}`);
  }
  return articles;
}

// ── Hacker News fetcher ─────────────────────────────────────────────────────
async function fetchHackerNews(): Promise<RawArticle[]> {
  const articles: RawArticle[] = [];
  try {
    const queries = [
      'small law firm AI',
      'accounting firm automation',
      'professional services AI implementation',
      'small business AI struggling',
    ];
    const since = Math.floor(Date.now() / 1000) - 7 * 24 * 3600;

    for (const q of queries) {
      const url = `https://hn.algolia.com/api/v1/search?query=${encodeURIComponent(q)}&tags=story&hitsPerPage=5&numericFilters=created_at_i>${since}`;
      const res = await fetch(url, { signal: AbortSignal.timeout(10000) });
      const data: any = await res.json();

      for (const hit of data.hits || []) {
        if (!hit.title || isNegativeLead(hit.title)) continue;
        articles.push({
          title: hit.title,
          link: hit.url || `https://news.ycombinator.com/item?id=${hit.objectID}`,
          source: 'Hacker News',
          market: 'Global',
          lang: 'en',
        });
      }
    }
    console.log(`  ✓ Hacker News: ${articles.length} articles`);
  } catch (err: any) {
    console.log(`  ✗ Hacker News: ${err.message}`);
  }
  return articles;
}

// ── Gemini AI lead qualifier ────────────────────────────────────────────────
// This is the KEY improvement: instead of regex extraction, we send batches
// of headlines to Gemini and ask it to identify actual SMB prospects.

interface GeminiLeadResult {
  headline_index: number;
  company_name: string;       // Actual company name, or "SECTOR_SIGNAL"
  industry: string;           // legal, finance, healthcare, other
  priority: string;           // hot, warm, cold
  why_actionable: string;     // 1-sentence reason Pedro should care
  outreach_angle: string;     // How Pedro could approach this
}

async function qualifyLeadsWithGemini(articles: RawArticle[]): Promise<GeminiLeadResult[]> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.warn('⚠️  GEMINI_API_KEY not set — falling back to keyword scoring');
    return [];
  }

  // Process in batches of 15 headlines
  const batchSize = 15;
  const allResults: GeminiLeadResult[] = [];

  for (let i = 0; i < articles.length; i += batchSize) {
    const batch = articles.slice(i, i + batchSize);
    const headlineList = batch.map((a, idx) =>
      `${i + idx}. "${a.title}" — Source: ${a.source} [${a.market}/${a.lang}]`
    ).join('\n');

    const prompt = `You are a lead qualification system for Pedro Bandeira — a 50yo AI consultant who helps 1-50 employee professional services firms (law, accounting, insurance) adopt AI.

His ICP (Ideal Customer Profile):
- Small/boutique law firms, accounting practices, insurance brokerages
- 1-50 employees, traditional operations, NOT tech-forward
- Based in Europe (priority: Portugal, Spain, Poland, UK)
- Firms that are BEHIND their competitors on technology adoption
- Firms expressing pain: overwhelmed, losing clients, manual processes

What Pedro does NOT want:
- Big Law (100+ lawyers), Big 4 accounting, Fortune 500
- VC-funded startups, AI tool companies, SaaS vendors
- Pure media/opinion articles with no company mentioned
- General "AI is changing everything" articles with no specific firm

HEADLINES TO ANALYZE:
${headlineList}

For EACH headline, determine:
1. Does it mention or reference a SPECIFIC small/mid firm that matches Pedro's ICP?
2. Or is it a SECTOR SIGNAL (e.g., "law firms are adopting AI") that Pedro can use to reach out to similar firms in that market?
3. Or is it IRRELEVANT (big tech, general news, not actionable)?

OUTPUT FORMAT — JSON array, one object per RELEVANT headline only (skip irrelevant ones):
[
  {
    "headline_index": 0,
    "company_name": "Smith & Associates" or "SECTOR_SIGNAL",
    "industry": "legal" or "finance" or "healthcare" or "other",
    "priority": "hot" or "warm" or "cold",
    "why_actionable": "Small Portuguese law firm mentioned as struggling with client management",
    "outreach_angle": "Pedro could offer AI workflow audit, referencing their public pain point"
  }
]

PRIORITY RULES:
- HOT: Specific company name + clear pain signal (struggling, behind, seeking help, hiring for AI)
- WARM: Sector signal in Pedro's market (sector adopting AI → reach out to the ones NOT mentioned)
- COLD: Tangentially relevant, needs more research

Be aggressive about filtering — Pedro gets 20+ headlines/day. Only surface the ones worth his 30 seconds of attention.
Output ONLY valid JSON. No explanation text.`;

    try {
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: { temperature: 0.3, maxOutputTokens: 2000 },
          }),
        }
      );

      if (!res.ok) {
        console.warn(`  ⚠️  Gemini API error: ${res.status}`);
        continue;
      }

      const data = await res.json();
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() ?? '';
      if (!text) continue;

      // Parse JSON (handle markdown fences)
      const cleaned = text.replace(/```json?\n?/g, '').replace(/```\n?/g, '').trim();
      const jsonMatch = cleaned.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        try {
          const parsed: GeminiLeadResult[] = JSON.parse(jsonMatch[0]);
          allResults.push(...parsed);
        } catch (parseErr) {
          console.warn(`  ⚠️  Gemini JSON parse failed for batch starting at ${i}`);
        }
      }
    } catch (err: any) {
      console.warn(`  ⚠️  Gemini batch error: ${err.message}`);
    }

    // Rate limit between batches
    if (i + batchSize < articles.length) {
      await new Promise(r => setTimeout(r, 1000));
    }
  }

  return allResults;
}

// ── Industry classifier (keyword fallback when Gemini unavailable) ──────────
const INDUSTRY_KEYWORDS: [string, Lead['industry']][] = [
  ['law firm', 'legal'], ['legal', 'legal'], ['attorney', 'legal'], ['solicitor', 'legal'],
  ['kancelaria', 'legal'], ['escritório de advogados', 'legal'], ['advogado', 'legal'],
  ['despacho de abogados', 'legal'], ['abogado', 'legal'],
  ["cabinet d'avocats", 'legal'], ['avocat', 'legal'],
  ['kanzlei', 'legal'], ['anwalt', 'legal'],
  ['studio legale', 'legal'], ['avvocato', 'legal'],
  ['accounting', 'finance'], ['accountant', 'finance'], ['insurance', 'finance'],
  ['biuro rachunkowe', 'finance'], ['księgowość', 'finance'],
  ['contabilidade', 'finance'], ['contabilista', 'finance'],
  ['asesoría', 'finance'], ['gestoría', 'finance'],
  ['steuerberater', 'finance'], ['commercialista', 'finance'],
  ['hospital', 'healthcare'], ['healthcare', 'healthcare'], ['clinic', 'healthcare'],
  ['pharma', 'pharma'], ['pharmaceutical', 'pharma'],
];

function detectIndustry(text: string): Lead['industry'] {
  const lower = text.toLowerCase();
  for (const [kw, industry] of INDUSTRY_KEYWORDS) {
    if (lower.includes(kw)) return industry;
  }
  return 'other';
}

// ── Keyword-based priority (fallback) ───────────────────────────────────────
function keywordPriority(text: string): Lead['priority'] {
  const t = text.toLowerCase();
  const hotWords = ['struggling', 'behind', 'failing', 'overwhelmed', 'losing clients',
    'manual process', 'falling behind', 'trudności', 'dificuldades', 'dificultades',
    'difficultés', 'schwierigkeiten', 'difficoltà'];
  const warmWords = ['adopting', 'transformation', 'digitali', 'trend', 'sector',
    'compliance', 'eu ai act', 'regulation'];
  if (hotWords.some(w => t.includes(w))) return 'hot';
  if (warmWords.some(w => t.includes(w))) return 'warm';
  return 'cold';
}

// ── Convert Gemini results + raw articles → Lead[] ──────────────────────────
function buildLeads(articles: RawArticle[], geminiResults: GeminiLeadResult[]): Lead[] {
  const leads: Lead[] = [];
  const usedIndices = new Set<number>();

  // First: Gemini-qualified leads (higher quality)
  for (const result of geminiResults) {
    const idx = result.headline_index;
    if (idx < 0 || idx >= articles.length) continue;
    usedIndices.add(idx);
    const article = articles[idx];

    const isSectorSignal = result.company_name === 'SECTOR_SIGNAL';
    const companyName = isSectorSignal
      ? `📡 [${article.market}] ${result.why_actionable.slice(0, 60)}`
      : result.company_name;

    const priority = (['hot', 'warm', 'cold'] as const).includes(result.priority as any)
      ? result.priority as Lead['priority']
      : 'cold';

    const industry = (['legal', 'finance', 'healthcare', 'pharma', 'other'] as const).includes(result.industry as any)
      ? result.industry as Lead['industry']
      : detectIndustry(article.title);

    // Apply feedback boost
    let finalPriority = priority;
    if (FEEDBACK_BOOSTS.domains.size > 0) {
      try {
        const hostname = new URL(article.link).hostname.replace(/^www\./, '');
        if (FEEDBACK_BOOSTS.domains.has(hostname)) {
          if (finalPriority === 'cold') finalPriority = 'warm';
          else if (finalPriority === 'warm') finalPriority = 'hot';
        }
      } catch (_) {}
    }

    leads.push({
      id: stableId('gn', article.link),
      source: 'news',
      company_name: companyName,
      industry,
      signal: `${article.title} | ${result.outreach_angle || result.why_actionable}`,
      signal_url: article.link,
      priority: finalPriority,
      scraped_at: new Date().toISOString(),
      synced_to_hubspot: false,
    });
  }

  // Second: keyword-based fallback for articles Gemini didn't analyze
  // (only if Gemini returned nothing — e.g., API key missing)
  if (geminiResults.length === 0) {
    for (let i = 0; i < articles.length; i++) {
      if (usedIndices.has(i)) continue;
      const article = articles[i];
      const industry = detectIndustry(article.title);
      if (industry === 'other') continue; // Skip off-ICP articles in fallback mode

      leads.push({
        id: stableId('gn', article.link),
        source: 'news',
        company_name: `📡 [${article.market}] Sector Signal`,
        industry,
        signal: article.title,
        signal_url: article.link,
        priority: keywordPriority(article.title),
        scraped_at: new Date().toISOString(),
        synced_to_hubspot: false,
      });
    }
  }

  return leads;
}

// ─── Main export ─────────────────────────────────────────────────────────────
export async function runLeadFinderSwarmFree(): Promise<Lead[]> {
  console.log('🎯 ICP: 1–50 employee professional services (law, accounting, insurance)');
  console.log('🎯 Mode: v3 — RSS + Gemini AI qualification\n');

  loadFeedbackBoosts();

  // Step 1: Fetch all raw articles from Google News + Hacker News
  console.log('📰 Fetching news (simplified queries, 7 markets)...');

  // Batch Google News requests (5 at a time to avoid rate limits)
  const allArticles: RawArticle[] = [];
  for (let i = 0; i < GOOGLE_NEWS_QUERIES.length; i += 5) {
    const batch = GOOGLE_NEWS_QUERIES.slice(i, i + 5);
    const results = await Promise.all(batch.map(nq => fetchGoogleNewsRSS(nq)));
    allArticles.push(...results.flat());
    if (i + 5 < GOOGLE_NEWS_QUERIES.length) {
      await new Promise(r => setTimeout(r, 500));
    }
  }

  console.log('\n🔶 Fetching Hacker News...');
  const hnArticles = await fetchHackerNews();
  allArticles.push(...hnArticles);

  // Deduplicate by URL
  const seen = new Set<string>();
  const uniqueArticles = allArticles.filter(a => {
    const key = a.link.toLowerCase();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  console.log(`\n📊 ${uniqueArticles.length} unique articles fetched`);

  if (uniqueArticles.length === 0) {
    console.log('⚠️  No articles found — nothing to qualify');
    return [];
  }

  // Step 2: Send to Gemini for AI qualification
  console.log('\n🤖 Qualifying leads with Gemini AI...');
  const geminiResults = await qualifyLeadsWithGemini(uniqueArticles);
  console.log(`   Gemini identified ${geminiResults.length} actionable leads`);

  // Step 3: Build final lead list
  const leads = buildLeads(uniqueArticles, geminiResults);

  // Deduplicate leads by signal_url
  const seenUrls = new Set<string>();
  const uniqueLeads = leads.filter(l => {
    if (seenUrls.has(l.signal_url)) return false;
    seenUrls.add(l.signal_url);
    return true;
  });

  const hot = uniqueLeads.filter(l => l.priority === 'hot');
  const warm = uniqueLeads.filter(l => l.priority === 'warm');
  const cold = uniqueLeads.filter(l => l.priority === 'cold');

  console.log(`\n✅ Found ${uniqueLeads.length} qualified leads`);
  console.log(`   🔥 Hot:  ${hot.length} (specific companies with pain signals)`);
  console.log(`   🟡 Warm: ${warm.length} (sector signals in Pedro's markets)`);
  console.log(`   ❄️  Cold: ${cold.length} (tangentially relevant)`);

  if (hot.length > 0) {
    console.log(`\n🔥 TOP HOT LEADS:`);
    hot.slice(0, 5).forEach(l => {
      console.log(`   • ${l.company_name} — ${l.signal.slice(0, 80)}`);
    });
  }

  return uniqueLeads;
}
