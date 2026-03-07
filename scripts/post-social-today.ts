// scripts/post-social-today.ts
// Reads the latest social-posts JSON and posts today's content
// directly to LinkedIn and Facebook via their APIs.
//
// Usage:   npm run social:post          (posts today's scheduled day)
//          npm run social:post -- mon   (force Monday posts)
//          npm run social:post -- wed   (force Wednesday posts)
//          npm run social:post -- fri   (force Friday posts)
//
// Env:     LINKEDIN_ACCESS_TOKEN
//          LINKEDIN_AUTHOR_URN        e.g. urn:li:person:xxxx  OR  urn:li:organization:xxxx
//          FACEBOOK_PAGE_ACCESS_TOKEN
//          FACEBOOK_PAGE_ID

import { config } from 'dotenv';
config({ path: '.env.local' });

import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ─── Config ───────────────────────────────────────────────────────────────────

const LI_TOKEN    = process.env.LINKEDIN_ACCESS_TOKEN;
const LI_AUTHOR   = process.env.LINKEDIN_AUTHOR_URN;        // urn:li:person:xxx or urn:li:organization:xxx
const FB_TOKEN    = process.env.FACEBOOK_PAGE_ACCESS_TOKEN;
const FB_PAGE_ID  = process.env.FACEBOOK_PAGE_ID;

// ─── Types ────────────────────────────────────────────────────────────────────

interface SocialPost {
  type: string;
  platform: 'linkedin' | 'facebook';
  scheduledDay: string;
  scheduledAt: string;
  text: string;
  sourceSlug?: string;
}

interface WeekPack {
  generatedAt: string;
  weekLabel: string;
  posts: SocialPost[];
}

// ─── Find latest output file ──────────────────────────────────────────────────

function findLatestPack(): WeekPack | null {
  const outputDir = path.join(__dirname, 'output');
  if (!fs.existsSync(outputDir)) return null;
  const files = fs.readdirSync(outputDir)
    .filter(f => f.startsWith('social-posts-') && f.endsWith('.json'))
    .sort().reverse();
  if (files.length === 0) return null;
  return JSON.parse(fs.readFileSync(path.join(outputDir, files[0]), 'utf-8'));
}

// ─── Determine today's post day ───────────────────────────────────────────────

function resolveDay(arg?: string): string | null {
  if (arg) {
    const map: Record<string, string> = {
      mon: 'Monday', monday: 'Monday',
      wed: 'Wednesday', wednesday: 'Wednesday',
      fri: 'Friday', friday: 'Friday',
      sat: 'Saturday', saturday: 'Saturday',
    };
    return map[arg.toLowerCase()] ?? null;
  }
  const dayNames = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
  return dayNames[new Date().getDay()];
}

// ─── LinkedIn ─────────────────────────────────────────────────────────────────

async function postToLinkedIn(text: string): Promise<void> {
  if (!LI_TOKEN || !LI_AUTHOR) {
    console.log('   ⚠️  LinkedIn: no token/author — skipping');
    return;
  }

  // New Posts API (replaces deprecated /v2/ugcPosts)
  const body = {
    author: LI_AUTHOR,
    commentary: text,
    visibility: 'PUBLIC',
    distribution: {
      feedDistribution: 'MAIN_FEED',
      targetEntities: [],
      thirdPartyDistributionChannels: [],
    },
    lifecycleState: 'PUBLISHED',
    isReshareDisabledByAuthor: false,
  };

  const res = await fetch('https://api.linkedin.com/rest/posts', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${LI_TOKEN}`,
      'Content-Type': 'application/json',
      'X-Restli-Protocol-Version': '2.0.0',
      'LinkedIn-Version': '202602',
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`LinkedIn API ${res.status}: ${err}`);
  }

  // 201 response, post ID in x-restli-id header
  const postId = res.headers.get('x-restli-id') || 'created';
  console.log(`   ✅ LinkedIn posted — ID: ${postId}`);
}

// ─── Facebook ─────────────────────────────────────────────────────────────────

async function postToFacebook(text: string): Promise<void> {
  if (!FB_TOKEN || !FB_PAGE_ID) {
    console.log('   ⚠️  Facebook: no token/page-id — skipping');
    return;
  }

  const url = `https://graph.facebook.com/v21.0/${FB_PAGE_ID}/feed`;
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message: text, access_token: FB_TOKEN }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Facebook API ${res.status}: ${err}`);
  }

  const data = await res.json();
  console.log(`   ✅ Facebook posted — ID: ${data.id}`);
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  const dayArg = process.argv[2];
  const targetDay = resolveDay(dayArg);

  if (!targetDay) {
    console.error(`❌ Unknown day arg: "${dayArg}". Use mon, wed, or fri.`);
    process.exit(1);
  }

  console.log(`📱 Post Social Today — targeting: ${targetDay}\n`);

  const pack = findLatestPack();
  if (!pack) {
    console.warn('⚠️  No social posts JSON found. Monday generation has not run yet.');
    console.warn('   To bootstrap: trigger the workflow manually with day=mon');
    console.warn('   Or run locally: npm run social:generate && npm run social:post -- mon');
    process.exit(0); // Exit cleanly — not a fatal error, just no content yet
  }

  console.log(`📦 Loaded: ${pack.weekLabel}`);

  const todaysPosts = pack.posts.filter(p => p.scheduledDay === targetDay);

  if (todaysPosts.length === 0) {
    console.log(`ℹ️  No posts scheduled for ${targetDay}. Nothing to do.`);
    process.exit(0);
  }

  console.log(`   Found ${todaysPosts.length} posts for ${targetDay}:\n`);

  let posted = 0;
  let failed = 0;

  for (const post of todaysPosts) {
    console.log(`📤 ${post.platform.toUpperCase()} · ${post.type}`);
    console.log(`   Preview: ${post.text.slice(0, 80)}...`);

    try {
      if (post.platform === 'linkedin') {
        await postToLinkedIn(post.text);
      } else if (post.platform === 'facebook') {
        await postToFacebook(post.text);
      }
      posted++;
    } catch (err: any) {
      console.error(`   ❌ ${err.message}`);
      failed++;
    }

    // Small delay between API calls
    await new Promise(r => setTimeout(r, 1000));
  }

  console.log(`\n🎯 Done — ${posted} posted, ${failed} failed.`);
  if (failed > 0) process.exit(1);
}

main().catch(err => {
  console.error('❌ Fatal:', err);
  process.exit(1);
});
