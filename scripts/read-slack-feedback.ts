// scripts/read-slack-feedback.ts
// Reads #analog-ai-feedback Slack channel and appends URLs to feedback/good-leads.txt
//
// Setup (one-time):
// 1. Go to api.slack.com/apps → Create New App → "From scratch"
// 2. Name: "Analog AI Feedback", workspace: your workspace
// 3. OAuth & Permissions → Bot Token Scopes → add: channels:history, channels:read
// 4. Install to Workspace → copy "Bot User OAuth Token" (xoxb-...)
// 5. Add bot to channel: /invite @analog-ai-feedback in #analog-ai-feedback
// 6. Add GitHub secret: SLACK_BOT_TOKEN = xoxb-...
// 7. Add GitHub secret: SLACK_FEEDBACK_CHANNEL = C... (channel ID — see below)
//
// To find channel ID: right-click channel in Slack → "View channel details" → bottom of popup
//
// Usage: npx ts-node scripts/read-slack-feedback.ts

import * as fs from 'fs';
import * as path from 'path';

const BOT_TOKEN = process.env.SLACK_BOT_TOKEN;
const CHANNEL_ID = process.env.SLACK_FEEDBACK_CHANNEL;
const FEEDBACK_FILE = path.join(__dirname, '..', 'feedback', 'good-leads.txt');

if (!BOT_TOKEN || !CHANNEL_ID) {
  console.log('⚠️  SLACK_BOT_TOKEN or SLACK_FEEDBACK_CHANNEL not set — skipping Slack feedback sync');
  console.log('   See setup instructions at top of this file.');
  process.exit(0);
}

async function fetchSlackMessages(channelId: string, oldest?: string): Promise<any[]> {
  const params = new URLSearchParams({
    channel: channelId,
    limit: '200',
    ...(oldest ? { oldest } : {}),
  });

  const res = await fetch(`https://slack.com/api/conversations.history?${params}`, {
    headers: { Authorization: `Bearer ${BOT_TOKEN}` },
  });
  const data = await res.json() as any;

  if (!data.ok) {
    console.error('Slack API error:', data.error);
    return [];
  }
  return data.messages ?? [];
}

function extractUrls(text: string): string[] {
  // Match bare URLs and Slack-formatted <url|text> links
  const patterns = [
    /https?:\/\/[^\s>|"]+/g,
    /<(https?:\/\/[^|>]+)[|>]/g,
  ];
  const urls: string[] = [];
  for (const pattern of patterns) {
    const matches = text.matchAll(pattern);
    for (const m of matches) {
      const url = m[1] ?? m[0];
      // Skip Slack infrastructure URLs
      if (!url.includes('slack.com') && !url.includes('files.slack.com')) {
        urls.push(url.trim());
      }
    }
  }
  return [...new Set(urls)];
}

function loadExistingUrls(): Set<string> {
  if (!fs.existsSync(FEEDBACK_FILE)) return new Set();
  const content = fs.readFileSync(FEEDBACK_FILE, 'utf-8');
  const urls = new Set<string>();
  for (const line of content.split('\n')) {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#')) {
      urls.add(trimmed);
    }
  }
  return urls;
}

async function main() {
  console.log('📥 Reading #analog-ai-feedback Slack channel...');

  // Only fetch messages from the last 7 days
  const oldest = String(Math.floor(Date.now() / 1000) - 7 * 24 * 60 * 60);
  const messages = await fetchSlackMessages(CHANNEL_ID!, oldest);

  console.log(`   Found ${messages.length} messages`);

  const existingUrls = loadExistingUrls();
  const newUrls: string[] = [];

  for (const msg of messages) {
    if (!msg.text) continue;
    const urls = extractUrls(msg.text);
    for (const url of urls) {
      if (!existingUrls.has(url)) {
        newUrls.push(url);
        existingUrls.add(url);
        console.log(`   + ${url}`);
      }
    }
  }

  if (newUrls.length === 0) {
    console.log('   No new URLs found.');
    return;
  }

  // Append new URLs to the feedback file
  const timestamp = new Date().toISOString().split('T')[0];
  const append = `\n# Pulled from Slack on ${timestamp}:\n` + newUrls.join('\n') + '\n';
  fs.appendFileSync(FEEDBACK_FILE, append);
  console.log(`\n✅ Added ${newUrls.length} new URLs to feedback/good-leads.txt`);
}

main().catch(console.error);
