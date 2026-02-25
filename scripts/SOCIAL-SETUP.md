# Social Media Automation — One-Time Setup

This guide gets you LinkedIn and Facebook tokens so the GitHub Action can post automatically.
Do this once. Then it runs every Monday/Wednesday/Friday on its own.

---

## Part 1 — LinkedIn

### Step 1: Create a LinkedIn App

1. Go to [linkedin.com/developers/apps](https://www.linkedin.com/developers/apps)
2. Click **Create app**
3. Fill in:
   - App name: `Analog AI Social` (anything works)
   - LinkedIn Page: select your **Analog AI page**
   - Privacy policy URL: `https://analog-ai.vercel.app` (ok to use site URL for now)
   - App logo: upload any image
4. Click **Create app**

### Step 2: Request the right permissions

1. In your new app, go to **Products** tab
2. Request access to **Share on LinkedIn** (posts as your profile)
3. If you want to post as the **Analog AI Page** (recommended), also request **Marketing Developer Platform**
   - This may require verification — if so, use your personal profile posting (`w_member_social`) for now

### Step 3: Get your access token

**Option A — Quick (posts as your personal profile):**

1. In the app, go to **Auth** tab
2. Under OAuth 2.0 tools, click **OAuth 2.0 tools** link → or go to [linkedin.com/developers/tools/oauth](https://www.linkedin.com/developers/tools/oauth)
3. Select your app, tick scopes: `r_liteprofile`, `w_member_social`
4. Click **Request access token**
5. Authorize → copy the **Access Token**

**Option B — Posts as Analog AI Page (better for brand):**

Needs Marketing Developer Platform approval (can take a few days).
Once approved, same flow but select `w_organization_social` scope.

### Step 4: Get your Author URN

**For personal profile:**
```
curl -H "Authorization: Bearer YOUR_ACCESS_TOKEN" https://api.linkedin.com/v2/me
```
Look for `"id": "abc123"` → your URN is `urn:li:person:abc123`

**For organization page:**
```
curl -H "Authorization: Bearer YOUR_ACCESS_TOKEN" "https://api.linkedin.com/v2/organizationalEntityAcls?q=roleAssignee&role=ADMINISTRATOR"
```
Look for `"organization": "urn:li:organization:12345678"` → use that URN.

### Step 5: Save to .env.local

```
LINKEDIN_ACCESS_TOKEN=AQV...your-token...
LINKEDIN_AUTHOR_URN=urn:li:organization:12345678
```

⚠️ **Token expiry**: LinkedIn access tokens expire after 60 days. Set a calendar reminder to refresh. The refresh is just repeating Step 3.

---

## Part 2 — Facebook Page

### Step 1: Get a Page Access Token

1. Go to [developers.facebook.com/tools/explorer](https://developers.facebook.com/tools/explorer/)
2. Top right → select your app (create one at developers.facebook.com if needed — same as LinkedIn, just a name)
3. Click **Generate Access Token** → log in and grant permissions:
   - `pages_manage_posts`
   - `pages_read_engagement`
4. In the explorer, run this query to get your Page token:
   ```
   /me/accounts
   ```
5. Find your **Analog AI** page in the result → copy its `access_token`
6. Copy the page `id` too

### Step 2: Make the token permanent (important!)

User tokens expire in 60 days. Page tokens can be permanent.

1. First, exchange your short-lived user token for a long-lived one:
   ```
   GET https://graph.facebook.com/oauth/access_token
     ?grant_type=fb_exchange_token
     &client_id=YOUR_APP_ID
     &client_secret=YOUR_APP_SECRET
     &fb_exchange_token=YOUR_SHORT_LIVED_TOKEN
   ```
   (Your App ID and Secret are in developers.facebook.com → your app → Settings → Basic)

2. Then get the long-lived page token:
   ```
   GET https://graph.facebook.com/me/accounts?access_token=LONG_LIVED_USER_TOKEN
   ```
   The `access_token` in this response is a **permanent page token** — it never expires.

### Step 3: Save to .env.local

```
FACEBOOK_PAGE_ACCESS_TOKEN=EAAx...your-permanent-page-token...
FACEBOOK_PAGE_ID=123456789012345
```

---

## Part 3 — Add to GitHub Secrets

These go in **GitHub → your repo → Settings → Secrets and variables → Actions → New repository secret**:

| Secret name | Value |
|---|---|
| `LINKEDIN_ACCESS_TOKEN` | Your LinkedIn token |
| `LINKEDIN_AUTHOR_URN` | `urn:li:organization:...` |
| `FACEBOOK_PAGE_ACCESS_TOKEN` | Your permanent page token |
| `FACEBOOK_PAGE_ID` | Your page's numeric ID |

The `GEMINI_API_KEY` and `SITE_URL` secrets should already be there from the Pulse setup.

---

## Part 4 — Test it locally first

Once you have the tokens in `.env.local`:

```bash
# Generate this week's posts
npm run social:generate

# Preview what Monday's posts look like (dry run — won't actually post)
cat scripts/output/social-posts-*.json | jq '.posts[] | select(.scheduledDay=="Monday") | {platform, type, text}'

# Post Monday's content right now (live!)
npm run social:post -- mon
```

---

## How the automation works

| Day | Time (Warsaw) | What happens |
|-----|---------------|--------------|
| Monday | 07:00 | Generate 6 posts for the week + post Monday's digest |
| Wednesday | 09:00 | Post Wednesday's article spotlight |
| Friday | 08:00 | Post Friday's original take |

Posts are saved to `scripts/output/social-posts-YYYY-WNN.json` and committed to the repo each Monday.

---

## Troubleshooting

**LinkedIn 401 error** → token expired, re-run Step 1 OAuth flow

**LinkedIn 403 error** → wrong scope, make sure `w_member_social` or `w_organization_social` is included

**Facebook 190 error** → token expired or invalid, regenerate via Graph Explorer

**Facebook 200 error** → permissions issue, check `pages_manage_posts` is granted

**No posts found for day** → Monday's generate step didn't run, trigger manually: GitHub Actions → Weekly Social Posts → Run workflow → set day to `mon`
