// Content Publisher Agent
// Converts generated markdown to HTML blog posts and updates the website

import fs from 'fs/promises';
import path from 'path';
import { marked } from 'marked';

interface BlogPost {
  slug: string;
  title: string;
  keywords: string;
  audience: string;
  generated: string;
  wordCount: number;
  content: string;
  htmlContent: string;
}

/**
 * Parse markdown frontmatter
 */
function parseFrontmatter(markdown: string): { metadata: any; content: string } {
  const frontmatterRegex = /^---\n([\s\S]*?)\n---\n([\s\S]*)$/;
  const match = markdown.match(frontmatterRegex);

  if (!match) {
    return { metadata: {}, content: markdown };
  }

  const [, frontmatter, content] = match;
  const metadata: any = {};

  frontmatter.split('\n').forEach(line => {
    const [key, ...valueParts] = line.split(':');
    if (key && valueParts.length > 0) {
      metadata[key.trim()] = valueParts.join(':').trim();
    }
  });

  return { metadata, content };
}

/**
 * Convert markdown blog post to HTML with SEO meta tags
 */
function generateHTML(post: BlogPost): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${post.title} | Analog-AI Operations</title>
  <meta name="description" content="${post.title} - ${post.audience}">
  <meta name="keywords" content="${post.keywords}">
  <meta name="author" content="Pedro Bandeira">
  <meta property="og:title" content="${post.title}">
  <meta property="og:description" content="${post.title}">
  <meta property="og:type" content="article">
  <meta property="og:url" content="https://analog-ai.vercel.app/blog/${post.slug}.html">
  <link rel="canonical" href="https://analog-ai.vercel.app/blog/${post.slug}.html">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      line-height: 1.6;
      color: #1a1a1a;
      max-width: 800px;
      margin: 0 auto;
      padding: 2rem;
      background: #ffffff;
    }
    header { margin-bottom: 3rem; }
    h1 {
      font-size: 2.5rem;
      font-weight: 700;
      margin-bottom: 1rem;
      line-height: 1.2;
    }
    .meta {
      color: #666;
      font-size: 0.9rem;
      margin-bottom: 2rem;
    }
    article h2 { margin-top: 2rem; margin-bottom: 1rem; font-size: 1.8rem; }
    article h3 { margin-top: 1.5rem; margin-bottom: 0.75rem; font-size: 1.4rem; }
    article p { margin-bottom: 1.25rem; }
    article ul, article ol { margin: 1rem 0 1rem 2rem; }
    article li { margin-bottom: 0.5rem; }
    article strong { font-weight: 600; }
    article em { font-style: italic; }
    article code {
      background: #f4f4f4;
      padding: 0.2rem 0.4rem;
      border-radius: 3px;
      font-family: 'Courier New', monospace;
      font-size: 0.9em;
    }
    .back-link {
      display: inline-block;
      margin-top: 3rem;
      color: #0066cc;
      text-decoration: none;
      font-weight: 500;
    }
    .back-link:hover { text-decoration: underline; }
    @media (max-width: 768px) {
      body { padding: 1rem; }
      h1 { font-size: 2rem; }
    }
  </style>
</head>
<body>
  <header>
    <h1>${post.title}</h1>
    <div class="meta">
      Published: ${new Date(post.generated).toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      })} • ${post.wordCount} words
    </div>
  </header>

  <article>
${post.htmlContent}
  </article>

  <a href="/blog/" class="back-link">← Back to all articles</a>
</body>
</html>`;
}

/**
 * Generate blog index page
 */
async function generateBlogIndex(posts: BlogPost[]): Promise<string> {
  const postsList = posts
    .sort((a, b) => new Date(b.generated).getTime() - new Date(a.generated).getTime())
    .map(post => `
      <article class="post-card">
        <h2><a href="${post.slug}.html">${post.title}</a></h2>
        <div class="meta">${new Date(post.generated).toLocaleDateString('en-US', { 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        })} • ${post.wordCount} words</div>
        <p class="audience">${post.audience}</p>
      </article>
    `)
    .join('\n');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Blog | Analog-AI Operations</title>
  <meta name="description" content="AI operations insights for regulated industries - pharma, finance, legal, healthcare">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      line-height: 1.6;
      color: #1a1a1a;
      max-width: 900px;
      margin: 0 auto;
      padding: 2rem;
      background: #ffffff;
    }
    header { margin-bottom: 3rem; }
    h1 { font-size: 2.5rem; font-weight: 700; margin-bottom: 0.5rem; }
    .subtitle { color: #666; font-size: 1.1rem; margin-bottom: 2rem; }
    .post-card {
      margin-bottom: 2.5rem;
      padding-bottom: 2.5rem;
      border-bottom: 1px solid #e0e0e0;
    }
    .post-card:last-child { border-bottom: none; }
    .post-card h2 { font-size: 1.8rem; margin-bottom: 0.5rem; }
    .post-card h2 a {
      color: #1a1a1a;
      text-decoration: none;
    }
    .post-card h2 a:hover {
      color: #0066cc;
    }
    .meta {
      color: #666;
      font-size: 0.9rem;
      margin-bottom: 0.5rem;
    }
    .audience {
      color: #444;
      font-size: 1rem;
    }
    .home-link {
      display: inline-block;
      margin-top: 2rem;
      color: #0066cc;
      text-decoration: none;
      font-weight: 500;
    }
    .home-link:hover { text-decoration: underline; }
  </style>
</head>
<body>
  <header>
    <h1>Thought Leadership</h1>
    <p class="subtitle">AI operations insights for regulated industries</p>
  </header>

  <main>
${postsList}
  </main>

  <a href="/" class="home-link">← Back to home</a>
</body>
</html>`;
}

/**
 * Publish all generated content to the website
 */
export async function publishContent(): Promise<void> {
  console.log('📤 Publishing content to website...');

  const generatedDir = path.join(__dirname, '../generated-content');
  const blogDir = path.join(__dirname, '../public/blog');

  // Create blog directory if it doesn't exist
  await fs.mkdir(blogDir, { recursive: true });

  // Read all generated markdown files
  const files = await fs.readdir(generatedDir);
  const mdFiles = files.filter(f => f.endsWith('.md'));

  if (mdFiles.length === 0) {
    console.log('⚠️  No content to publish');
    return;
  }

  const posts: BlogPost[] = [];

  for (const file of mdFiles) {
    const filePath = path.join(generatedDir, file);
    const markdown = await fs.readFile(filePath, 'utf-8');
    const { metadata, content } = parseFrontmatter(markdown);

    const slug = file.replace('.md', '');
    const htmlContent = marked.parse(content);

    const post: BlogPost = {
      slug,
      title: metadata.title || 'Untitled',
      keywords: metadata.keywords || '',
      audience: metadata.audience || '',
      generated: metadata.generated || new Date().toISOString(),
      wordCount: parseInt(metadata.wordCount) || 0,
      content,
      htmlContent
    };

    // Generate HTML file
    const html = generateHTML(post);
    const htmlPath = path.join(blogDir, `${slug}.html`);
    await fs.writeFile(htmlPath, html, 'utf-8');

    console.log(`✅ Published: ${slug}.html`);
    posts.push(post);
  }

  // Generate blog index
  const indexHTML = await generateBlogIndex(posts);
  await fs.writeFile(path.join(blogDir, 'index.html'), indexHTML, 'utf-8');

  console.log(`✅ Published blog index with ${posts.length} articles`);
}

// Run if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  publishContent()
    .then(() => {
      console.log('\n✨ Publishing complete!');
      process.exit(0);
    })
    .catch(error => {
      console.error('❌ Error:', error);
      process.exit(1);
    });
}
