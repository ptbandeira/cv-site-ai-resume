// api/pulse-meta.ts
// Vercel Serverless Function — serves pre-rendered HTML with OG meta tags
// for social media crawlers hitting /pulse/:slug URLs.
// Normal browsers get the SPA; bots get a minimal HTML page with proper meta tags.
//
// This is called via Vercel rewrites (see vercel.json) for crawler user-agents.

import type { IncomingMessage, ServerResponse } from 'http';
import * as fs from 'fs';
import * as path from 'path';

type VercelRequest = IncomingMessage & { query: Record<string, string | string[]> };
type VercelResponse = ServerResponse & {
  status: (code: number) => VercelResponse;
  json: (data: any) => void;
  send: (body: string) => void;
  setHeader: (name: string, value: string) => void;
};

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
}

function normalizeCategory(cat: string): string {
  if (cat === "Legal Technology") return "Legal Tech";
  return cat;
}

function firstSentence(text: string, maxLen = 120): string {
  const match = text.match(/^[^.!?]+[.!?]/);
  const sentence = match ? match[0] : text;
  return sentence.length > maxLen ? sentence.slice(0, maxLen).trimEnd() + "…" : sentence;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const slug = req.query.slug as string;
  if (!slug) return res.status(404).send('Not found');

  // Read manifest.json from the build output
  let items: PulseItem[] = [];
  try {
    const manifestPath = path.join(process.cwd(), 'public', 'manifest.json');
    const raw = fs.readFileSync(manifestPath, 'utf-8');
    items = JSON.parse(raw).items ?? [];
  } catch {
    // Fallback: try dist folder
    try {
      const manifestPath = path.join(process.cwd(), 'dist', 'manifest.json');
      const raw = fs.readFileSync(manifestPath, 'utf-8');
      items = JSON.parse(raw).items ?? [];
    } catch {
      return res.status(500).send('Could not load manifest');
    }
  }

  const item = items.find((i) => i.slug === slug);
  if (!item) return res.status(404).send('Article not found');

  const BASE = "https://analog-ai.vercel.app";
  const articleUrl = `${BASE}/pulse/${item.slug}`;
  const title = `${firstSentence(item.noise, 200)} | Analog AI Pulse`;
  const description = firstSentence(item.translation, 155);
  const category = normalizeCategory(item.category);
  const ogImage = `${BASE}/api/og?title=${encodeURIComponent(firstSentence(item.noise, 200))}&category=${encodeURIComponent(category)}&date=${encodeURIComponent(item.date)}`;

  // Minimal HTML with full OG tags — then redirect browsers to the SPA
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <title>${escapeHtml(title)}</title>
  <meta name="description" content="${escapeHtml(description)}" />

  <!-- Open Graph -->
  <meta property="og:type" content="article" />
  <meta property="og:title" content="${escapeHtml(title)}" />
  <meta property="og:description" content="${escapeHtml(description)}" />
  <meta property="og:url" content="${articleUrl}" />
  <meta property="og:image" content="${escapeHtml(ogImage)}" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta property="og:site_name" content="Analog AI — The Pulse" />

  <!-- Twitter / X -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${escapeHtml(title)}" />
  <meta name="twitter:description" content="${escapeHtml(description)}" />
  <meta name="twitter:image" content="${escapeHtml(ogImage)}" />

  <link rel="canonical" href="${articleUrl}" />

  <!-- Non-bot browsers: redirect to SPA -->
  <meta http-equiv="refresh" content="0;url=${articleUrl}" />
</head>
<body>
  <h1>${escapeHtml(firstSentence(item.noise, 200))}</h1>
  <p>${escapeHtml(item.translation)}</p>
  <p><a href="${articleUrl}">Read full analysis on Analog AI</a></p>
</body>
</html>`;

  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.setHeader('Cache-Control', 'public, max-age=3600, s-maxage=86400');
  return res.status(200).send(html);
}

function escapeHtml(str: string): string {
  return str.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
