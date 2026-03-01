import "dotenv/config";
// scripts/generate-weekly-linkedin.ts
// Reads this week's Pulse items → picks 3 strongest signals →
// writes ONE finished LinkedIn post: recap + Pedro's takes + forward-looking close.
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
          temperature: 0.7,
          maxOutputTokens: 2000,
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
  if (!text) throw new Error(`Gemini returned empty. finishReason: ${data.candidates?.[0]?.finishReason}`);
  return text;
}

// ─── Generate the weekly post ─────────────────────────────────────────────────

async function generateWeeklyPost(items: PulseItem[], siteUrl: string): Promise<string> {
  const pulseIndexUrl = `${siteUrl}/pulse`;

  const itemsSummary = items.map((item, i) =>
    `${i + 1}. [${item.category}] ${item.translation}\n   Signal: ${item.noise}\n   My take: ${item.action}`
  ).join('\n\n');

  const prompt = `You are Pedro Bandeira — 50yo Portuguese entrepreneur, AI consultant, based in Warsaw.
You built analog businesses (events, corporate wellbeing) and now ship AI products for SMBs.
You write The Pulse newsletter: weekly AI signal for European executives. No hype. No buzzwords.

This week had ${items.length} signals. Write the Friday weekly recap post for LinkedIn.

─── TASK ───────────────────────────────────────────────────────────────────────

This is a FINISHED, READY-TO-POST piece. Not a draft. Write it as if you're posting it right now.

─── STRUCTURE (follow this exactly) ────────────────────────────────────────────

LINE 1 — HOOK: One punchy sentence that names the theme of this week. No fluff. This is what stops the scroll.
(blank line)
BODY — 3 paragraphs, one per signal you choose as most significant. Each paragraph:
  - Names what happened (1 sentence, concrete)
  - Your real take on it (1-2 sentences, first-person, specific)
  - What it means for a 10-50 person European firm right now (1 sentence)
  Weave them together — this is a narrative, not a list.
(blank line)
RECOMMENDATION — One specific, actionable thing executives should do THIS WEEK. First-person ("If I were advising you..."). Max 2 sentences.
(blank line)
WHAT TO WATCH — 1-2 things you're tracking for next week and why. Keeps readers coming back. Start with "Next week I'm watching..."
(blank line)
CLOSE — One sentence. Pedro's voice, slightly philosophical. References the analog-to-digital shift.
(blank line)
LINK: ${pulseIndexUrl}
(blank line)
HASHTAGS: 4-5, lowercase, specific (not generic like #ai or #technology)

─── PEDRO'S VOICE ───────────────────────────────────────────────────────────────

- Gen-X energy: direct, a little dry, not excitable
- Uses 1990s business analogies: Rolodex, fax machine, switchboard, filing cabinet
- Says "I" not "we". Says "firms" not "companies". Says "people" not "talent"
- Zero corporate speak. Zero em dashes used for decoration.
- Numbers and specifics beat vague claims every time
- Max 1,800 characters total for the entire post

─── THIS WEEK'S SIGNALS ─────────────────────────────────────────────────────────

${itemsSummary}

─── OUTPUT ──────────────────────────────────────────────────────────────────────

Output ONLY the post text. No labels. No "Here's the post:". No preamble. Start directly with the hook.`;

  return callGemini(prompt);
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  const SITE_URL = process.env.SITE_URL || 'https://analog-ai.vercel.app';

  console.log(`📋 Weekly LinkedIn Recap — lookback: ${LOOKBACK_DAYS} day(s)`);

  const manifestPath = path.join(ROOT, 'public', 'manifest.json');
  if (!fs.existsSync(manifestPath)) {
    console.error('❌ manifest.json not found.');
    process.exit(1);
  }

  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'));
  const allItems: PulseItem[] = manifest.items ?? [];

  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - LOOKBACK_DAYS);
  const recentItems = allItems.filter(item => {
    const d = new Date(item.isoDate ?? item.date);
    return d >= cutoff;
  });

  if (recentItems.length === 0) {
    console.log(`ℹ️  No Pulse items in the last ${LOOKBACK_DAYS} day(s).`);
    process.exit(0);
  }

  console.log(`📰 ${recentItems.length} items this week — generating weekly recap...`);

  if (!fs.existsSync(DRAFTS_DIR)) fs.mkdirSync(DRAFTS_DIR, { recursive: true });

  const weekDate = new Date().toISOString().split('T')[0];
  const draftFile = path.join(DRAFTS_DIR, `weekly-${weekDate}.md`);

  if (fs.existsSync(draftFile)) {
    console.log(`⏭  weekly-${weekDate}.md already exists — skipping.`);
    process.exit(0);
  }

  const post = await generateWeeklyPost(recentItems, SITE_URL);

  const headlineList = recentItems.map(i => `- [${i.category}] ${i.translation}`).join('\n');

  const content = `---
date: ${weekDate}
type: weekly-recap
items_available: ${recentItems.length}
status: ready
---

# Weekly LinkedIn Post — ${weekDate}

> Finished piece. Post to: Analog AI page + Pedro's personal page.
> Gemini selected the 3 strongest signals from ${recentItems.length} available.

## Signals available this week
${headlineList}

---

## Post

${post}
`;

  fs.writeFileSync(draftFile, content, 'utf-8');
  console.log(`✅ Saved: linkedin-drafts/weekly-${weekDate}.md`);
  console.log(`\n--- PREVIEW ---\n${post.slice(0, 300)}...\n`);
}

main().catch(err => {
  console.error('❌ Fatal:', err);
  process.exit(1);
});
