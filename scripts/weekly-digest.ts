import "dotenv/config";
// scripts/weekly-digest.ts
// Reads the past week's Pulse items from manifest.json
// → Generates a digest email with Gemini
// → Fetches active subscribers from Supabase
// → Sends via Resend API
// → Updates last_digest_sent_at for each subscriber
//
// Usage:   npm run digest:send
// Env:     GEMINI_API_KEY, SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, RESEND_API_KEY, SITE_URL

import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { createClient } from '@supabase/supabase-js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.join(__dirname, '..');

// ─── Config ──────────────────────────────────────────────────────────────────

const GEMINI_KEY = process.env.GEMINI_API_KEY;
const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const RESEND_KEY = process.env.RESEND_API_KEY;
const SITE_URL = process.env.SITE_URL || 'https://analog-ai.vercel.app';

if (!GEMINI_KEY || !SUPABASE_URL || !SUPABASE_SERVICE_KEY || !RESEND_KEY) {
  console.error('❌ Missing env vars. Need: GEMINI_API_KEY, SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, RESEND_API_KEY');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL!, SUPABASE_SERVICE_KEY!);

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

interface Manifest {
  generated: string;
  items: PulseItem[];
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function getWeekItems(items: PulseItem[]): PulseItem[] {
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
  return items.filter(item => {
    const d = new Date(item.isoDate ?? item.date);
    return d >= oneWeekAgo;
  });
}

function getDateRange(items: PulseItem[]): string {
  if (items.length === 0) return '';
  const dates = items.map(i => new Date(i.isoDate ?? i.date)).sort((a, b) => a.getTime() - b.getTime());
  const oldest = dates[0].toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
  const newest = dates[dates.length - 1].toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
  return `${oldest} – ${newest}`;
}

// ─── Generate digest with Gemini ─────────────────────────────────────────────

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
          maxOutputTokens: 800,
        },
      }),
    }
  );
  if (!res.ok) throw new Error(`Gemini API error: ${res.status} ${await res.text()}`);
  const data = await res.json();
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text ?? '';
  if (!text) {
    const finishReason = data.candidates?.[0]?.finishReason ?? 'unknown';
    throw new Error(`Gemini returned empty response. finishReason: ${finishReason}`);
  }
  return text;
}

async function generateDigest(items: PulseItem[]): Promise<{ subject: string; intro: string }> {
  const itemsSummary = items.map((item, i) =>
    `${i + 1}. [${item.category}] ${item.translation}\n   Signal: ${item.noise}\n   Action: ${item.action}`
  ).join('\n\n');

  const prompt = `You are Pedro Bandeira, a 50-year-old operator and Strategic AI Advisor. You've built analog businesses and shipped AI products. You write for C-suite executives and business owners navigating AI adoption — no enthusiasm, no hype, just signal.

Here are this week's Pulse items:

${itemsSummary}

Write:
1. EMAIL SUBJECT LINE (max 8 words, no emojis, punchy and specific to this week's themes)
2. INTRO PARAGRAPH (3-4 sentences, Pedro's voice: direct, Gen-X, uses 1990s business analogies, connects the week's dots, frames what executives should take away)

Format your response as JSON:
{
  "subject": "...",
  "intro": "..."
}

Pedro's voice examples:
- "AI Context is like the file cabinet; the Prompt is the key."
- "Agents are your switchboard operators."
- No fluff. No "exciting developments". No "landscape is evolving".`;

  const text = await callGemini(prompt);
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error('Gemini returned non-JSON response for digest');
  return JSON.parse(jsonMatch[0]);
}

// ─── Build HTML email ────────────────────────────────────────────────────────

function buildEmailHtml(
  intro: string,
  items: PulseItem[],
  dateRange: string,
  unsubscribeToken: string
): string {
  const unsubUrl = `${SITE_URL}/api/unsubscribe?token=${unsubscribeToken}`;

  const itemsHtml = items.map(item => {
    const pulseUrl = `${SITE_URL}/pulse/${item.slug}`;
    const sourcesHtml = item.sources && item.sources.length > 0
      ? `<p style="margin:8px 0 0; font-size:11px; font-family:monospace; color:#9ca3af;">
          Sources: ${item.sources.map(s => `<a href="${s.url}" style="color:#9ca3af;">${s.label}</a>`).join(' · ')}
         </p>`
      : '';
    return `
<div style="border-left:2px solid #e7e5e4; padding:0 0 24px 20px; margin-bottom:24px;">
  <p style="margin:0 0 4px; font-size:10px; font-family:monospace; text-transform:uppercase; letter-spacing:0.1em; color:#78716c;">${item.category}</p>
  <h3 style="margin:0 0 8px; font-family:Georgia,serif; font-size:17px; font-weight:500; color:#1c1917; line-height:1.4;">
    <a href="${pulseUrl}" style="color:#1c1917; text-decoration:none;">${item.translation}</a>
  </h3>
  <p style="margin:0 0 8px; font-size:14px; color:#57534e; line-height:1.6;">${item.noise}</p>
  <p style="margin:0; font-size:13px; color:#78716c; line-height:1.5; font-style:italic;">${item.action}</p>
  ${sourcesHtml}
  <p style="margin:12px 0 0;">
    <a href="${pulseUrl}" style="font-size:11px; font-family:monospace; color:#1c1917; text-decoration:none; border-bottom:1px solid #e7e5e4;">Read full analysis →</a>
  </p>
</div>`;
  }).join('');

  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#fafaf9;font-family:Georgia,serif;">
<div style="max-width:600px;margin:0 auto;padding:40px 20px;">

  <!-- Header -->
  <div style="border-bottom:1px solid #e7e5e4;padding-bottom:24px;margin-bottom:32px;">
    <p style="margin:0 0 8px; font-size:10px; font-family:monospace; text-transform:uppercase; letter-spacing:0.1em; color:#a8a29e;">
      <span style="display:inline-block;width:6px;height:6px;border-radius:50%;background:#fbbf24;margin-right:6px;vertical-align:middle;"></span>
      Signal Intelligence · ${dateRange}
    </p>
    <h1 style="margin:0; font-family:Georgia,serif; font-size:28px; font-weight:500; color:#1c1917; letter-spacing:-0.02em;">The Pulse</h1>
    <p style="margin:4px 0 0; font-size:13px; color:#78716c; font-family:Arial,sans-serif;">AI signal for executives. Weekly. No hype.</p>
  </div>

  <!-- Intro -->
  <div style="margin-bottom:36px;">
    <p style="margin:0; font-size:15px; color:#44403c; line-height:1.7;">${intro}</p>
  </div>

  <!-- Items -->
  <div style="margin-bottom:40px;">
    <p style="margin:0 0 24px; font-size:10px; font-family:monospace; text-transform:uppercase; letter-spacing:0.1em; color:#a8a29e;">This Week's Analysis</p>
    ${itemsHtml}
  </div>

  <!-- Footer -->
  <div style="border-top:1px solid #e7e5e4; padding-top:24px; text-align:center;">
    <p style="margin:0 0 8px; font-size:11px; font-family:monospace; color:#a8a29e; line-height:1.6;">
      Analysis from a 50-year-old operator — who's built analog businesses and shipped AI products.<br>
      <a href="${SITE_URL}/pulse" style="color:#a8a29e;">Read all analysis</a> ·
      <a href="${unsubUrl}" style="color:#a8a29e;">Unsubscribe</a>
    </p>
  </div>

</div>
</body>
</html>`;
}

// ─── Send via Resend ──────────────────────────────────────────────────────────

async function sendEmail(to: string, subject: string, html: string): Promise<void> {
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${RESEND_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      // Use RESEND_FROM if set (custom verified domain), else Resend's shared test domain
      from: process.env.RESEND_FROM || 'The Pulse <onboarding@resend.dev>',
      to: [to],
      subject,
      html,
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Resend error ${res.status}: ${body}`);
  }
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log('📬 Weekly Digest — starting...');

  // 1. Load manifest
  const manifestPath = path.join(ROOT, 'public', 'manifest.json');
  if (!fs.existsSync(manifestPath)) {
    console.error('❌ manifest.json not found. Run publish first.');
    process.exit(1);
  }
  const manifest: Manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'));
  const weekItems = getWeekItems(manifest.items);

  if (weekItems.length === 0) {
    console.log('ℹ️  No new Pulse items this week — skipping digest send.');
    process.exit(0);
  }

  console.log(`📰 Found ${weekItems.length} item(s) this week.`);
  const dateRange = getDateRange(weekItems);

  // 2. Generate digest content with Gemini
  console.log('🤖 Generating digest with Gemini...');
  const { subject, intro } = await generateDigest(weekItems);
  console.log(`   Subject: "${subject}"`);

  // 3. Fetch active subscribers
  const { data: subscribers, error: subError } = await supabase
    .from('subscribers')
    .select('id, email, unsubscribe_token')
    .eq('active', true);

  if (subError) {
    console.error('❌ Supabase error:', subError.message);
    process.exit(1);
  }

  if (!subscribers || subscribers.length === 0) {
    console.log('ℹ️  No active subscribers yet. Digest generated but not sent.');
    console.log('---\nSUBJECT:', subject, '\nINTRO:', intro);
    process.exit(0);
  }

  console.log(`📧 Sending to ${subscribers.length} subscriber(s)...`);

  // 4. Send to each subscriber
  let sent = 0;
  let failed = 0;
  const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));

  for (const sub of subscribers) {
    try {
      const html = buildEmailHtml(intro, weekItems, dateRange, sub.unsubscribe_token);
      await sendEmail(sub.email, subject, html);

      // Update last_digest_sent_at
      await supabase
        .from('subscribers')
        .update({ last_digest_sent_at: new Date().toISOString() })
        .eq('id', sub.id);

      sent++;
      console.log(`   ✅ ${sub.email}`);

      // Throttle — Resend free tier: 100 emails/hour
      if (sent < subscribers.length) await sleep(700);
    } catch (err: any) {
      console.error(`   ❌ ${sub.email}: ${err.message}`);
      failed++;
    }
  }

  console.log(`\n✅ Digest sent: ${sent} delivered, ${failed} failed.`);
  console.log(`   Subject: "${subject}"`);
}

main().catch(err => {
  console.error('❌ Fatal:', err);
  process.exit(1);
});
