// Content Generator Agent — Pulse Format (News Analysis)
// Uses Gemini 2.5 Flash (FREE tier)

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

interface NewsConfig {
  newsTopics: Array<{
    id: string;
    category: string;
    keywords: string[];
    targetAudience: string;
    sources: string[];
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
  keywords: string[];
  sources?: Array<{ label: string; url: string }>;
}

/**
 * Call Gemini 2.5 Flash API
 */
async function callGemini(prompt: string): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY;
  
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY not set');
  }

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-lite:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: prompt }]
        }],
        generationConfig: {
          temperature: 0.8,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 2048
        }
      })
    }
  );

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Gemini API error: ${response.status} - ${error}`);
  }

  const data = await response.json();
  return data.candidates[0].content.parts[0].text;
}

/**
 * Generate Pulse-format news analysis
 */
export async function generatePulseItem(
  topic: NewsConfig['newsTopics'][0],
  pulseFormat: NewsConfig['pulseFormat']
): Promise<PulseItem> {
  
  console.log(`📝 Generating Pulse item for: ${topic.category}`);

  const prompt = `You are Pedro Bandeira — a 50-year-old Portuguese entrepreneur with 25+ years bridging analog business + AI execution. You're the "Xennial advantage" — you started working before mobile phones existed, understand pre-digital org politics, and now execute AI operations for regulated industries.

**Your job:** Write a Pulse news analysis entry.

**Category:** ${topic.category}
**Target Audience:** ${topic.targetAudience}
**Keywords to monitor:** ${topic.keywords.join(', ')}

**ANALOG-AI PERSPECTIVE (your unique edge):**
${pulseFormat.analogPerspective.themes.join('\n- ')}

**OUTPUT FORMAT (3 sections, exact structure):**

1. **THE NOISE** (${pulseFormat.structure.noise.maxLength} chars max)
   ${pulseFormat.structure.noise.description}
   ${pulseFormat.structure.noise.tone}
   
   Example: "Meta releases Llama 4, OpenClaw launches open-source agent framework."
   
2. **THE TRANSLATION** (${pulseFormat.structure.translation.maxLength} chars max)
   ${pulseFormat.structure.translation.description}
   ${pulseFormat.structure.translation.tone}
   
   Example: "Self-hosted models are now good enough for production workloads. You can stop sending client data to US servers."
   
3. **THE ACTION** (${pulseFormat.structure.action.maxLength} chars max)
   ${pulseFormat.structure.action.description}
   ${pulseFormat.structure.action.tone}
   
   Example: "I can redeploy your document processing pipeline to run on-premise using Llama 4 + OpenClaw — comparable quality on the right tasks, full data sovereignty, zero API costs."

**CRITICAL REQUIREMENTS:**
- Pick a RECENT, REAL news story from this category (Feb 2026)
- Show your 50yo operator experience (pattern recognition AI-natives lack)
- Be specific and actionable, not generic
- Use first-person ("I can implement this in 1-3 days")
- No fluff or buzzwords

**OUTPUT (plain text, exact format):**
NOISE: [your noise text here]
TRANSLATION: [your translation text here]
ACTION: [your action text here]
SOURCE_URL: [actual URL to the news source]`;

  const response = await callGemini(prompt);



  // Parse response
  const noiseMatch = response.match(/NOISE:\s*(.+?)(?=TRANSLATION:|$)/s);
  const translationMatch = response.match(/TRANSLATION:\s*(.+?)(?=ACTION:|$)/s);
  const actionMatch = response.match(/ACTION:\s*(.+?)(?=SOURCE_URL:|$)/s);
  const sourceMatch = response.match(/SOURCE_URL:\s*(.+?)$/s);

  const noise = noiseMatch?.[1]?.trim() || '';
  const translation = translationMatch?.[1]?.trim() || '';
  const action = actionMatch?.[1]?.trim() || '';
  const sourceUrl = sourceMatch?.[1]?.trim() || '';

  // Guard: if key fields are empty, log and skip
  if (!noise || !translation || !action) {
    console.warn('⚠️  Incomplete generation — one or more fields empty. Raw response:');
    console.warn(response.slice(0, 500));
  }

  const slug = topic.id + '-' + Date.now();
  const now = new Date();
  const date = now.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
  const isoDate = now.toISOString();

  return {
    id: slug,
    slug,
    category: topic.category,
    noise,
    translation,
    action,
    date,
    isoDate,
    keywords: topic.keywords,
    sources: sourceUrl ? [{ label: topic.category, url: sourceUrl }] : undefined
  };
}

/**
 * Main orchestrator
 */
export async function runPulseGenerator(): Promise<PulseItem[]> {
  console.log('🚀 Starting Pulse Generator (News Analysis Format)');

  // Load config
  const configPath = path.join(__dirname, 'content-config.json');
  const configData = await fs.readFile(configPath, 'utf-8');
  const config: NewsConfig = JSON.parse(configData);

  // Generate one Pulse item per run (pick random topic)
  const randomTopic = config.newsTopics[Math.floor(Math.random() * config.newsTopics.length)];

  console.log(`📌 Topic: ${randomTopic.category}`);

  const pulseItem = await generatePulseItem(randomTopic, config.pulseFormat);

  // Save to output
  const outputDir = path.join(__dirname, '../public/blog');
  await fs.mkdir(outputDir, { recursive: true });

  const filename = `${pulseItem.slug}.json`;
  const filePath = path.join(outputDir, filename);

  await fs.writeFile(filePath, JSON.stringify(pulseItem, null, 2), 'utf-8');

  console.log(`✅ Generated: ${filename}`);
  console.log(`   Category: ${pulseItem.category}`);
  console.log(`   Noise: ${pulseItem.noise.substring(0, 60)}...`);

  return [pulseItem];
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
