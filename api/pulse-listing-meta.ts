// api/pulse-listing-meta.ts
// Vercel Serverless Function — serves pre-rendered HTML for the /pulse listing page
// so crawlers (Googlebot, etc.) get indexable content instead of an empty SPA shell.

import type { VercelRequest, VercelResponse } from '@vercel/node';
import { readFileSync } from 'fs';
import { join } from 'path';

interface PulseItem {
  slug: string;
  category: string;
  noise: string;
  translation: string;
  date: string;
  isoDate?: string;
  keywords: string[];
  image?: string;
}

function esc(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function firstSentence(text: string, maxLen = 120): string {
  const match = text.match(/^[^.!?]+[.!?]/);
  const sentence = match ? match[0] : text;
  return sentence.length > maxLen ? sentence.slice(0, maxLen).trimEnd() + '…' : sentence;
}

export default function handler(_req: VercelRequest, res: VercelResponse) {
  const BASE = 'https://analog-ai.vercel.app';
  
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

  const title = 'The Pulse — AI Intelligence for Business Leaders | Analog AI';
  const description = 'Daily AI news translated into plain business language. No hype, no jargon — just what matters for your company, your industry, your decisions.';
  const ogImage = `${BASE}/images/pulse/default-og.jpg`;

  // Build article list HTML for crawlers
  const articleListHtml = items.slice(0, 20).map(item => {
    const url = `${BASE}/pulse/${item.slug}`;
    return `<article>
      <h2><a href="${url}">${esc(firstSentence(item.noise, 200))}</a></h2>
      <p>${esc(firstSentence(item.translation, 155))}</p>
      <span>${esc(item.category)} · ${esc(item.date)}</span>
    </article>`;
  }).join('\n    ');

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <title>${esc(title)}</title>
  <meta name="description" content="${esc(description)}" />
  <meta property="og:type" content="website" />
  <meta property="og:title" content="${esc(title)}" />
  <meta property="og:description" content="${esc(description)}" />
  <meta property="og:url" content="${BASE}/pulse" />
  <meta property="og:image" content="${ogImage}" />
  <meta property="og:site_name" content="Analog AI — The Pulse" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${esc(title)}" />
  <meta name="twitter:description" content="${esc(description)}" />
  <meta name="twitter:image" content="${ogImage}" />
  <link rel="canonical" href="${BASE}/pulse" />
  <meta http-equiv="refresh" content="0;url=${BASE}/pulse" />
</head>
<body>
  <h1>The Pulse — AI Intelligence for Business Leaders</h1>
  <p>${esc(description)}</p>
  <section>
    ${articleListHtml}
  </section>
  <p><a href="${BASE}/pulse">View all articles on Analog AI</a></p>
</body>
</html>`;

  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.setHeader('Cache-Control', 'public, max-age=3600, s-maxage=86400');
  return res.status(200).send(html);
}
