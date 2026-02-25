/**
 * Content Publisher - Phase 2
 * Generates manifest.json from all Pulse items in public/blog/
 */

import { promises as fs } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

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

interface Manifest {
  generated: string;
  totalItems: number;
  items: PulseItem[];
}

async function getAllPulseItems(): Promise<PulseItem[]> {
  const blogDir = join(__dirname, '../public/blog');

  try {
    const files = await fs.readdir(blogDir);
    const jsonFiles = files.filter(f => f.endsWith('.json'));

    const items: PulseItem[] = [];

    for (const file of jsonFiles) {
      const content = await fs.readFile(join(blogDir, file), 'utf-8');
      const item = JSON.parse(content) as PulseItem;
      items.push(item);
    }

    // Sort by ISO date descending (newest first), fall back to display date
    items.sort((a, b) => {
      const da = (a as any).isoDate ?? a.date;
      const db = (b as any).isoDate ?? b.date;
      return new Date(db).getTime() - new Date(da).getTime();
    });

    return items;
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      console.log('📁 Blog directory not found. No items to publish yet.');
      return [];
    }
    throw error;
  }
}

async function generateManifest(): Promise<void> {
  console.log('📦 Generating manifest.json...');

  const items = await getAllPulseItems();

  const manifest: Manifest = {
    generated: new Date().toISOString(),
    totalItems: items.length,
    items: items
  };

  const publicDir = join(__dirname, '../public');
  const manifestPath = join(publicDir, 'manifest.json');

  await fs.writeFile(
    manifestPath,
    JSON.stringify(manifest, null, 2),
    'utf-8'
  );

  console.log(`✅ Manifest generated with ${items.length} items`);
  console.log(`📍 Location: ${manifestPath}`);

  // Print summary
  if (items.length > 0) {
    console.log('\n📋 Published items:');
    items.forEach((item, idx) => {
      console.log(`   ${idx + 1}. [${item.category}] ${item.noise.substring(0, 50)}...`);
    });
  }
}

// Run publisher
generateManifest()
  .then(() => {
    console.log('\n🎉 Publishing complete!');
  })
  .catch(error => {
    console.error('❌ Publishing failed:', error);
    process.exit(1);
  });
