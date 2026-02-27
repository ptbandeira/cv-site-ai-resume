import "dotenv/config";
// scripts/generate-linkedin-drafts.ts
// For each new Pulse item (published in the last N days), generate a LinkedIn post draft.
// Saves drafts to linkedin-drafts/ folder as .md files.
//
// Usage:   npm run linkedin:drafts
// Usage:   npm run linkedin:drafts -- --days 7   (custom lookback)
// Env:     GEMINI_API_KEY

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
const LOOKBACK_DAYS = daysArg >= 0 ? parseInt(args[daysArg + 1] ?? '1') : 1;

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

// ─── Gemini ───────────────────────────────────────────────────────────────────

async function callGemini(prompt: string): Promise<string> {
  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${GEMINI_KEY}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.8, maxOutputTokens: 600 },
      }),
    }
  );
  if (!res.ok) throw new Error(`Gemini API error: ${res.status} ${await res.text()}`);
  const data = await res.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text ?? '';
}

async function generateLinkedInPost(item: PulseItem, siteUrl: string): Promise<string> {
  const pulseUrl = `${siteUrl}/pulse/${item.slug}`;

  const prompt = `You are Pedro Bandeira, a 50-year-old Portuguese entrepreneur writing on LinkedIn. You've built analog businesses (events, corporate wellbeing) and now ship AI products: The Pulse newsletter and AgenticOS (AI tool for law firms). Based in Warsaw, Poland.

Your LinkedIn style:
- Hook in the first line (no "I'm excited to share" — just the insight)
- 3-5 short paragraphs, max 3 sentences each
- Use 1990s business analogies: file cabinets, switchboard operators, Rolodex, fax machines
- Direct, Gen-X energy — no hype, no buzzwords, no exclamation marks
- End with 1 specific takeaway for executives
- 3-5 hashtags at the bottom (lowercase, relevant)
- Max 1,200 characters total

Here's the Pulse item to transform into a LinkedIn post:

CATEGORY: ${item.category}
HEADLINE: ${item.translation}
SIGNAL: ${item.noise}
MY TAKE: ${item.action}

Write the LinkedIn post. Include this link at the end: ${pulseUrl}

Output only the post text — no labels, no commentary, no "Here's the post:".`;

  return callGemini(prompt);
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  const SITE_URL = process.env.SITE_URL || 'https://analog-ai.vercel.app';

  console.log(`🔗 LinkedIn Draft Generator — lookback: ${LOOKBACK_DAYS} day(s)`);

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
    console.log(`ℹ️  No Pulse items published in the last ${LOOKBACK_DAYS} day(s).`);
    process.exit(0);
  }

  console.log(`📝 Generating LinkedIn drafts for ${recentItems.length} item(s)...`);

  // Ensure output dir exists
  if (!fs.existsSync(DRAFTS_DIR)) fs.mkdirSync(DRAFTS_DIR, { recursive: true });

  const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));

  for (const item of recentItems) {
    const draftFile = path.join(DRAFTS_DIR, `${item.slug}.md`);

    // Skip if already drafted
    if (fs.existsSync(draftFile)) {
      console.log(`   ⏭  ${item.slug} — already drafted`);
      continue;
    }

    try {
      console.log(`   📄 ${item.slug}...`);
      const post = await generateLinkedInPost(item, SITE_URL);

      const content = `---
slug: ${item.slug}
category: ${item.category}
date: ${item.isoDate ?? item.date}
headline: ${item.translation}
status: draft
---

# LinkedIn Draft — ${item.translation}

${post}
`;

      fs.writeFileSync(draftFile, content, 'utf-8');
      console.log(`   ✅ Saved: linkedin-drafts/${item.slug}.md`);

      if (recentItems.indexOf(item) < recentItems.length - 1) await sleep(1000);
    } catch (err: any) {
      console.error(`   ❌ ${item.slug}: ${err.message}`);
    }
  }

  console.log('\n✅ LinkedIn drafts done. Review them in linkedin-drafts/');
}

main().catch(err => {
  console.error('❌ Fatal:', err);
  process.exit(1);
});
