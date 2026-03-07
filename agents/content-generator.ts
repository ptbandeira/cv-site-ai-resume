// Content Generator Agent — Pulse Format (News Analysis)
// v2: Now fetches REAL news from Google News RSS before generating analysis
// Uses Gemini 2.0 Flash (FREE tier)

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { load } from 'cheerio';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

interface NewsConfig {
  newsTopics: Array<{
    id: string;
    category: string;
    keywords: string[];
    targetAudience: string;
    sources: string[];
    priority?: number;
  }>;
  pulseFormat: {
    structure: {
      noise: { description: string; maxLength: number; tone: string };
      translation: { description: string; maxLength: number; tone: string };
      action: { description: string; maxLength: number; tone: string };
    };
    analogPerspective: {
      description: string;
      themes: string[];
    };
  };
}

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
  sources?: Array<{ label: string; url: string }>;
}

interface NewsArticle {
  title: string;
  link: string;
  source: string;
  pubDate: string;
}

// ─── Google News RSS fetcher ──────────────────────────────────────────────────

async function fetchGoogleNews(query: string, maxResults = 5): Promise<NewsArticle[]> {
  const encoded = encodeURIComponent(query);
  const url = `https://news.google.com/rss/search?q=${encoded}+when:3d&hl=en&gl=US&ceid=US:en`;

  try {
    const res = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; PulseBot/1.0)' },
    });
    if (!res.ok) return [];
    const xml = await res.text();
    const $ = load(xml, { xmlMode: true });

    const articles: NewsArticle[] = [];
    $('item').each((i, el) => {
      if (i >= maxResults) return false;
      const title = $(el).find('title').text().trim();
      const link = $(el).find('link').text().trim();
      const source = $(el).find('source').text().trim();
      const pubDate = $(el).find('pubDate').text().trim();
      if (title && link) {
        articles.push({ title, link, source, pubDate });
      }
    });
    return articles;
  } catch (err: any) {
    console.warn(`   ⚠️  RSS fetch failed for "${query}": ${err.message}`);
    return [];
  }
}

async function fetchNewsForTopic(topic: NewsConfig['newsTopics'][0]): Promise<NewsArticle[]> {
  // Pick 3 diverse keywords to search
  const searchTerms = topic.keywords
    .sort(() => Math.random() - 0.5)
    .slice(0, 3);

  console.log(`   🔍 Searching: ${searchTerms.join(' | ')}`);

  const allArticles: NewsArticle[] = [];
  const seenTitles = new Set<string>();

  for (const term of searchTerms) {
    const articles = await fetchGoogleNews(term, 5);
    for (const a of articles) {
      const key = a.title.toLowerCase().slice(0, 60);
      if (!seenTitles.has(key)) {
        seenTitles.add(key);
        allArticles.push(a);
      }
    }
    // Small delay between requests
    await new Promise(r => setTimeout(r, 500));
  }

  console.log(`   📰 Found ${allArticles.length} unique articles`);
  return allArticles;
}

// ─── Gemini ───────────────────────────────────────────────────────────────────

async function callGemini(prompt: string): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error('GEMINI_API_KEY not set');

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 2048,
        },
      }),
    }
  );

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Gemini API error: ${response.status} - ${error}`);
  }

  const data = await response.json();
  const parts = data.candidates?.[0]?.content?.parts ?? [];
  const text = parts.map((p: any) => p.text ?? '').join('');
  if (!text) throw new Error(`Gemini returned empty. finishReason: ${data.candidates?.[0]?.finishReason}`);
  return text;
}

// ─── Generate Pulse item from REAL news ───────────────────────────────────────

export async function generatePulseItem(
  topic: NewsConfig['newsTopics'][0],
  pulseFormat: NewsConfig['pulseFormat'],
  articles: NewsArticle[]
): Promise<PulseItem | null> {
  console.log(`📝 Generating Pulse item for: ${topic.category}`);

  if (articles.length === 0) {
    console.warn(`   ⚠️  No articles found for ${topic.category} — skipping`);
    return null;
  }

  // Feed REAL headlines to Gemini
  const articleList = articles.slice(0, 8).map((a, i) =>
    `${i + 1}. "${a.title}" — ${a.source} (${a.pubDate})\n   URL: ${a.link}`
  ).join('\n');

  const prompt = `You are Pedro Bandeira — a 50-year-old Portuguese entrepreneur with 25+ years bridging analog business + AI execution. Based in Warsaw, Poland. You're the "Xennial advantage" — you started working before mobile phones existed, understand pre-digital org politics, and now execute AI operations for regulated industries.

**Your job:** Pick the MOST IMPORTANT story from the real headlines below and write a Pulse news analysis entry.

**Category:** ${topic.category}
**Target Audience:** ${topic.targetAudience}

**REAL NEWS HEADLINES (choose the best one to analyze):**
${articleList}

**ANALOG-AI PERSPECTIVE (your unique edge):**
${pulseFormat.analogPerspective.themes.join('\n- ')}

**OUTPUT FORMAT (strict — follow exactly):**

1. **THE NOISE** (${pulseFormat.structure.noise.maxLength} chars max)
   ${pulseFormat.structure.noise.description}
   ${pulseFormat.structure.noise.tone}

2. **THE TRANSLATION** (${pulseFormat.structure.translation.maxLength} chars max)
   ${pulseFormat.structure.translation.description}
   ${pulseFormat.structure.translation.tone}

3. **THE ACTION** (${pulseFormat.structure.action.maxLength} chars max)
   ${pulseFormat.structure.action.description}
   ${pulseFormat.structure.action.tone}

**RULES:**
- You MUST base your analysis on one of the real headlines above — do NOT invent news
- Show your 50yo operator experience (pattern recognition AI-natives lack)
- Be specific and actionable, not generic
- Use first-person ("I can implement this in 1-3 days")
- No fluff or buzzwords
- Respond with the headline number you chose

**OUTPUT (plain text, exact format):**
CHOSEN_ARTICLE: [number]
NOISE: [your noise text]
TRANSLATION: [your translation text]
ACTION: [your action text]`;

  const response = await callGemini(prompt);

  // Parse response
  const chosenMatch = response.match(/CHOSEN_ARTICLE:\s*(\d+)/);
  const noiseMatch = response.match(/NOISE:\s*(.+?)(?=TRANSLATION:|$)/s);
  const translationMatch = response.match(/TRANSLATION:\s*(.+?)(?=ACTION:|$)/s);
  const actionMatch = response.match(/ACTION:\s*(.+?)$/s);

  const noise = noiseMatch?.[1]?.trim() || '';
  const translation = translationMatch?.[1]?.trim() || '';
  const action = actionMatch?.[1]?.trim() || '';

  if (!noise || !translation || !action) {
    console.warn('⚠️  Incomplete generation — raw response:');
    console.warn(response.slice(0, 500));
    return null;
  }

  // Get source URL from the chosen article
  const chosenIdx = parseInt(chosenMatch?.[1] || '1') - 1;
  const chosenArticle = articles[chosenIdx] || articles[0];

  const slug = topic.id + '-' + Date.now();
  const now = new Date();

  return {
    id: slug,
    slug,
    category: topic.category,
    noise,
    translation,
    action,
    date: now.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }),
    isoDate: now.toISOString(),
    keywords: topic.keywords.slice(0, 5),
    sources: [{ label: chosenArticle.source || topic.category, url: chosenArticle.link }],
  };
}

// ─── Main orchestrator ────────────────────────────────────────────────────────

export async function runPulseGenerator(): Promise<PulseItem[]> {
  console.log('🚀 Starting Pulse Generator v2 (Real News + AI Analysis)\n');

  const configPath = path.join(__dirname, 'content-config.json');
  const configData = await fs.readFile(configPath, 'utf-8');
  const config: NewsConfig = JSON.parse(configData);

  // Sort topics by priority, generate for top 3 (not just 1 random)
  const sortedTopics = [...config.newsTopics].sort((a, b) => (a.priority ?? 99) - (b.priority ?? 99));
  const targetTopics = sortedTopics.slice(0, 3);

  const results: PulseItem[] = [];

  for (const topic of targetTopics) {
    console.log(`\n📌 Topic: ${topic.category} (priority ${topic.priority ?? '?'})`);

    // Step 1: Fetch REAL news
    const articles = await fetchNewsForTopic(topic);

    if (articles.length === 0) {
      console.log(`   ⏭  No fresh news — skipping`);
      continue;
    }

    // Step 2: Generate analysis from real news
    const item = await generatePulseItem(topic, config.pulseFormat, articles);

    if (item) {
      results.push(item);
      console.log(`   ✅ Generated: "${item.noise.slice(0, 60)}..."`);
    }

    // Delay between topics
    await new Promise(r => setTimeout(r, 1000));
  }

  if (results.length === 0) {
    console.log('\n⚠️  No items generated — no fresh news found.');
    return [];
  }

  // Save all items
  const outputDir = path.join(__dirname, '../public/blog');
  await fs.mkdir(outputDir, { recursive: true });

  for (const item of results) {
    const filename = `${item.slug}.json`;
    const filePath = path.join(outputDir, filename);
    await fs.writeFile(filePath, JSON.stringify(item, null, 2), 'utf-8');
    console.log(`   💾 Saved: ${filename}`);
  }

  return results;
}

// Run if executed directly
runPulseGenerator()
  .then(results => {
    console.log(`\n✨ Done! Generated ${results.length} Pulse items`);
    process.exit(0);
  })
  .catch(error => {
    console.error('❌ Error:', error);
    process.exit(1);
  });
