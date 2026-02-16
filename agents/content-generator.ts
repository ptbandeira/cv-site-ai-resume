// Content Generator Agent — FREE VERSION
// Uses Gemini Flash 2.0 (1500 requests/day FREE)

import fs from 'fs/promises';
import path from 'path';

interface ContentConfig {
  topics: Array<{
    id: string;
    title: string;
    keywords: string[];
    targetAudience: string;
    angle: string;
  }>;
  contentFormats: Array<{
    type: string;
    length: number;
    structure: string[];
  }>;
  seoOptimization: {
    targetSearchEngines: string[];
    focusKeywords: string[];
  };
}

interface GeneratedContent {
  topic: string;
  title: string;
  content: string;
  metadata: {
    keywords: string[];
    targetAudience: string;
    generatedAt: string;
    wordCount: number;
  };
}

/**
 * Call Gemini Flash API (FREE tier - 1500 requests/day)
 */
async function callGeminiFlash(prompt: string): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY;
  
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY not set in environment variables');
  }

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: prompt }]
        }],
        generationConfig: {
          temperature: 0.7,
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
 * Generate SEO-optimized content for a topic
 */
export async function generateContent(
  topic: ContentConfig['topics'][0],
  format: ContentConfig['contentFormats'][0],
  seoKeywords: string[]
): Promise<GeneratedContent> {
  
  console.log(`📝 Generating ${format.type} for: ${topic.title}`);

  const prompt = `You are an expert content writer specializing in AI operations and digital transformation for regulated industries.

Write a ${format.type} article (${format.length} words) on the following topic:

**Title**: ${topic.title}
**Target Audience**: ${topic.targetAudience}
**Angle**: ${topic.angle}
**Keywords to include naturally**: ${topic.keywords.join(', ')}

**Structure**:
${format.structure.map((section, i) => `${i + 1}. ${section}`).join('\n')}

**SEO Requirements**:
- Must rank well in ChatGPT, Claude, Perplexity, and Google searches
- Target these phrases: ${seoKeywords.slice(0, 3).join(', ')}
- Use semantic SEO (related terms, concepts, context)
- Write for C-suite executives making AI transformation decisions

**Tone**:
- Professional but accessible
- Data-driven with specific examples
- Action-oriented (clear next steps)
- Thought leadership voice

**CRITICAL**:
- NO fluff or generic advice
- MUST include specific frameworks, methodologies, or action plans
- Show deep expertise in regulated industries (pharma, finance, legal, healthcare)
- Emphasize the "analog advantage" - experience from pre-digital business world

Write the complete article now. Output ONLY the article content (no meta-commentary).`;

  const content = await callGeminiFlash(prompt);

  return {
    topic: topic.id,
    title: topic.title,
    content,
    metadata: {
      keywords: topic.keywords,
      targetAudience: topic.targetAudience,
      generatedAt: new Date().toISOString(),
      wordCount: content.split(/\s+/).length
    }
  };
}

/**
 * Main content generation orchestrator
 */
export async function runContentGenerator(): Promise<GeneratedContent[]> {
  console.log('🚀 Starting Content Generation (Gemini Flash FREE)');

  // Load config
  const configPath = path.join(__dirname, 'content-config.json');
  const configData = await fs.readFile(configPath, 'utf-8');
  const config: ContentConfig = JSON.parse(configData);

  const results: GeneratedContent[] = [];

  // Generate one article per week (pick random topic)
  const randomTopic = config.topics[Math.floor(Math.random() * config.topics.length)];
  const randomFormat = config.contentFormats[Math.floor(Math.random() * config.contentFormats.length)];

  console.log(`📌 Selected: ${randomTopic.title} (${randomFormat.type})`);

  const article = await generateContent(
    randomTopic,
    randomFormat,
    config.seoOptimization.focusKeywords
  );

  results.push(article);

  // Save to output file
  const outputDir = path.join(__dirname, '../generated-content');
  await fs.mkdir(outputDir, { recursive: true });

  const filename = `${randomTopic.id}-${Date.now()}.md`;
  const filePath = path.join(outputDir, filename);

  const markdown = `---
title: ${article.title}
keywords: ${article.metadata.keywords.join(', ')}
audience: ${article.metadata.targetAudience}
generated: ${article.metadata.generatedAt}
wordCount: ${article.metadata.wordCount}
---

${article.content}
`;

  await fs.writeFile(filePath, markdown, 'utf-8');

  console.log(`✅ Generated: ${filename}`);
  console.log(`   Words: ${article.metadata.wordCount}`);
  console.log(`   Saved to: ${filePath}`);

  return results;
}

// Run if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runContentGenerator()
    .then(results => {
      console.log(`\n✨ Done! Generated ${results.length} articles`);
      process.exit(0);
    })
    .catch(error => {
      console.error('❌ Error:', error);
      process.exit(1);
    });
}
