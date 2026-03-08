/**
 * Auto-generate sitemap.xml from manifest.json + static pages
 * Run: npx tsx scripts/generate-sitemap.ts
 * Also called automatically by content-publisher.ts
 */

import { promises as fs } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const BASE_URL = "https://analog-ai.vercel.app";

interface PulseItem {
  slug: string;
  isoDate?: string;
  date?: string;
}

interface Manifest {
  items: PulseItem[];
}

// Static pages with their change frequency and priority
const STATIC_PAGES = [
  { path: "/", changefreq: "weekly", priority: "1.0" },
  { path: "/pulse", changefreq: "daily", priority: "0.9" },
  { path: "/how-i-work", changefreq: "monthly", priority: "0.8" },
  { path: "/proof", changefreq: "monthly", priority: "0.7" },
  { path: "/tools", changefreq: "monthly", priority: "0.7" },
  { path: "/guides", changefreq: "monthly", priority: "0.7" },
  { path: "/fit", changefreq: "monthly", priority: "0.6" },
  { path: "/press", changefreq: "monthly", priority: "0.6" },
  { path: "/meet", changefreq: "monthly", priority: "0.5" },
  { path: "/blog/eu-ai-act-compliance.html", changefreq: "monthly", priority: "0.8" },
  { path: "/blog/ai-2028-intelligence-scenario.html", changefreq: "monthly", priority: "0.8" },
];

function toISODate(item: PulseItem): string {
  if (item.isoDate) {
    return item.isoDate.split("T")[0];
  }
  try {
    return new Date(item.date ?? "").toISOString().split("T")[0];
  } catch {
    return new Date().toISOString().split("T")[0];
  }
}

async function generateSitemap(): Promise<void> {
  const publicDir = join(__dirname, "../public");
  const manifestPath = join(publicDir, "manifest.json");

  // Read manifest
  let manifest: Manifest = { items: [] };
  try {
    const raw = await fs.readFile(manifestPath, "utf-8");
    manifest = JSON.parse(raw);
  } catch (err) {
    console.warn("⚠️  Could not read manifest.json, generating sitemap with static pages only");
  }

  const today = new Date().toISOString().split("T")[0];

  // Build XML
  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
  xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

  // Static pages
  for (const page of STATIC_PAGES) {
    xml += `  <url>\n`;
    xml += `    <loc>${BASE_URL}${page.path}</loc>\n`;
    xml += `    <lastmod>${today}</lastmod>\n`;
    xml += `    <changefreq>${page.changefreq}</changefreq>\n`;
    xml += `    <priority>${page.priority}</priority>\n`;
    xml += `  </url>\n`;
  }

  // Pulse articles from manifest
  for (const item of manifest.items) {
    xml += `  <url>\n`;
    xml += `    <loc>${BASE_URL}/pulse/${item.slug}</loc>\n`;
    xml += `    <lastmod>${toISODate(item)}</lastmod>\n`;
    xml += `    <changefreq>monthly</changefreq>\n`;
    xml += `    <priority>0.7</priority>\n`;
    xml += `  </url>\n`;
  }

  xml += `</urlset>\n`;

  // Write sitemap
  const sitemapPath = join(publicDir, "sitemap.xml");
  await fs.writeFile(sitemapPath, xml, "utf-8");

  const totalUrls = STATIC_PAGES.length + manifest.items.length;
  console.log(`🗺️  Sitemap generated: ${totalUrls} URLs (${STATIC_PAGES.length} static + ${manifest.items.length} articles)`);
  console.log(`📍 ${sitemapPath}`);
}

// Run standalone
generateSitemap()
  .then(() => console.log("✅ Sitemap generation complete"))
  .catch((err) => {
    console.error("❌ Sitemap generation failed:", err);
    process.exit(1);
  });

// Export for use in content-publisher
export { generateSitemap };
