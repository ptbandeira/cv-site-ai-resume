// api/pulse-meta.ts
// Vercel Serverless Function — serves pre-rendered HTML with OG meta tags
// for social media crawlers hitting /pulse/:slug URLs.
//
// This is called via Vercel rewrites (see vercel.json) for crawler user-agents.

import type { VercelRequest, VercelResponse } from '@vercel/node';
import { readFileSync } from 'fs';
import { join } from 'path';

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
  image?: string;
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

export default function handler(req: VercelRequest, res: VercelResponse) {
  const slug = req.query.slug as string;
  if (!slug) return res.status(404).send('Not found');

  // Read manifest.json from the build output
  let items: PulseItem[] = [];
  try {
    const raw = readFileSync(join(process.cwd(), 'public', 'manifest.json'), 'utf-8');
    items = JSON.parse(raw).items ?? [];
  } catch {
    try {
      const raw = readFileSync(join(process.cwd(), 'dist', 'manifest.json'), 'utf-8');
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

  // Use static article image
  const ogImage = item.image
    ? `${BASE}${item.image}`
    : `${BASE}/images/pulse/default-og.jpg`;

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <title>${esc(title)}</title>
  <meta name="description" content="${esc(description)}" />
  <meta property="og:type" content="article" />
  <meta property="og:title" content="${esc(title)}" />
  <meta property="og:description" content="${esc(description)}" />
  <meta property="og:url" content="${articleUrl}" />
  <meta property="og:image" content="${esc(ogImage)}" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="675" />
  <meta property="og:image:type" content="image/jpeg" />
  <meta property="og:site_name" content="Analog AI — The Pulse" />
  <meta property="article:section" content="${esc(category)}" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:site" content="@abandeirado" />
  <meta name="twitter:creator" content="@abandeirado" />
  <meta name="twitter:title" content="${esc(title)}" />
  <meta name="twitter:description" content="${esc(description)}" />
  <meta name="twitter:image" content="${esc(ogImage)}" />
  <meta name="twitter:image:alt" content="${esc(category)} — Analog AI Pulse" />
  <link rel="canonical" href="${articleUrl}" />
  <meta http-equiv="refresh" content="0;url=${articleUrl}" />
</head>
<body>
  <h1>${esc(firstSentence(item.noise, 200))}</h1>
  <p>${esc(item.translation)}</p>
  <p><a href="${articleUrl}">Read full analysis on Analog AI</a></p>
</body>
</html>`;

  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.setHeader('Cache-Control', 'public, max-age=3600, s-maxage=86400');
  return res.status(200).send(html);
}

function esc(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
