#!/usr/bin/env python3
"""
Generate content-specific article images for Pulse.
Pulls real photos from Pexels based on article topic,
then overlays brand elements (orange bar, category, The Pulse).

Usage:
  export PEXELS_API_KEY="your-key-here"
  python3 generate-images.py

Get a free Pexels API key at: https://www.pexels.com/api/
(Takes 1 minute — sign up, go to "Your API Key", copy it)
"""

import json
import os
import re
import time
import urllib.request
import urllib.parse
from PIL import Image, ImageDraw, ImageFont, ImageFilter
from io import BytesIO

W, H = 1200, 675

# Brand colors
ORANGE = (234, 120, 40)
CREAM = (250, 247, 240)
STONE_900 = (28, 25, 23)
STONE_400 = (168, 162, 158)

# Map each article to a search query that captures its essence visually
# We want HUMAN, REAL photos, not abstract concepts
ARTICLE_QUERIES = {
    # SMB Operations
    "autonomous-ai-agents-beyond-code-1772822090501": "software developer teamwork office",
    "ai-agents-smart-choices-for-your-business-1772659662864": "small business owner laptop planning",
    "anthropic-claude-challenges-ai-lock-in-1772627903922": "business strategy chess thinking",
    "copilot-expands-smb-access-practical-ai-1772587167672": "small business team collaboration desk",
    "free-claude-ai-courses-your-next-step-1772573256522": "online learning laptop coffee",
    "nullclaw-and-choosing-right-for-your-smb-1772530482460": "business decision crossroads path",
    "ai-agents-gain-memory-transform-smb-workflows-1772501036117": "office workflow automation documents",
    "sequoia-s-ai-ascent-what-it-means-1772444438289": "venture capital silicon valley skyline",
    "google-warns-against-thin-ai-vendors-1772444423748": "corporate meeting boardroom discussion",
    "ai-agents-transform-research-and-workflows-1772368323797": "research laboratory scientist modern",
    "ignore-ai-tsunami-hype-focus-operations-1772313295760": "calm focused businessman working",
    "ai-is-changing-white-collar-work-what-now-1772302962628": "modern office workers future work",
    "block-ai-layoffs-a-warning-for-smbs-1772291711997": "empty office chairs workforce",
    "saaspocalypse-is-noise-for-your-smb-1772045764046": "startup entrepreneur resilient working",
    "android-ai-enhances-secure-mobile-productivity-1772045749765": "business person smartphone security",
    "ai-agents-structure-your-knowledge-automate-workflows-1772016935122": "organized filing system knowledge management",
    "ai-agents-are-coming-prepare-your-business-1772016917210": "business preparation planning whiteboard",
    "google-gemini-1-5-pro-smb-impact-1772016901986": "google office technology innovation",
    "streamlining-ai-research-for-your-business-1772016885357": "business analyst data research laptop",
    "market-ai-panic-focus-on-your-real-business-1772016870402": "stock market chart investor",
    "google-opal-workflow-automation-for-smbs-1772016854488": "business process automation flowchart",
    "your-team-s-skills-are-your-new-ai-currency-1772016840372": "diverse team skills training workshop",
    "ai-agents-the-next-wave-of-business-change-1771797372659": "ocean wave sunrise business",
    "smbs-win-by-applying-not-building-ai-1771797387604": "practical hands-on business workshop",
    "making-llms-reliable-for-business-operations-1772455166296": "quality control precision engineering",

    # AI Governance
    "hallucinations-are-not-a-bug-1772760280436": "brain neuroscience research laboratory",
    "poland-portugal-market-1772699612590": "european parliament regulation",
    "ai-governance-updates-1771497040921": "government regulation policy documents",

    # EU AI Act
    "eu-ai-act-smb-1772785833366": "european commission brussels building",
    "eu-ai-act-smb-1772353420284": "eu parliament legislation",

    # Legal Tech
    "law-firm-ai-1772440621350": "law firm modern office legal books",
    "law-firm-ai-1772266888185": "lawyer reviewing documents technology",
    "law-firm-ai-1772008835578": "legal technology courtroom modern",
    "legal-tech-updates-1771322203597": "scales of justice technology",

    # Data Sovereignty
    "ai-vendor-trust-openai-s-pentagon-deal-1772737862429": "pentagon building washington government",

    # Enterprise AI
    "logistics-retail-ai-1772613120545": "warehouse logistics automation",
    "logistics-retail-ai-1772181281753": "retail store technology innovation",

    # Pharma AI
    "pharma-sme-ai-1772526808226": "pharmaceutical laboratory research",
    "pharma-sme-ai-1772095147461": "pharmacy medicine research",

    # AI Tools
    "ai-model-translation-1771932049292": "cloud computing server data center",
}


def download_pexels_photo(query: str, api_key: str, w=1200, h=675) -> bytes | None:
    """Download a landscape photo from Pexels API."""
    encoded_query = urllib.parse.quote(query)
    url = f"https://api.pexels.com/v1/search?query={encoded_query}&orientation=landscape&per_page=5&size=large"

    try:
        req = urllib.request.Request(url, headers={
            'Authorization': api_key,
            'User-Agent': 'PulseImageGenerator/1.0'
        })
        with urllib.request.urlopen(req, timeout=15) as response:
            data = json.loads(response.read().decode('utf-8'))

        photos = data.get('photos', [])
        if not photos:
            print(f"  No Pexels results for '{query}'")
            return None

        # Pick the first photo, get the landscape crop URL
        photo = photos[0]
        # Pexels provides various sizes; use 'landscape' or construct custom size
        img_url = photo['src'].get('landscape') or photo['src'].get('large')

        # Download the actual image
        req = urllib.request.Request(img_url, headers={
            'User-Agent': 'PulseImageGenerator/1.0'
        })
        with urllib.request.urlopen(req, timeout=20) as response:
            return response.read()

    except Exception as e:
        print(f"  Pexels download failed: {e}")
        return None


def download_picsum_photo(seed: str, w=1200, h=675) -> bytes | None:
    """Fallback: use Lorem Picsum with a seed for consistency."""
    url = f"https://picsum.photos/seed/{seed}/{w}/{h}"
    try:
        req = urllib.request.Request(url, headers={
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)'
        })
        with urllib.request.urlopen(req, timeout=15) as response:
            return response.read()
    except Exception as e:
        print(f"  Picsum fallback failed: {e}")
        return None


def apply_brand_overlay(img: Image.Image, category: str, date: str) -> Image.Image:
    """Apply The Pulse brand overlay to a photo."""
    # Ensure correct size
    img = img.resize((W, H), Image.LANCZOS)

    # Apply a slight warm tone
    draw = ImageDraw.Draw(img)

    # Semi-transparent dark gradient at bottom for text readability
    for y in range(H - 160, H):
        t = (y - (H - 160)) / 160
        alpha = int(200 * t * t)  # quadratic ease
        overlay = Image.new('RGBA', (W, 1), (20, 18, 16, alpha))
        img.paste(overlay, (0, y), overlay)

    # Semi-transparent dark gradient at top for category
    for y in range(0, 60):
        t = 1 - y / 60
        alpha = int(120 * t * t)
        overlay = Image.new('RGBA', (W, 1), (20, 18, 16, alpha))
        img.paste(overlay, (0, y), overlay)

    draw = ImageDraw.Draw(img)

    # Orange brand bar at very top
    draw.rectangle([0, 0, W, 4], fill=ORANGE)

    # Load fonts — try macOS paths first, then Linux
    font_paths = {
        'mono_bold': [
            "/System/Library/Fonts/SFMono-Bold.otf",
            "/System/Library/Fonts/Menlo.ttc",
            "/usr/share/fonts/truetype/dejavu/DejaVuSansMono-Bold.ttf",
        ],
        'sans_bold': [
            "/System/Library/Fonts/Supplemental/Arial Bold.ttf",
            "/System/Library/Fonts/Helvetica.ttc",
            "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf",
        ],
        'sans': [
            "/System/Library/Fonts/Supplemental/Arial.ttf",
            "/System/Library/Fonts/Helvetica.ttc",
            "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf",
        ],
        'mono': [
            "/System/Library/Fonts/SFMono-Regular.otf",
            "/System/Library/Fonts/Menlo.ttc",
            "/usr/share/fonts/truetype/dejavu/DejaVuSansMono.ttf",
        ],
    }

    def load_font(key, size):
        for path in font_paths.get(key, []):
            try:
                return ImageFont.truetype(path, size)
            except:
                continue
        return ImageFont.load_default()

    font_cat = load_font('mono_bold', 11)
    font_brand = load_font('sans_bold', 16)
    font_sub = load_font('sans', 12)
    font_date = load_font('mono', 11)

    # Category pill (top left, on the dark gradient)
    cat_text = category.upper()
    cat_bbox = draw.textbbox((0, 0), cat_text, font=font_cat)
    cat_w = cat_bbox[2] - cat_bbox[0]

    # Orange pill background
    pill_x = 32
    pill_y = 16
    pill_pad = 8
    draw.rounded_rectangle(
        [pill_x, pill_y, pill_x + cat_w + pill_pad * 2 + 14, pill_y + 22],
        radius=3, fill=ORANGE
    )
    draw.text((pill_x + pill_pad + 14, pill_y + 4), cat_text, fill=(255, 255, 255), font=font_cat)

    # Date (top right)
    date_bbox = draw.textbbox((0, 0), date, font=font_date)
    date_w = date_bbox[2] - date_bbox[0]
    draw.text((W - 32 - date_w, pill_y + 5), date, fill=(220, 220, 220), font=font_date)

    # Bottom branding bar
    brand_y = H - 44

    # "A" circle
    cx = 40
    cy = brand_y + 2
    draw.ellipse([cx - 12, cy - 12, cx + 12, cy + 12], fill=ORANGE)
    a_bbox = draw.textbbox((0, 0), "A", font=font_brand)
    a_w = a_bbox[2] - a_bbox[0]
    draw.text((cx - a_w // 2, cy - 9), "A", fill=(255, 255, 255), font=font_brand)

    # "The Pulse" text
    draw.text((cx + 20, brand_y - 8), "The Pulse", fill=(255, 255, 255), font=font_brand)
    draw.text((cx + 20, brand_y + 8), "Human + AI", fill=(200, 200, 200), font=font_sub)

    # URL right side
    url_text = "analog-ai.vercel.app"
    url_bbox = draw.textbbox((0, 0), url_text, font=font_date)
    url_w = url_bbox[2] - url_bbox[0]
    draw.text((W - 32 - url_w, brand_y), url_text, fill=(180, 180, 180), font=font_date)

    return img


def generate_fallback_image(slug: str, category: str, date: str, noise: str) -> Image.Image:
    """Generate a branded typographic fallback if photo download fails."""
    img = Image.new('RGB', (W, H), CREAM)
    draw = ImageDraw.Draw(img)

    font_paths_serif = [
        "/System/Library/Fonts/Supplemental/Georgia Bold.ttf",
        "/System/Library/Fonts/Supplemental/Times New Roman Bold.ttf",
        "/usr/share/fonts/truetype/dejavu/DejaVuSerif-Bold.ttf",
    ]

    def load_font_list(paths, size):
        for path in paths:
            try:
                return ImageFont.truetype(path, size)
            except:
                continue
        return ImageFont.load_default()

    font_title = load_font_list(font_paths_serif, 36)
    font_cat = load_font_list([
        "/System/Library/Fonts/SFMono-Regular.otf",
        "/usr/share/fonts/truetype/dejavu/DejaVuSansMono.ttf",
    ], 12)
    font_brand = load_font_list([
        "/System/Library/Fonts/Supplemental/Arial Bold.ttf",
        "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf",
    ], 14)
    font_sub = load_font_list([
        "/System/Library/Fonts/Supplemental/Arial.ttf",
        "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf",
    ], 12)
    font_date = load_font_list([
        "/System/Library/Fonts/SFMono-Regular.otf",
        "/usr/share/fonts/truetype/dejavu/DejaVuSansMono.ttf",
    ], 11)

    draw.rectangle([0, 0, W, 4], fill=ORANGE)
    draw.rectangle([0, 4, 5, H], fill=ORANGE)

    margin = 64
    draw.text((margin, 40), category.upper(), fill=ORANGE, font=font_cat)

    date_bbox = draw.textbbox((0, 0), date, font=font_date)
    draw.text((W - margin - (date_bbox[2] - date_bbox[0]), 42), date, fill=STONE_400, font=font_date)

    # Title
    first_dot = noise.find('. ')
    title = noise[:first_dot + 1] if 0 < first_dot < 120 else noise[:110].rstrip() + "…"
    words = title.split()
    lines, current = [], ""
    for word in words:
        test = f"{current} {word}".strip()
        bbox = draw.textbbox((0, 0), test, font=font_title)
        if bbox[2] - bbox[0] > W - margin * 2:
            if current: lines.append(current)
            current = word
        else:
            current = test
    if current: lines.append(current)

    y = 80
    for line in lines[:4]:
        draw.text((margin, y), line, fill=STONE_900, font=font_title)
        y += 46

    # Brand footer
    brand_y = H - 55
    draw.rectangle([margin, brand_y - 15, W - margin, brand_y - 14], fill=(230, 229, 228))
    draw.ellipse([margin, brand_y, margin + 24, brand_y + 24], fill=STONE_900)
    draw.text((margin + 5, brand_y + 3), "A", fill=CREAM, font=font_brand)
    draw.text((margin + 32, brand_y), "The Pulse", fill=STONE_900, font=font_brand)
    draw.text((margin + 32, brand_y + 16), "Human + AI signal intelligence", fill=STONE_400, font=font_sub)

    return img


def derive_query_from_item(item: dict) -> str:
    """Derive a Pexels search query from pulse item metadata when slug isn't in ARTICLE_QUERIES."""
    category = item.get('category', '')
    keywords = item.get('keywords', [])

    CATEGORY_VISUAL = {
        'SMB Operations': 'small business office professional',
        'Legal Technology': 'law firm lawyer office',
        'Legal Tech': 'law firm lawyer office',
        'EU AI Act': 'european parliament regulation',
        'AI Governance': 'government policy documents',
        'Enterprise AI': 'corporate technology office',
        'Pharma AI': 'pharmaceutical laboratory research',
        'Data Sovereignty': 'data center security',
        'AI Tools': 'technology laptop productivity',
    }
    base = CATEGORY_VISUAL.get(category, 'business technology professional')

    # Pick up to 2 short, visual keywords (skip generic/abstract ones)
    skip_words = {'ai', 'llm', 'gpt', 'api', 'saas', 'b2b'}
    visual_kws = [
        k for k in keywords[:6]
        if len(k.split()) <= 3 and k.lower() not in skip_words
    ][:2]

    if visual_kws:
        return f"{' '.join(visual_kws)} {base.split()[0]}"
    return base


def main():
    # Check for API key
    api_key = os.environ.get('PEXELS_API_KEY', '')
    if not api_key:
        print("⚠️  PEXELS_API_KEY not set — will use Picsum photo fallback for all items.")
        print("   Get a free key at https://www.pexels.com/api/ for topic-matched photos.")
        print()

    with open('public/manifest.json', 'r') as f:
        data = json.load(f)

    items = data.get('items', [])
    output_dir = 'public/images/pulse'
    os.makedirs(output_dir, exist_ok=True)

    success = 0
    fallback = 0

    for i, item in enumerate(items):
        slug = item['slug']
        category = item.get('category', 'SMB Operations')
        if category == "Legal Technology": category = "Legal Tech"
        noise = item.get('noise', '')
        date = item.get('date', '')
        output_path = os.path.join(output_dir, f"{slug}.jpg")

        # Skip items that already have a good image (>50KB = real photo, not fallback)
        if os.path.exists(output_path) and os.path.getsize(output_path) > 50_000:
            print(f"[{i+1}/{len(items)}] ✓ Skip {slug[:50]} (image exists)")
            continue

        # Use hardcoded query if available, otherwise derive from item metadata
        if slug in ARTICLE_QUERIES:
            query = ARTICLE_QUERIES[slug]
        else:
            query = derive_query_from_item(item)

        print(f"[{i+1}/{len(items)}] {slug[:50]}...")
        print(f"  Query: {query} {'(derived)' if slug not in ARTICLE_QUERIES else ''}")

        photo_data = download_pexels_photo(query, api_key)

        if photo_data and len(photo_data) > 5000:
            try:
                photo = Image.open(BytesIO(photo_data)).convert('RGB')
                branded = apply_brand_overlay(photo, category, date)
                branded.save(output_path, quality=88, optimize=True)
                success += 1
                print(f"  ✓ Pexels photo saved ({len(photo_data) // 1024}KB)")
            except Exception as e:
                print(f"  Photo parse error: {e}, using fallback")
                fb = generate_fallback_image(slug, category, date, noise)
                fb.save(output_path, quality=88, optimize=True)
                fallback += 1
        else:
            print(f"  No Pexels result, trying Picsum fallback...")
            photo_data = download_picsum_photo(slug[:20])
            if photo_data and len(photo_data) > 5000:
                try:
                    photo = Image.open(BytesIO(photo_data)).convert('RGB')
                    branded = apply_brand_overlay(photo, category, date)
                    branded.save(output_path, quality=88, optimize=True)
                    success += 1
                    print(f"  ✓ Picsum photo saved")
                except:
                    fb = generate_fallback_image(slug, category, date, noise)
                    fb.save(output_path, quality=88, optimize=True)
                    fallback += 1
            else:
                fb = generate_fallback_image(slug, category, date, noise)
                fb.save(output_path, quality=88, optimize=True)
                fallback += 1

        # Pexels rate limit: 200 req/hour = ~3.3 req/sec, but be nice
        time.sleep(1)

    print(f"\nDone! {success} Pexels photos + {fallback} fallbacks = {success + fallback} total")


if __name__ == '__main__':
    main()
