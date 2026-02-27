import "dotenv/config";
// scripts/slack-to-pulse.ts
// Reads #analog-ai-feedback Slack channel → fetches articles → generates Pulse notes via Gemini →
// writes to public/blog/ → regenerates manifest.json → commits + pushes → Vercel auto-deploys.
//
// Usage:   npm run pulse:from-slack
// Env:     SLACK_BOT_TOKEN, SLACK_FEEDBACK_CHANNEL, GEMINI_API_KEY
//
// The format:
//   NOISE       = The Story       (what happened, 1-2 sentences)
//   TRANSLATION = Why It Matters  (what it means for SMBs, 2-3 sentences)
//   ACTION      = My Comments     (Pedro's specific recommendation, 2-3 sentences)

import * as fs from 'fs';
import * as fsAsync from 'fs/promises';
import * as path from 'path';
import { fileURLToPath } from 'url';

const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.join(__dirname, '..');

const SLACK_TOKEN = process.env.SLACK_BOT_TOKEN;
const CHANNEL_ID = process.env.SLACK_FEEDBACK_CHANNEL;
const GEMINI_KEY = process.env.GEMINI_API_KEY;

const PROCESSED_FILE = path.join(ROOT, 'feedback', 'processed-pulse-urls.txt');
const BLOG_DIR = path.join(ROOT, 'public', 'blog');

if (!SLACK_TOKEN || !CHANNEL_ID || !GEMINI_KEY) {
  console.error('❌ Missing env vars. Need: SLACK_BOT_TOKEN, SLACK_FEEDBACK_CHANNEL, GEMINI_API_KEY');
  process.exit(1);
}

// ─── Slack ─────────────────────────────────────────────────────────────────

// Resolve channel name to ID if needed (API requires IDs, not names)
async function resolveChannelId(nameOrId: string): Promise<string> {
  // Already an ID (starts with C, D, or G followed by alphanumerics)
  if (/^[CGDW][A-Z0-9]+$/i.test(nameOrId)) return nameOrId;
  const clean = nameOrId.replace(/^#/, '');
  console.log(`   🔍 Resolving channel name "${clean}" to ID...`);
  let cursor: string | undefined;
  do {
    const params = new URLSearchParams({ limit: '200', exclude_archived: 'true', types: 'public_channel,private_channel' });
    if (cursor) params.set('cursor', cursor);
    const res = await fetch(`https://slack.com/api/conversations.list?${params}`, {
      headers: { Authorization: `Bearer ${SLACK_TOKEN}` },
    });
    const data = await res.json() as any;
    if (!data.ok) throw new Error(`Slack channel list error: ${data.error}\n  Fix: set SLACK_FEEDBACK_CHANNEL to the channel ID (e.g. C0AG83K8D27), not the name`);
    const found = (data.channels ?? []).find((c: any) => c.name === clean || c.name_normalized === clean);
    if (found) { console.log(`   ✅ Resolved: ${clean} → ${found.id}`); return found.id; }
    cursor = data.response_metadata?.next_cursor;
  } while (cursor);
  throw new Error(`Channel "${clean}" not found. Check SLACK_FEEDBACK_CHANNEL secret.\n  Tip: use the channel ID directly (e.g. C0AG83K8D27) instead of the name.`);
}

async function fetchSlackUrls(): Promise<string[]> {
  const channelId = await resolveChannelId(CHANNEL_ID!);
  const oldest = String(Math.floor(Date.now() / 1000) - 30 * 24 * 60 * 60); // last 30 days
  const params = new URLSearchParams({ channel: channelId, limit: '200', oldest });
  const res = await fetch(`https://slack.com/api/conversations.history?${params}`, {
    headers: { Authorization: `Bearer ${SLACK_TOKEN}` },
  });
  const data = await res.json() as any;
  if (!data.ok) throw new Error(`Slack API error: ${data.error}\n  Channel: ${channelId}\n  Tip: make sure the bot is invited to the channel (/invite @YourBotName)`);

  const urls: string[] = [];
  for (const msg of (data.messages ?? [])) {
    if (!msg.text) continue;
    // Bare URLs
    for (const m of msg.text.matchAll(/https?:\/\/[^\s>|"]+/g)) {
      const url = (m[0] as string).trim();
      if (!url.includes('slack.com')) urls.push(url);
    }
    // Slack-formatted <url|text>
    for (const m of msg.text.matchAll(/<(https?:\/\/[^|>]+)[|>]/g)) {
      const url = m[1].trim();
      if (!url.includes('slack.com')) urls.push(url);
    }
  }
  return Array.from(new Set(urls));
}

// ─── Dedup tracking ────────────────────────────────────────────────────────

function loadProcessed(): Set<string> {
  if (!fs.existsSync(PROCESSED_FILE)) return new Set();
  return new Set(
    fs.readFileSync(PROCESSED_FILE, 'utf-8')
      .split('\n').map(l => l.trim()).filter(l => l && !l.startsWith('#'))
  );
}

function markProcessed(url: string): void {
  fs.appendFileSync(PROCESSED_FILE, url + '\n');
}

// ─── Article fetcher ───────────────────────────────────────────────────────

async function fetchArticle(url: string): Promise<string> {
  const res = await fetch(url, {
    headers: { 'User-Agent': 'Mozilla/5.0 (compatible; AnalogAI/1.0; SEO research bot)' },
    signal: AbortSignal.timeout(15000),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const html = await res.text();
  // Strip scripts, styles, tags — keep readable text
  const text = html
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 8000); // cap at 8k — enough context, keeps prompt small
  return text;
}

// ─── Gemini ────────────────────────────────────────────────────────────────

async function callGemini(prompt: string): Promise<string> {
  await sleep(5000); // Rate-limit guard
  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_KEY}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.7, maxOutputTokens: 4096 },
      }),
    }
  );
  if (res.status === 429) {
    const body = await res.json().catch(() => ({})) as any;
    const msg = body?.error?.message ?? 'rate limited';
    const retryMatch = (body?.error?.message ?? '').match(/retry in ([\d.]+)s/i);
    const waitSecs = retryMatch ? Math.ceil(parseFloat(retryMatch[1])) + 5 : 65;
    console.log(`   ⏳ 429: ${msg}. Waiting ${waitSecs}s then retrying...`);
    await sleep(waitSecs * 1000);
    const res2 = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_KEY}`,
      { method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }], generationConfig: { temperature: 0.7, maxOutputTokens: 4096 } }) }
    );
    if (!res2.ok) throw new Error(`Gemini HTTP ${res2.status} (after retry)`);
    return (await res2.json() as any).candidates?.[0]?.content?.parts?.[0]?.text ?? '';
  }
  if (!res.ok) throw new Error(`Gemini HTTP ${res.status}`);
  const data = await res.json() as any;
  return data.candidates[0].content.parts[0].text;
}

// ─── Pulse generator ───────────────────────────────────────────────────────

interface PulseItem {
  id: string;
  slug: string;
  category: string;
  noise: string;
  translation: string;
  action: string;
  date: string;
  keywords: string[];
  sources: Array<{ label: string; url: string }>;
}

async function generatePulseItem(url: string, articleText: string): Promise<PulseItem> {
  const prompt = `You are Pedro Bandeira — 50-year-old Portuguese entrepreneur, AI consultant based in Warsaw.
You help European SMBs (law firms, accountancies, consultancies, 10-50 staff) implement AI without the hype.
You write with authority: direct, specific, first-person. You've seen the patterns AI-natives miss.

Read this article and write a 3-part Pulse note for your SMB audience.

Article URL: ${url}
---
${articleText}
---

OUTPUT (plain text only, exact keys, no markdown):
NOISE: [1-2 sentences — the headline, what happened, what was announced]
TRANSLATION: [2-3 sentences — what this actually means for a 10-50 person European SMB owner right now]
ACTION: [2-3 sentences — Pedro's concrete recommendation, with timeline or price if relevant, first-person]
CATEGORY: [exactly one of: AI Governance, Law Firms, SMB Operations, Enterprise AI, Data Sovereignty]
KEYWORDS: [3-5 comma-separated keywords]
TITLE: [5-8 word title, no punctuation]`;

  const response = await callGemini(prompt);

  const get = (key: string): string =>
    response.match(new RegExp(`${key}:\\s*(.+?)(?=\\n[A-Z]+:|$)`, 's'))?.[1]?.trim() ?? '';

  const title = get('TITLE') || 'ai-insight';
  const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') + '-' + Date.now();
  const now = new Date();
  const date = now.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  const isoDate = now.toISOString();

  return {
    id: slug,
    slug,
    category: get('CATEGORY') || 'SMB Operations',
    noise: get('NOISE'),
    translation: get('TRANSLATION'),
    action: get('ACTION'),
    date,
    isoDate,
    keywords: get('KEYWORDS').split(',').map(k => k.trim()).filter(Boolean),
    sources: [{ label: title, url }],
  };
}

// ─── Manifest regenerator ──────────────────────────────────────────────────

async function regenerateManifest(): Promise<number> {
  const files = (await fsAsync.readdir(BLOG_DIR)).filter(f => f.endsWith('.json'));
  const items: PulseItem[] = [];
  for (const file of files) {
    try {
      const content = await fsAsync.readFile(path.join(BLOG_DIR, file), 'utf-8');
      items.push(JSON.parse(content));
    } catch (_) { /* skip corrupt files */ }
  }
  // Sort by ISO date if available, fall back to display date string
  items.sort((a, b) => {
    const da = (a as any).isoDate ?? a.date;
    const db = (b as any).isoDate ?? b.date;
    return new Date(db).getTime() - new Date(da).getTime();
  });

  const manifest = {
    generated: new Date().toISOString(),
    totalItems: items.length,
    items,
  };
  await fsAsync.writeFile(
    path.join(ROOT, 'public', 'manifest.json'),
    JSON.stringify(manifest, null, 2)
  );
  return items.length;
}

// ─── Main ──────────────────────────────────────────────────────────────────

async function main() {
  console.log('📡 slack-to-pulse: checking #analog-ai-feedback...\n');

  const allUrls = await fetchSlackUrls();
  console.log(`   ${allUrls.length} URL(s) found in channel`);

  const processed = loadProcessed();
  const newUrls = allUrls.filter(u => !processed.has(u));
  console.log(`   ${newUrls.length} new (not yet published)\n`);

  if (newUrls.length === 0) {
    console.log('✅ Nothing to do — all URLs already published.');
    return;
  }

  await fsAsync.mkdir(BLOG_DIR, { recursive: true });
  await fsAsync.mkdir(path.dirname(PROCESSED_FILE), { recursive: true });

  const published: string[] = [];

  for (const url of newUrls) {
    const skipPatterns = ["linkedin.com", "youtube.com", "youtu.be", "twitter.com", "x.com", "instagram.com", "tiktok.com"];
    const skipMatch = skipPatterns.find(p => url.includes(p));
    if (skipMatch) { markProcessed(url); console.log(`   ⏭️  Skipped + marked done: ${skipMatch} (not scrapeable)`); continue; }
    console.log(`📰 ${url}`);
    try {
      const articleText = await fetchArticle(url);
      console.log(`   Fetched (${articleText.length} chars)`);

      const item = await generatePulseItem(url, articleText);
      console.log(`   Generated: "${item.noise.slice(0, 70)}..."`);

      await fsAsync.writeFile(
        path.join(BLOG_DIR, `${item.slug}.json`),
        JSON.stringify(item, null, 2)
      );

      markProcessed(url);
      published.push(item.slug);
      console.log(`   ✅ Saved as ${item.slug}.json\n`);
    } catch (err) {
      const msg = (err as Error).message;
      // Permanent failures (paywall, bot-block, not-found) → mark processed to stop retrying
      const isPermanent = /HTTP (403|404|401|410|451)/.test(msg);
      if (isPermanent) {
        markProcessed(url);
        console.error(`   ❌ Permanent failure (${msg}) — marked done to skip on future runs\n`);
      } else {
        console.error(`   ❌ Transient failure (${msg}) — will retry next run\n`);
      }
    }
  }

  if (published.length === 0) {
    console.log('⚠️  No items published (all failed). Check errors above.');
    return;
  }

  const total = await regenerateManifest();
  console.log(`📦 manifest.json updated — ${total} total pulse items`);
  console.log(`\n✅ Done — ${published.length} new item(s) written. Workflow will commit + push.`);
}

main().catch(console.error);
