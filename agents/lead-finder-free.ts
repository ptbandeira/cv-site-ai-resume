// Lead Finder Agent — FREE VERSION (No API costs)
// Uses Playwright + Cheerio for scraping instead of Firecrawl

import { chromium } from 'playwright';
import type { Lead } from './types';

// Job search queries (same as before)
const JOB_SEARCH_QUERIES = [
  'Chief AI Officer pharma',
  'VP Digital Transformation finance',
  'Head of Compliance Technology',
  'AI Governance Director',
  'Chief Data Officer healthcare',
  'Digital Transformation Leader legal'
];

const REGULATED_INDUSTRIES = [
  'pharmaceutical', 'pharma', 'biotech',
  'banking', 'finance', 'fintech', 'insurance',
  'legal', 'law firm', 'litigation',
  'healthcare', 'hospital', 'medical device'
];

/**
 * Scrape LinkedIn Jobs using Playwright (FREE, no API)
 */
export async function scrapeLinkedInJobsFree(): Promise<Lead[]> {
  const leads: Lead[] = [];

  // Launch browser
  const browser = await chromium.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
  });

  const page = await context.newPage();

  for (const query of JOB_SEARCH_QUERIES) {
    try {
      // Navigate to LinkedIn Jobs (public search, no login needed)
      const searchUrl = `https://www.linkedin.com/jobs/search/?keywords=${encodeURIComponent(query)}&location=Worldwide&f_TPR=r86400`;

      await page.goto(searchUrl, { waitUntil: 'networkidle' });
      await page.waitForTimeout(2000); // Let page load

      // Extract job listings
      const jobs = await page.evaluate(() => {
        const jobCards = Array.from(document.querySelectorAll('.base-card'));

        return jobCards.map(card => {
          const titleEl = card.querySelector('.base-search-card__title');
          const companyEl = card.querySelector('.base-search-card__subtitle');
          const locationEl = card.querySelector('.job-search-card__location');
          const linkEl = card.querySelector('a');

          return {
            title: titleEl?.textContent?.trim() || '',
            company: companyEl?.textContent?.trim() || '',
            location: locationEl?.textContent?.trim() || '',
            url: linkEl?.href || ''
          };
        }).filter(job => job.title && job.company);
      });

      // Filter for regulated industries
      const filteredJobs = jobs.filter(job => {
        const text = `${job.title} ${job.company}`.toLowerCase();
        return REGULATED_INDUSTRIES.some(industry => text.includes(industry));
      });

      // Convert to Lead format
      for (const job of filteredJobs) {
        leads.push({
          id: `job-${Date.now()}-${Math.random()}`,
          source: 'job_board',
          company_name: job.company,
          industry: inferIndustry(job.company, job.title),
          signal: `Posted ${job.title} role`,
          signal_url: job.url,
          priority: assessPriority(job.title),
          scraped_at: new Date().toISOString(),
          synced_to_hubspot: false
        });
      }

      console.log(`✓ Found ${filteredJobs.length} leads for "${query}"`);

      // Rate limiting: 3 seconds between queries
      await page.waitForTimeout(3000);

    } catch (error) {
      console.error(`Error scraping "${query}":`, error);
    }
  }

  await browser.close();
  return leads;
}

/**
 * Scrape TechCrunch for AI funding news (FREE, no API)
 */
export async function scrapeTechCrunchNews(): Promise<Lead[]> {
  const leads: Lead[] = [];

  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  try {
    // TechCrunch AI tag
    await page.goto('https://techcrunch.com/tag/artificial-intelligence/', {
      waitUntil: 'networkidle'
    });

    // Extract articles
    const articles = await page.evaluate(() => {
      const items = Array.from(document.querySelectorAll('article'));

      return items.slice(0, 20).map(article => {
        const titleEl = article.querySelector('h2 a');
        const excerptEl = article.querySelector('.article-content');

        return {
          title: titleEl?.textContent?.trim() || '',
          url: titleEl?.getAttribute('href') || '',
          excerpt: excerptEl?.textContent?.trim() || ''
        };
      }).filter(a => a.title);
    });

    // Look for funding announcements in regulated industries
    for (const article of articles) {
      const text = `${article.title} ${article.excerpt}`.toLowerCase();

      // Check if it's about regulated industries
      const hasIndustry = REGULATED_INDUSTRIES.some(ind => text.includes(ind));

      // Check if it's about funding or AI initiatives
      const hasFunding = text.match(/raises|funding|series [abc]|million|capital/);
      const hasAI = text.match(/artificial intelligence|machine learning|ai platform/);

      if (hasIndustry && (hasFunding || hasAI)) {
        // Extract company name (basic heuristic)
        const companyMatch = article.title.match(/^([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)/);
        const companyName = companyMatch ? companyMatch[1] : 'Unknown Company';

        leads.push({
          id: `news-${Date.now()}-${Math.random()}`,
          source: 'news',
          company_name: companyName,
          industry: inferIndustry(companyName, article.excerpt),
          signal: article.title,
          signal_url: article.url,
          priority: 'warm',
          scraped_at: new Date().toISOString(),
          synced_to_hubspot: false
        });
      }
    }

  } catch (error) {
    console.error('Error scraping TechCrunch:', error);
  }

  await browser.close();
  return leads;
}

/**
 * Infer industry from company name and text
 */
function inferIndustry(companyName: string, text: string): Lead['industry'] {
  const combined = `${companyName} ${text}`.toLowerCase();

  if (combined.match(/pharma|biotech|drug|clinical/)) return 'pharma';
  if (combined.match(/bank|financ|insurance|trading/)) return 'finance';
  if (combined.match(/law|legal|attorney|litigation/)) return 'legal';
  if (combined.match(/hospital|healthcare|medical/)) return 'healthcare';

  return 'other';
}

/**
 * Assess priority based on job title
 */
function assessPriority(title: string): Lead['priority'] {
  const lower = title.toLowerCase();

  if (lower.match(/chief|ceo|cto|cio/)) return 'hot';
  if (lower.match(/vp|vice president|director/)) return 'warm';

  return 'cold';
}

/**
 * Main orchestrator for FREE version
 */
export async function runLeadFinderSwarmFree(): Promise<Lead[]> {
  console.log('🔍 Starting Lead Finder Swarm (FREE VERSION)...');

  const [jobLeads, newsLeads] = await Promise.all([
    scrapeLinkedInJobsFree(),
    scrapeTechCrunchNews()
  ]);

  const allLeads = [...jobLeads, ...newsLeads];

  console.log(`✅ Found ${allLeads.length} leads`);
  console.log(`   Hot: ${allLeads.filter(l => l.priority === 'hot').length}`);
  console.log(`   Warm: ${allLeads.filter(l => l.priority === 'warm').length}`);
  console.log(`   Cold: ${allLeads.filter(l => l.priority === 'cold').length}`);

  return allLeads;
}

// Run if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runLeadFinderSwarmFree()
    .then(leads => {
      console.log('\n📊 Lead Summary:');
      console.log(JSON.stringify(leads.slice(0, 5), null, 2));
      console.log(`\n... and ${leads.length - 5} more`);
    })
    .catch(error => {
      console.error('❌ Error:', error);
      process.exit(1);
    });
}
