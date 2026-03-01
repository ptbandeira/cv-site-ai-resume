import "dotenv/config";
// scripts/notify-linkedin-review.ts
// Sends the weekly LinkedIn post to Slack for Pedro's review + approval.
// Called by the Friday workflow INSTEAD of auto-posting.
//
// Usage:   npm run linkedin:notify-review
// Env:     SLACK_BOT_TOKEN
//          SLACK_FEEDBACK_CHANNEL
//          GITHUB_REPOSITORY   (set automatically in GitHub Actions)

import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.join(__dirname, '..');
const DRAFTS_DIR = path.join(ROOT, 'linkedin-drafts');

const SLACK_TOKEN   = process.env.SLACK_BOT_TOKEN;
const SLACK_CHANNEL = process.env.SLACK_FEEDBACK_CHANNEL;
const GITHUB_REPO   = process.env.GITHUB_REPOSITORY ?? 'your-user/cv-site-ai-resume';

// ─── Read the weekly post ─────────────────────────────────────────────────────

function readWeeklyPost(): { date: string; text: string } | null {
  if (!fs.existsSync(DRAFTS_DIR)) return null;

  const files = fs.readdirSync(DRAFTS_DIR)
    .filter(f => f.startsWith('weekly-') && f.endsWith('.md'))
    .sort()
    .reverse();

  if (files.length === 0) return null;

  const latest = files[0];
  const date = latest.replace('weekly-', '').replace('.md', '');
  const raw = fs.readFileSync(path.join(DRAFTS_DIR, latest), 'utf-8');

  const match = raw.match(/## Post\n\n([\s\S]+)$/);
  if (!match) return null;

  return { date, text: match[1].trim() };
}

// ─── Send Slack review notification ─────────────────────────────────────────

async function sendReviewNotification(post: { date: string; text: string }): Promise<void> {
  if (!SLACK_TOKEN || !SLACK_CHANNEL) {
    console.log('⚠️  SLACK_BOT_TOKEN or SLACK_FEEDBACK_CHANNEL not set.');
    console.log('\n--- POST READY FOR REVIEW ---');
    console.log(post.text);
    return;
  }

  const approveUrl = `https://github.com/${GITHUB_REPO}/actions/workflows/post-weekly-linkedin.yml`;
  const preview = post.text.slice(0, 280).replace(/\n/g, ' ');

  // Truncate post text to fit within Slack block limits (3000 chars per block)
  const postChunks: string[] = [];
  const MAX_CHUNK = 2900;
  let remaining = post.text;
  while (remaining.length > 0) {
    postChunks.push(remaining.slice(0, MAX_CHUNK));
    remaining = remaining.slice(MAX_CHUNK);
  }

  const blocks: object[] = [
    {
      type: 'header',
      text: {
        type: 'plain_text',
        text: `📋 Weekly LinkedIn Post Ready — ${post.date}`,
        emoji: true,
      },
    },
    {
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: `*Posts to:* Analog AI company page + Pedro Bandeira (personal)\n*Length:* ${post.text.length} chars\n\n*Preview:*\n_"${preview}..."_`,
      },
    },
    { type: 'divider' },
    {
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: `*Full post:*`,
      },
    },
    ...postChunks.map(chunk => ({
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: `\`\`\`\n${chunk}\n\`\`\``,
      },
    })),
    { type: 'divider' },
    {
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: `✅ *Happy with this? Post it now:*\n<${approveUrl}|→ Go to GitHub Actions → Run workflow>\n\nOr edit \`linkedin-drafts/weekly-${post.date}.md\` and re-run.`,
      },
    },
  ];

  const res = await fetch('https://slack.com/api/chat.postMessage', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${SLACK_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      channel: SLACK_CHANNEL,
      text: `📋 Weekly LinkedIn post ready for review — ${post.date}`,
      blocks,
      mrkdwn: true,
    }),
  });

  const data = await res.json() as any;
  if (!data.ok) {
    throw new Error(`Slack API error: ${data.error}`);
  }

  console.log(`✅ Review sent to Slack channel — ${post.date}`);
  console.log(`   Approve at: ${approveUrl}`);
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log('📨 Notify LinkedIn Review\n');

  const post = readWeeklyPost();
  if (!post) {
    console.log('ℹ️  No weekly recap found in linkedin-drafts/. Run linkedin:weekly first.');
    process.exit(0);
  }

  console.log(`📄 Weekly post for ${post.date} (${post.text.length} chars)`);
  await sendReviewNotification(post);
}

main().catch(err => {
  console.error('❌ Fatal:', err);
  process.exit(1);
});
