import "dotenv/config";
// scripts/post-weekly-linkedin.ts
// Reads the latest weekly-YYYY-MM-DD.md → posts to LinkedIn personal + company page
// → sends Slack notification with results.
//
// Usage:   npm run linkedin:post-weekly
// Env:     LINKEDIN_ACCESS_TOKEN
//          LINKEDIN_PERSONAL_URN   urn:li:person:xxxxx     (Pedro's personal page)
//          LINKEDIN_ORG_URN        urn:li:organization:xxxxx  (Analog AI company page)
//          SLACK_BOT_TOKEN         (for notification)
//          SLACK_FEEDBACK_CHANNEL  (channel to notify)

import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.join(__dirname, '..');
const DRAFTS_DIR = path.join(ROOT, 'linkedin-drafts');

const LI_TOKEN        = process.env.LINKEDIN_ACCESS_TOKEN;
const LI_PERSONAL_URN = process.env.LINKEDIN_PERSONAL_URN;   // urn:li:person:xxx
const LI_ORG_URN      = process.env.LINKEDIN_ORG_URN;         // urn:li:organization:xxx
const SLACK_TOKEN     = process.env.SLACK_BOT_TOKEN;
const SLACK_CHANNEL   = process.env.SLACK_FEEDBACK_CHANNEL;

// ─── Read the weekly post ─────────────────────────────────────────────────────

function readWeeklyPost(): { date: string; text: string } | null {
  if (!fs.existsSync(DRAFTS_DIR)) return null;

  // Find the most recent weekly-*.md
  const files = fs.readdirSync(DRAFTS_DIR)
    .filter(f => f.startsWith('weekly-') && f.endsWith('.md'))
    .sort()
    .reverse();

  if (files.length === 0) return null;

  const latest = files[0];
  const date = latest.replace('weekly-', '').replace('.md', '');
  const raw = fs.readFileSync(path.join(DRAFTS_DIR, latest), 'utf-8');

  // Extract the post content — everything after "## Post\n\n"
  const match = raw.match(/## Post\n\n([\s\S]+)$/);
  if (!match) return null;

  return { date, text: match[1].trim() };
}

// ─── LinkedIn posting ────────────────────────────────────────────────────────

async function postToLinkedIn(text: string, authorUrn: string, label: string): Promise<string | null> {
  if (!LI_TOKEN) {
    console.log(`   ⚠️  ${label}: no LINKEDIN_ACCESS_TOKEN — skipping`);
    return null;
  }
  if (!authorUrn) {
    console.log(`   ⚠️  ${label}: no URN configured — skipping`);
    return null;
  }

  const body = {
    author: authorUrn,
    lifecycleState: 'PUBLISHED',
    specificContent: {
      'com.linkedin.ugc.ShareContent': {
        shareCommentary: { text },
        shareMediaCategory: 'NONE',
      },
    },
    visibility: {
      'com.linkedin.ugc.MemberNetworkVisibility': 'PUBLIC',
    },
  };

  const res = await fetch('https://api.linkedin.com/v2/ugcPosts', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${LI_TOKEN}`,
      'Content-Type': 'application/json',
      'X-Restli-Protocol-Version': '2.0.0',
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`LinkedIn ${label} ${res.status}: ${err}`);
  }

  const data = await res.json();
  console.log(`   ✅ ${label} — posted (ID: ${data.id})`);
  return data.id;
}

// ─── Slack notification ───────────────────────────────────────────────────────

async function notifySlack(message: string): Promise<void> {
  if (!SLACK_TOKEN || !SLACK_CHANNEL) {
    console.log('   ⚠️  Slack: no token/channel — skipping notification');
    return;
  }

  const channelId = SLACK_CHANNEL.startsWith('C') ? SLACK_CHANNEL : SLACK_CHANNEL;

  const res = await fetch('https://slack.com/api/chat.postMessage', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${SLACK_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      channel: channelId,
      text: message,
      mrkdwn: true,
    }),
  });

  const data = await res.json() as any;
  if (!data.ok) {
    console.warn(`   ⚠️  Slack notification failed: ${data.error}`);
  } else {
    console.log('   ✅ Slack notified');
  }
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log('📤 Post Weekly LinkedIn Recap\n');

  const post = readWeeklyPost();
  if (!post) {
    console.log('ℹ️  No weekly recap found in linkedin-drafts/. Run linkedin:weekly first.');
    process.exit(0);
  }

  console.log(`📄 Weekly post for ${post.date} (${post.text.length} chars)\n`);

  const results: { label: string; id: string | null; error?: string }[] = [];

  // Post to personal page
  if (LI_PERSONAL_URN) {
    try {
      const id = await postToLinkedIn(post.text, LI_PERSONAL_URN, 'Personal page');
      results.push({ label: 'Personal (Pedro Bandeira)', id });
    } catch (err: any) {
      console.error(`   ❌ Personal page: ${err.message}`);
      results.push({ label: 'Personal (Pedro Bandeira)', id: null, error: err.message });
    }
  } else {
    console.log('   ⏭  Personal page: LINKEDIN_PERSONAL_URN not set — skipping');
    results.push({ label: 'Personal (Pedro Bandeira)', id: null, error: 'URN not configured' });
  }

  // Small delay between posts
  await new Promise(r => setTimeout(r, 1500));

  // Post to Analog AI company page
  if (LI_ORG_URN) {
    try {
      const id = await postToLinkedIn(post.text, LI_ORG_URN, 'Analog AI page');
      results.push({ label: 'Analog AI (company page)', id });
    } catch (err: any) {
      console.error(`   ❌ Analog AI page: ${err.message}`);
      results.push({ label: 'Analog AI (company page)', id: null, error: err.message });
    }
  } else {
    console.log('   ⏭  Analog AI page: LINKEDIN_ORG_URN not set — skipping');
    results.push({ label: 'Analog AI (company page)', id: null, error: 'URN not configured' });
  }

  // Build Slack notification
  const posted = results.filter(r => r.id);
  const failed = results.filter(r => !r.id);

  const previewText = post.text.slice(0, 280).replace(/\n/g, ' ');

  let slackMsg: string;

  if (posted.length > 0) {
    const postedLabels = posted.map(r => `• ${r.label}`).join('\n');
    const failedSection = failed.length > 0
      ? `\n⚠️ *Not posted* (check secrets):\n${failed.map(r => `• ${r.label}: ${r.error}`).join('\n')}`
      : '';

    slackMsg = `✅ *Weekly LinkedIn recap posted* — ${post.date}

*Posted to:*
${postedLabels}${failedSection}

*Preview:*
_"${previewText}..."_`;
  } else {
    // Nothing posted — send the content so Pedro can post manually
    slackMsg = `📋 *Weekly LinkedIn recap ready — needs manual posting*

No LinkedIn credentials configured. Post this to both pages:

*Analog AI company page* + *Pedro Bandeira personal page*

\`\`\`
${post.text.slice(0, 900)}
\`\`\`
${post.text.length > 900 ? `\n_[...full post in \`linkedin-drafts/weekly-${post.date}.md\`]_` : ''}`;
  }

  await notifySlack(slackMsg);

  const totalPosted = posted.length;
  console.log(`\n🎯 Done — ${totalPosted}/${results.length} pages posted.`);
  if (totalPosted === 0 && !LI_TOKEN) {
    console.log('   → Add LINKEDIN_ACCESS_TOKEN + LINKEDIN_PERSONAL_URN + LINKEDIN_ORG_URN to GitHub Secrets to enable auto-posting.');
  }
}

main().catch(err => {
  console.error('❌ Fatal:', err);
  process.exit(1);
});
