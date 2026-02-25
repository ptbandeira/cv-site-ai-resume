// scripts/email-social-posts.ts
// Reads the latest social-posts JSON and emails them to Pedro via Resend
// Called automatically by the weekly GitHub Action after generate-social-posts
//
// Usage:   npm run social:email
// Env:     RESEND_API_KEY, RESEND_FROM, SITE_URL

import { config } from 'dotenv';
config({ path: '.env.local' });

import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.join(__dirname, '..');

const RESEND_KEY = process.env.RESEND_API_KEY;
const FROM = process.env.RESEND_FROM || 'The Pulse <onboarding@resend.dev>';
const TO = 'ptbandeira@gmail.com';

if (!RESEND_KEY) {
  console.error('❌ Missing RESEND_API_KEY');
  process.exit(1);
}

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
    .sort()
    .reverse();

  if (files.length === 0) return null;
  return JSON.parse(fs.readFileSync(path.join(outputDir, files[0]), 'utf-8'));
}

// ─── Build HTML email ─────────────────────────────────────────────────────────

const PLATFORM_COLOR: Record<string, string> = {
  linkedin: '#0077B5',
  facebook: '#1877F2',
};

const TYPE_LABEL: Record<string, string> = {
  digest: '📰 Weekly Digest',
  spotlight: '🔦 Article Spotlight',
  original_take: '💡 Original Take',
  behind_build: '🔨 Behind the Build',
};

function buildHtml(pack: WeekPack): string {
  // Group by day
  const byDay: Record<string, SocialPost[]> = {};
  for (const post of pack.posts) {
    if (!byDay[post.scheduledDay]) byDay[post.scheduledDay] = [];
    byDay[post.scheduledDay].push(post);
  }

  const dayOrder = ['Monday', 'Wednesday', 'Friday', 'Saturday'];

  const sections = dayOrder
    .filter(day => byDay[day])
    .map(day => {
      const posts = byDay[day];
      const date = new Date(posts[0].scheduledAt).toLocaleDateString('en-GB', {
        weekday: 'long', day: 'numeric', month: 'long'
      });

      const postBlocks = posts.map(post => {
        const color = PLATFORM_COLOR[post.platform] ?? '#666';
        const platformLabel = post.platform.charAt(0).toUpperCase() + post.platform.slice(1);
        const typeLabel = TYPE_LABEL[post.type] ?? post.type;

        // Escape HTML and preserve line breaks
        const safeText = post.text
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
          .replace(/\n/g, '<br>');

        return `
          <div style="margin-bottom:20px; border:1px solid #e5e7eb; border-radius:8px; overflow:hidden;">
            <div style="background:${color}; padding:10px 16px; display:flex; align-items:center; gap:8px;">
              <span style="color:white; font-weight:600; font-size:13px;">${platformLabel}</span>
              <span style="color:rgba(255,255,255,0.7); font-size:12px;">·</span>
              <span style="color:rgba(255,255,255,0.85); font-size:12px;">${typeLabel}</span>
            </div>
            <div style="padding:16px; background:#fff;">
              <p style="margin:0; font-size:14px; line-height:1.7; color:#374151; white-space:pre-wrap;">${safeText}</p>
            </div>
            <div style="padding:10px 16px; background:#f9fafb; border-top:1px solid #e5e7eb; text-align:right;">
              <span style="font-size:11px; color:#9ca3af; font-family:monospace;">
                ${post.text.split(/\s+/).length} words · copy &amp; paste into Buffer
              </span>
            </div>
          </div>`;
      }).join('');

      return `
        <div style="margin-bottom:32px;">
          <div style="display:flex; align-items:center; gap:12px; margin-bottom:16px;">
            <h2 style="margin:0; font-size:16px; font-weight:700; color:#111827; font-family:Georgia,serif;">
              ${day}
            </h2>
            <span style="font-size:12px; color:#9ca3af; font-family:monospace;">${date}</span>
            <div style="flex:1; height:1px; background:#e5e7eb;"></div>
          </div>
          ${postBlocks}
        </div>`;
    }).join('');

  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0; padding:0; background:#f3f4f6; font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <div style="max-width:680px; margin:0 auto; padding:32px 16px;">

    <!-- Header -->
    <div style="margin-bottom:32px; padding-bottom:24px; border-bottom:2px solid #e5e7eb;">
      <div style="display:flex; align-items:baseline; gap:12px;">
        <span style="font-size:11px; font-family:monospace; text-transform:uppercase; letter-spacing:0.1em; color:#6b7280;">
          Social Content
        </span>
        <span style="font-size:11px; color:#d1d5db;">·</span>
        <span style="font-size:11px; font-family:monospace; color:#9ca3af;">${pack.weekLabel}</span>
      </div>
      <h1 style="margin:8px 0 0; font-size:24px; font-weight:700; color:#111827; font-family:Georgia,serif;">
        This week's posts — ready to queue
      </h1>
      <p style="margin:8px 0 0; font-size:14px; color:#6b7280;">
        ${pack.posts.length} posts for LinkedIn + Facebook. Copy each into Buffer on the right day.
      </p>
    </div>

    <!-- Buffer reminder -->
    <div style="margin-bottom:32px; padding:12px 16px; background:#fef3c7; border:1px solid #fde68a; border-radius:8px;">
      <p style="margin:0; font-size:13px; color:#92400e;">
        <strong>Quick action:</strong> Open Buffer → queue each post for the correct day.
        Scheduling: Mon 9am · Wed 10am · Fri 9am (Warsaw time).
      </p>
    </div>

    <!-- Posts by day -->
    ${sections}

    <!-- Footer -->
    <div style="margin-top:32px; padding-top:24px; border-top:1px solid #e5e7eb; text-align:center;">
      <p style="font-size:11px; color:#9ca3af; font-family:monospace; margin:0;">
        Generated by The Pulse · ${new Date(pack.generatedAt).toLocaleDateString('en-GB')}
      </p>
    </div>

  </div>
</body>
</html>`;
}

// ─── Send via Resend ──────────────────────────────────────────────────────────

async function sendEmail(html: string, weekLabel: string): Promise<void> {
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${RESEND_KEY}`,
    },
    body: JSON.stringify({
      from: FROM,
      to: [TO],
      subject: `📱 Social posts ready — ${weekLabel}`,
      html,
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Resend error: ${res.status} ${err}`);
  }

  const data = await res.json();
  console.log(`✅ Email sent — ID: ${data.id}`);
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log('📧 Social Posts Emailer — starting...\n');

  const pack = findLatestPack();
  if (!pack) {
    console.error('❌ No social posts found. Run npm run social:generate first.');
    process.exit(1);
  }

  console.log(`📦 Found: ${pack.weekLabel} — ${pack.posts.length} posts`);

  const html = buildHtml(pack);
  await sendEmail(html, pack.weekLabel);

  console.log(`\n🎯 Done — posts emailed to ${TO}`);
}

main().catch(err => {
  console.error('❌ Fatal:', err);
  process.exit(1);
});
