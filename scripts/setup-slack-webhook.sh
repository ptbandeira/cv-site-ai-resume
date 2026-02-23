#!/bin/bash
# ─────────────────────────────────────────────────────────────────────────────
# ANALOG AI — Slack Webhook Setup Script
# Run this ONCE after getting SLACK_SIGNING_SECRET from api.slack.com/apps
#
# Usage:
#   SLACK_SIGNING_SECRET=abc123... bash scripts/setup-slack-webhook.sh
# ─────────────────────────────────────────────────────────────────────────────

set -e

REPO="ptbandeira/cv-site-ai-resume"
GITHUB_TOKEN=$(gh auth token)

if [ -z "$SLACK_SIGNING_SECRET" ]; then
  echo ""
  echo "❌  Missing SLACK_SIGNING_SECRET"
  echo ""
  echo "   1. Go to https://api.slack.com/apps"
  echo "   2. Select your Analog AI app (or create one)"
  echo "   3. Basic Information → Signing Secret → Show"
  echo "   4. Re-run:"
  echo "      SLACK_SIGNING_SECRET=xxxxxxxxxxx bash scripts/setup-slack-webhook.sh"
  echo ""
  exit 1
fi

echo ""
echo "🔐 Setting Vercel environment variables..."

# Login to Vercel if not already authed
if ! vercel whoami &>/dev/null; then
  echo "→ Logging in to Vercel (browser will open)..."
  vercel login
fi

# Link to the project (idempotent)
vercel link --yes

# Set the three env vars
echo "$SLACK_SIGNING_SECRET" | vercel env add SLACK_SIGNING_SECRET production --force
echo "$GITHUB_TOKEN"         | vercel env add GITHUB_DISPATCH_TOKEN production --force
echo "$REPO"                 | vercel env add GITHUB_REPO production --force

echo ""
echo "✅  Vercel env vars set."
echo ""
echo "─────────────────────────────────────────────────────────────────────────"
echo "📡  NOW: Configure Slack Event Subscriptions"
echo "─────────────────────────────────────────────────────────────────────────"
echo ""
echo "  1. Go to https://api.slack.com/apps → your app → Event Subscriptions"
echo "  2. Toggle ON"
echo "  3. Request URL → paste:"
echo "     https://analog-ai.vercel.app/api/slack-webhook"
echo "     (Slack will send a challenge — Vercel will respond automatically)"
echo ""
echo "  4. Subscribe to bot events → Add:"
echo "     message.channels"
echo ""
echo "  5. Save Changes"
echo ""
echo "  6. OAuth & Permissions → make sure the bot is in #analog-ai-feedback"
echo "     /invite @YourBotName  (if not already there)"
echo ""
echo "─────────────────────────────────────────────────────────────────────────"
echo "🧪  Test it:"
echo "  Post a message with a URL in #analog-ai-feedback"
echo "  Then watch: https://github.com/$REPO/actions"
echo "─────────────────────────────────────────────────────────────────────────"
echo ""
