import "dotenv/config";
// scripts/generate-weekly-linkedin.ts
// Reads this week's Pulse items, picks the 3 most signal-rich,
// writes ONE cohesive LinkedIn post in Pedro's voice with a forward-looking close.
// Saves to linkedin-drafts/weekly-YYYY-MM-DD.md
//
// Usage:   npm run linkedin:weekly
// Usage:   npm run linkedin:weekly -- --days 7
// Env:     GEMINI_API_KEY, SITE_URL

import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.join(__dirname, '..');

const GEMINI_KEY = process.env.GEMINI_API_KEY;
const DRAFTS_DIR = path.join(ROOT, 'linkedin-drafts');

if (!GEMINI_KEY) {
  console.error('❌ Missing GEMINI_API_KEY');
  process.exit(1);
}

const args = process.argv.slice(2);
const daysArg = args.findIndex(a => a === '--days');
const LOOKBACK_DAYS = daysArg >= 0 ? parseInt(args[daysArg + 1] ?? '7') : 7;

// ─── Types ───────────────────────────────────────────────────────────────────

interface PulseItem {
  id: string;
  slug: string;
  category: string;
  noise: string;
  translation: string;
  action: string;
  date: string;
  isoDate?: string;
  keywords: string[];
  sources?: Array<{ label: string; url: string }>;
}

// ─── Gemini ──────────────────────────────────────────────────────────────────

async function callGemini(prompt: string): Promise<string> {
  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_KEY}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.75,
          maxOutputTokens: 1500,
          thinkingConfig: { thinkingBudget: 0 },
        },
      }),
    }
  );
  if (!res.ok) throw new Error(`Gemini API error: ${res.status} ${await res.text()}`);
  const data = await res.json();
  const parts = data.candidates?.[0]?.content?.parts ?? [];
  const text = parts.filter((p: any) => !p.thought).map((p: any) => p.text ?? '').join('')
               || parts.map((p: any) => p.text ?? '').join('');
  if (!text) throw new Error(`Gemini returned empty response. finishReason: ${data.candidates?.[0]?.finishReason}`);
  return text;
}

// ─── Generate the weekly post ─────────────────────────────────────────────────

async function generateWeeklyPost(items: PulseItem[], siteUrl: string, weekDate: string): Promise<string> {
  const pulseIndexUrl = `${siteUrl}/pulse`;

  // Give Gemini all items but ask it to pick the 3 most meaningful
  const itemsSummary = items.map((item, i) =>
    `${i + 1}. [${item.category}] ${item.translation}\n   Signal: ${item.noise}\n   My take: ${item.action}`
  ).join('\n\n');

  const prompt = `You are Pedro Bandeira, a 50-year-old Portuguese entrepreneur writing a weekly LinkedIn post. You've built analog businesses (events, corporate wellbeing) and now ship AI products: The Pulse newsletter and AgenticOS (AI tool for law firms). Based in Warsaw, Poland.

This week's Pulse had ${items.length} signals. Your job:
1. Pick the 3 most important/connected signals from the list below
2. Write ONE cohesive LinkedIn weekly recap post

Your LinkedIn style:
- Hook in the first line — a single observation that frames the whole week
- Then cover the 3 signals, weaving them into a connected narrative (not a bullet list)
- Use 1990s business analogies: file cabinets, switchboard operators, Rolodex, fax machines
- Direct, Gen-X energy — no hype, no buzzwords, no exclamation marks
- Close with ONE specific forward-looking line: what you're watching next week and why
- 4-6 hashtags at the bottom (lowercase, specific to the themes)
- Max 1,800 characters total
- End with this link: ${pulseIndexUrl}

This week's signals:

${itemsSummary}

Output only the post text — no labels, no "Here's the post:", no preamble.`;

  return callGemini(prompt);
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  const SITE_URL = process.env.SITE_URL || 'https://analog-ai.vercel.app';

  console.log(`📋 Weekly LinkedIn Recap — lookback: ${LOOKBACK_DAYS} day(s)`);

  // Load manifest
  const manifestPath = path.join(ROOT, 'public', 'manifest.json');
  if (!fs.existsSync(manifestPath)) {
    console.error('❌ manifest.json not found. Run publish first.');
    process.exit(1);
  }

  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'));
  const allItems: PulseItem[] = manifest.items ?? [];

  // Filter to recent items
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - LOOKBACK_DAYS);
  const recentItems = allItems.filter(item => {
    const d = new Date(item.isoDate ?? item.date);
    return d >= cutoff;
  });

  if (recentItems.length === 0) {
    console.log(`ℹ️  No Pulse items in the last ${LOOKBACK_DAYS} day(s). Nothing to recap.`);
    process.exit(0);
  }

  console.log(`📰 ${recentItems.length} Pulse items this week — generating weekly recap...`);

  if (!fs.existsSync(DRAFTS_DIR)) fs.mkdirSync(DRAFTS_DIR, { recursive: true });

  // Use ISO date for filename
  const weekDate = new Date().toISOString().split('T')[0];
  const draftFile = path.join(DRAFTS_DIR, `weekly-${weekDate}.md`);

  // Don't regenerate if already done today
  if (fs.existsSync(draftFile)) {
    console.log(`⏭  weekly-${weekDate}.md already exists — skipping.`);
    process.exit(0);
  }

  const post = await generateWeeklyPost(recentItems, SITE_URL, weekDate);

  // Build a summary of which items were available (Gemini picks the 3)
  const headlineList = recentItems.map(i => `- ${i.translation}`).join('\n');

  const content = `---
date: ${weekDate}
type: weekly-recap
items_available: ${recentItems.length}
status: draft
---

# Weekly LinkedIn Recap — ${weekDate}

> This is the curated weekly post. Individual article drafts are in separate files.
> Gemini selected the 3 strongest signals from ${recentItems.length} available items.

## Items available this week:
${headlineList}

---

## Post

${post}
`;

  fs.writeFileSync(draftFile, content, 'utf-8');
  console.log(`✅ Saved: linkedin-drafts/weekly-${weekDate}.md`);
}

main().catch(err => {
  console.error('❌ Fatal:', err);
  process.exit(1);
});
