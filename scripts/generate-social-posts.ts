// scripts/generate-social-posts.ts
// Generates a week of LinkedIn + Facebook posts from Pulse content
// Outputs to scripts/output/social-posts-YYYY-WW.json
// Optionally queues to Buffer if BUFFER_ACCESS_TOKEN is set
//
// Usage:   npm run social:generate
// Env:     GEMINI_API_KEY, SITE_URL, BUFFER_ACCESS_TOKEN (optional)

import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.join(__dirname, '..');

// ─── Config ──────────────────────────────────────────────────────────────────

const GEMINI_KEY = process.env.GEMINI_API_KEY;
const SITE_URL = process.env.SITE_URL || 'https://analog-ai.vercel.app';
const BUFFER_TOKEN = process.env.BUFFER_ACCESS_TOKEN; // optional

if (!GEMINI_KEY) {
  console.error('❌ Missing GEMINI_API_KEY');
  process.exit(1);
}

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

interface SocialPost {
  type: 'digest' | 'spotlight' | 'original_take' | 'behind_build';
  platform: 'linkedin' | 'facebook';
  scheduledDay: string; // e.g. "Monday"
  scheduledAt: string; // ISO timestamp
  text: string;
  sourceSlug?: string; // article that inspired it
}

interface WeekPack {
  generatedAt: string;
  weekLabel: string; // e.g. "Week of 24 Feb 2026"
  posts: SocialPost[];
}

// ─── Scheduling helpers ───────────────────────────────────────────────────────

// Warsaw time = UTC+1 (winter) / UTC+2 (summer)
// Simple: just use UTC+1 for now (Feb/Mar)
const TZ_OFFSET_H = 1;

function nextWeekday(dayOfWeek: number, hour = 9, baseDate = new Date()): Date {
  // dayOfWeek: 0=Sun, 1=Mon, 3=Wed, 5=Fri, 6=Sat
  const d = new Date(baseDate);
  d.setHours(0, 0, 0, 0);
  const currentDay = d.getDay();
  let daysUntil = (dayOfWeek - currentDay + 7) % 7;
  if (daysUntil === 0) daysUntil = 7; // always schedule in future
  d.setDate(d.getDate() + daysUntil);
  // Set hour in Warsaw local time (UTC+1)
  d.setUTCHours(hour - TZ_OFFSET_H, 0, 0, 0);
  return d;
}

function weekLabel(date: Date): string {
  const monday = nextWeekday(1, 9, date);
  // Go back to find the actual coming Monday
  return `Week of ${monday.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}`;
}

// ISO week number
function isoWeek(d: Date): string {
  const tmp = new Date(d);
  tmp.setHours(0, 0, 0, 0);
  tmp.setDate(tmp.getDate() + 4 - (tmp.getDay() || 7));
  const yearStart = new Date(tmp.getFullYear(), 0, 1);
  const week = Math.ceil(((tmp.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
  return `${tmp.getFullYear()}-W${String(week).padStart(2, '0')}`;
}

// ─── Gemini helper ────────────────────────────────────────────────────────────

async function callGemini(prompt: string, maxTokens = 600): Promise<string> {
  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_KEY}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.8, maxOutputTokens: maxTokens },
      }),
    }
  );
  if (!res.ok) throw new Error(`Gemini error: ${res.status} ${await res.text()}`);
  const data = await res.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() ?? '';
}

// ─── Pedro's voice system prompt ─────────────────────────────────────────────

const PEDRO_CONTEXT = `You are writing social media posts AS Pedro Bandeira.

PEDRO'S IDENTITY:
- 50-year-old Portuguese entrepreneur, based in Warsaw, Poland
- Built and ran analog businesses (events, corporate wellbeing)
- Now shipping AI products: The Pulse newsletter, AgenticOS (AI tool for law firms)
- Running Sirona — a corporate wellbeing company in Portugal/Spain
- Author of The Pulse newsletter: AI analysis for executives with no hype
- His edge: he's been on BOTH sides — ran a business before AI, now building AI products

PEDRO'S VOICE (non-negotiable):
- Direct. No fluff. No "exciting developments". No "the landscape is evolving".
- Uses concrete analogies from the pre-digital era ("file cabinets", "switchboard operators", "rolodex")
- Short sentences. Never academic.
- Skeptical of hype. Practical about implementation.
- Writes like a peer talking to another executive — not a consultant pitching.
- Occasionally dry humor. Never enthusiastic.
- First person, no hashtag spam (max 3 relevant hashtags at the end of LinkedIn posts)

LINKEDIN FORMAT:
- Hook: one punchy sentence (the insight or the counterintuitive take)
- Body: 2-3 short paragraphs, each 2-3 sentences max
- CTA: one clean line with a link
- 3 hashtags max (relevant, not generic)
- 150-220 words total

FACEBOOK FORMAT:
- Shorter, slightly more casual but still Pedro
- Hook + 1-2 paragraphs + CTA link
- No hashtags
- 80-120 words total`;

// ─── Post generators ──────────────────────────────────────────────────────────

async function generateDigestPosts(items: PulseItem[]): Promise<{ linkedin: string; facebook: string }> {
  const summary = items.slice(0, 5).map((item, i) =>
    `${i + 1}. [${item.category}] "${item.translation}"\n   Context: ${item.noise.slice(0, 150)}`
  ).join('\n\n');

  const pulseUrl = `${SITE_URL}/pulse`;

  const linkedinPrompt = `${PEDRO_CONTEXT}

This week's Pulse covered these stories:
${summary}

Write a LINKEDIN post for Pedro's personal profile that:
- Synthesizes the week's main signal (what theme ties them together?)
- Gives Pedro's operator take on it (not just "AI is changing everything")
- Ends with a CTA to read The Pulse newsletter
- Includes the URL: ${pulseUrl}
- Uses Pedro's voice EXACTLY as described

Write ONLY the post text, ready to copy-paste. No explanations.`;

  const facebookPrompt = `${PEDRO_CONTEXT}

This week's Pulse covered these stories:
${summary}

Write a FACEBOOK post (shorter, still Pedro's voice) that:
- Teases what this week's AI signal means for business owners
- Feels like a personal note, not a newsletter promo
- Ends with: "Full breakdown: ${pulseUrl}"

Write ONLY the post text, ready to copy-paste. No explanations.`;

  const [linkedin, facebook] = await Promise.all([
    callGemini(linkedinPrompt),
    callGemini(facebookPrompt, 350),
  ]);

  return { linkedin, facebook };
}

async function generateSpotlightPosts(item: PulseItem): Promise<{ linkedin: string; facebook: string }> {
  const articleUrl = `${SITE_URL}/pulse/${item.slug}`;

  const linkedinPrompt = `${PEDRO_CONTEXT}

Pedro published this analysis in The Pulse:
TITLE: ${item.translation}
CATEGORY: ${item.category}
WHAT HAPPENED: ${item.noise}
PEDRO'S TAKE: ${item.action}

Write a LINKEDIN post where Pedro shares this analysis:
- Lead with the counterintuitive angle or the thing executives are getting wrong about this
- 2-3 short paragraphs showing his operator perspective
- NOT a summary — his personal take on WHY this matters
- CTA: "Full analysis: ${articleUrl}"

Write ONLY the post text, ready to copy-paste. No explanations.`;

  const facebookPrompt = `${PEDRO_CONTEXT}

Pedro published this analysis in The Pulse:
TITLE: ${item.translation}
WHAT HAPPENED: ${item.noise}
PEDRO'S TAKE: ${item.action}

Write a FACEBOOK post (short, direct):
- 2-3 sentences that grab attention
- The practical implication for business owners
- Link: ${articleUrl}

Write ONLY the post text, ready to copy-paste. No explanations.`;

  const [linkedin, facebook] = await Promise.all([
    callGemini(linkedinPrompt),
    callGemini(facebookPrompt, 350),
  ]);

  return { linkedin, facebook };
}

async function generateOriginalTakePosts(items: PulseItem[]): Promise<{ linkedin: string; facebook: string }> {
  const themes = [...new Set(items.slice(0, 5).map(i => i.category))].join(', ');
  const recentKeywords = items.slice(0, 5).flatMap(i => i.keywords ?? []).slice(0, 8).join(', ');

  const linkedinPrompt = `${PEDRO_CONTEXT}

Context: Pedro has been reading about these AI themes this week: ${themes}.
Keywords in the news: ${recentKeywords}.

Write an ORIGINAL LINKEDIN POST — not a newsletter recap, but Pedro sharing a personal observation or lesson from his work:
- Could be: something he tried this week building AgenticOS, a meeting with a corporate client about AI adoption, a mistake he made, a pattern he keeps seeing in how executives misunderstand AI
- Something that only a 50-year-old operator who's lived through multiple technology shifts would say
- NOT generic AI advice. Specific, grounded, slightly contrarian.
- No mention of The Pulse newsletter this time — this is just Pedro the person
- Still ends with a soft CTA (could be a question to spark comments, or invite DMs)

Write ONLY the post text, ready to copy-paste. No explanations.`;

  const facebookPrompt = `${PEDRO_CONTEXT}

Context: AI themes this week: ${themes}.

Write an ORIGINAL FACEBOOK POST — Pedro sharing a quick, genuine observation from his week as an operator building AI products and selling to corporate clients. Short, personal, not a promo. Could end with a question.

Write ONLY the post text, ready to copy-paste. No explanations.`;

  const [linkedin, facebook] = await Promise.all([
    callGemini(linkedinPrompt),
    callGemini(facebookPrompt, 350),
  ]);

  return { linkedin, facebook };
}

// ─── Buffer integration ───────────────────────────────────────────────────────

interface BufferProfile {
  id: string;
  service: string;
  service_type: string;
  formatted_username: string;
}

async function getBufferProfiles(): Promise<BufferProfile[]> {
  const res = await fetch(
    `https://api.bufferapp.com/1/profiles.json?access_token=${BUFFER_TOKEN}`
  );
  if (!res.ok) throw new Error(`Buffer profiles error: ${res.status}`);
  return res.json();
}

async function scheduleBufferPost(profileId: string, text: string, scheduledAt: Date): Promise<void> {
  const body = new URLSearchParams({
    access_token: BUFFER_TOKEN!,
    'profile_ids[]': profileId,
    text,
    scheduled_at: scheduledAt.toISOString(),
  });

  const res = await fetch('https://api.bufferapp.com/1/updates/create.json', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: body.toString(),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Buffer schedule error: ${res.status} ${err}`);
  }
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log('📱 Social Post Generator — starting...\n');

  // 1. Load manifest
  const manifestPath = path.join(ROOT, 'public', 'manifest.json');
  if (!fs.existsSync(manifestPath)) {
    console.error('❌ manifest.json not found. Run publish first.');
    process.exit(1);
  }

  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'));
  const items: PulseItem[] = manifest.items ?? [];

  if (items.length === 0) {
    console.error('❌ No items in manifest.');
    process.exit(1);
  }

  console.log(`📰 Loaded ${items.length} articles from manifest.`);

  // Get this week's items (last 7 days), fall back to most recent 5
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
  const weekItems = items.filter(i => new Date(i.isoDate ?? i.date) >= oneWeekAgo);
  const sourceItems = weekItems.length >= 2 ? weekItems : items.slice(0, 5);
  const spotlightItem = sourceItems[0]; // Most recent article for spotlight

  console.log(`   Using ${sourceItems.length} recent items for context.`);
  console.log(`   Spotlight: "${spotlightItem.translation.slice(0, 60)}..."\n`);

  // 2. Schedule slots (coming Mon/Wed/Fri)
  const now = new Date();
  const monSlot = nextWeekday(1, 9, now);   // Monday 9am Warsaw
  const wedSlot = nextWeekday(3, 10, now);  // Wednesday 10am Warsaw
  const friSlot = nextWeekday(5, 9, now);   // Friday 9am Warsaw

  // 3. Generate all posts
  console.log('🤖 Generating posts with Gemini...\n');

  console.log('   [1/3] Digest post (Monday)...');
  const digestPosts = await generateDigestPosts(sourceItems);

  console.log('   [2/3] Article spotlight (Wednesday)...');
  const spotlightPosts = await generateSpotlightPosts(spotlightItem);

  console.log('   [3/3] Original take (Friday)...');
  const originalPosts = await generateOriginalTakePosts(sourceItems);

  console.log('\n✅ All posts generated.\n');

  // 4. Assemble week pack
  const posts: SocialPost[] = [
    // Monday — Digest
    { type: 'digest', platform: 'linkedin', scheduledDay: 'Monday', scheduledAt: monSlot.toISOString(), text: digestPosts.linkedin },
    { type: 'digest', platform: 'facebook', scheduledDay: 'Monday', scheduledAt: monSlot.toISOString(), text: digestPosts.facebook },
    // Wednesday — Spotlight
    { type: 'spotlight', platform: 'linkedin', scheduledDay: 'Wednesday', scheduledAt: wedSlot.toISOString(), text: spotlightPosts.linkedin, sourceSlug: spotlightItem.slug },
    { type: 'spotlight', platform: 'facebook', scheduledDay: 'Wednesday', scheduledAt: wedSlot.toISOString(), text: spotlightPosts.facebook, sourceSlug: spotlightItem.slug },
    // Friday — Original
    { type: 'original_take', platform: 'linkedin', scheduledDay: 'Friday', scheduledAt: friSlot.toISOString(), text: originalPosts.linkedin },
    { type: 'original_take', platform: 'facebook', scheduledDay: 'Friday', scheduledAt: friSlot.toISOString(), text: originalPosts.facebook },
  ];

  const pack: WeekPack = {
    generatedAt: new Date().toISOString(),
    weekLabel: weekLabel(now),
    posts,
  };

  // 5. Save to file
  const outputDir = path.join(__dirname, 'output');
  if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });
  const outputFile = path.join(outputDir, `social-posts-${isoWeek(now)}.json`);
  fs.writeFileSync(outputFile, JSON.stringify(pack, null, 2));
  console.log(`💾 Saved to: ${outputFile.replace(ROOT + '/', '')}\n`);

  // 6. Print posts for review
  console.log('─'.repeat(70));
  for (const post of posts) {
    const dayLabel = `${post.scheduledDay.toUpperCase()} · ${post.platform.toUpperCase()} · ${post.type.replace('_', ' ')}`;
    console.log(`\n📅 ${dayLabel}`);
    console.log(`   Scheduled: ${new Date(post.scheduledAt).toLocaleString('en-GB', { timeZone: 'Europe/Warsaw' })} Warsaw\n`);
    console.log(post.text);
    console.log('\n' + '─'.repeat(70));
  }

  // 7. Push to Buffer (if token set)
  if (BUFFER_TOKEN) {
    console.log('\n🚀 Buffer token found — pushing to queue...\n');

    let profiles: BufferProfile[] = [];
    try {
      profiles = await getBufferProfiles();
      console.log(`   Connected profiles: ${profiles.map(p => `${p.service}/${p.formatted_username}`).join(', ')}`);
    } catch (err: any) {
      console.error(`   ❌ Could not fetch Buffer profiles: ${err.message}`);
      console.log('   → Posts saved to file. Add them manually in Buffer.');
      process.exit(0);
    }

    if (profiles.length === 0) {
      console.log('   ⚠️  No Buffer profiles connected. Connect LinkedIn + Facebook in Buffer first.');
      process.exit(0);
    }

    // Map profiles to platforms
    const linkedinProfile = profiles.find(p => p.service === 'linkedin');
    const facebookProfile = profiles.find(p => p.service === 'facebook');

    let queued = 0;
    for (const post of posts) {
      const profile = post.platform === 'linkedin' ? linkedinProfile : facebookProfile;
      if (!profile) {
        console.log(`   ⚠️  No ${post.platform} profile found — skipping.`);
        continue;
      }
      try {
        await scheduleBufferPost(profile.id, post.text, new Date(post.scheduledAt));
        console.log(`   ✅ Queued: ${post.platform} ${post.scheduledDay}`);
        queued++;
        // Small delay to avoid rate limits
        await new Promise(r => setTimeout(r, 400));
      } catch (err: any) {
        console.error(`   ❌ ${post.platform} ${post.scheduledDay}: ${err.message}`);
      }
    }

    console.log(`\n✅ Buffer: ${queued}/${posts.length} posts queued.`);
  } else {
    console.log('\n💡 Tip: Set BUFFER_ACCESS_TOKEN to auto-queue posts to Buffer.');
    console.log('   Get your token at: https://buffer.com/developers/apps → your app → Access Token');
  }

  console.log('\n🎯 Done.\n');
}

main().catch(err => {
  console.error('❌ Fatal:', err);
  process.exit(1);
});
