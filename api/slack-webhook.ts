// api/slack-webhook.ts
// Vercel serverless function — receives Slack events from #analog-ai-feedback
// and immediately dispatches a GitHub Actions workflow to publish the article.
//
// Env vars needed in Vercel dashboard:
//   SLACK_SIGNING_SECRET   — from Slack app → Basic Information → Signing Secret
//   GITHUB_DISPATCH_TOKEN  — GitHub PAT with 'workflow' scope
//   GITHUB_REPO            — e.g. "ptbandeira/cv-site-ai-resume"

import type { IncomingMessage, ServerResponse } from 'http';
import * as crypto from 'crypto';

type VercelRequest = IncomingMessage & { body: any; headers: Record<string, string> };
type VercelResponse = ServerResponse & {
  status: (code: number) => VercelResponse;
  json: (data: any) => void;
};

const SIGNING_SECRET = process.env.SLACK_SIGNING_SECRET ?? '';
const GITHUB_TOKEN = process.env.GITHUB_DISPATCH_TOKEN ?? '';
const GITHUB_REPO = process.env.GITHUB_REPO ?? 'ptbandeira/cv-site-ai-resume';

// ─── Slack signature verification ─────────────────────────────────────────

function verifySlackSignature(req: VercelRequest, rawBody: string): boolean {
  if (!SIGNING_SECRET) return true; // skip in dev if not set
  const timestamp = req.headers['x-slack-request-timestamp'] as string;
  const signature = req.headers['x-slack-signature'] as string;
  if (!timestamp || !signature) return false;

  // Reject requests older than 5 minutes (replay attack protection)
  if (Math.abs(Date.now() / 1000 - Number(timestamp)) > 300) return false;

  const sigBase = `v0:${timestamp}:${rawBody}`;
  const expected = 'v0=' + crypto.createHmac('sha256', SIGNING_SECRET).update(sigBase).digest('hex');
  return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(signature));
}

// ─── Trigger GitHub Actions workflow ──────────────────────────────────────

async function dispatchWorkflow(): Promise<void> {
  const res = await fetch(`https://api.github.com/repos/${GITHUB_REPO}/dispatches`, {
    method: 'POST',
    headers: {
      Accept: 'application/vnd.github+json',
      Authorization: `Bearer ${GITHUB_TOKEN}`,
      'X-GitHub-Api-Version': '2022-11-28',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ event_type: 'publish-pulse' }),
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`GitHub dispatch failed: ${res.status} — ${err}`);
  }
}

// ─── Handler ──────────────────────────────────────────────────────────────

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Parse raw body for signature verification
  const rawBody = typeof req.body === 'string' ? req.body : JSON.stringify(req.body);
  const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;

  // 1. Slack URL verification challenge (one-time setup)
  if (body?.type === 'url_verification') {
    return res.status(200).json({ challenge: body.challenge });
  }

  // 2. Verify Slack signature
  if (!verifySlackSignature(req, rawBody)) {
    console.error('Invalid Slack signature');
    return res.status(401).json({ error: 'Unauthorized' });
  }

  // 3. Only handle message events
  const event = body?.event;
  if (event?.type !== 'message' || event?.subtype) {
    return res.status(200).json({ ok: true }); // ack but ignore edits, deletes, bot messages
  }

  // 4. Only trigger if message contains a URL
  const hasUrl = /https?:\/\/[^\s>|"]+/.test(event?.text ?? '');
  if (!hasUrl) {
    return res.status(200).json({ ok: true });
  }

  console.log(`📡 New URL detected in #analog-ai-feedback — dispatching pulse workflow`);

  // 5. Dispatch GitHub Actions (async — Slack needs response within 3s)
  try {
    await dispatchWorkflow();
    console.log('✅ Workflow dispatched');
  } catch (err) {
    console.error('❌ Dispatch failed:', err);
    // Still return 200 to Slack — don't let Slack retry aggressively
  }

  return res.status(200).json({ ok: true });
}
