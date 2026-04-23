const SVG_FALLBACK =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="800" viewBox="0 0 1200 800">
      <defs>
        <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#0b1234"/>
          <stop offset="100%" stop-color="#07091a"/>
        </linearGradient>
      </defs>
      <rect width="1200" height="800" fill="url(#g)"/>
      <circle cx="930" cy="140" r="210" fill="rgba(245,166,35,0.18)"/>
      <circle cx="220" cy="620" r="240" fill="rgba(245,166,35,0.1)"/>
      <text x="600" y="380" text-anchor="middle" font-family="Arial, sans-serif" font-size="54" fill="#f5a623" font-weight="700">UniMate</text>
      <text x="600" y="440" text-anchor="middle" font-family="Arial, sans-serif" font-size="30" fill="rgba(255,255,255,0.72)">Campus Lost &amp; Found</text>
    </svg>`
  );

const CATEGORY_IMAGE_MAP = {
  Electronics: 'https://images.unsplash.com/photo-1525182008055-f88b95ff7980?w=1400&q=80&auto=format&fit=crop',
  'Wallets & ID': 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1400&q=80&auto=format&fit=crop',
  'Books & Notes': 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=1400&q=80&auto=format&fit=crop',
  Clothing: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=1400&q=80&auto=format&fit=crop',
  Keys: 'https://images.unsplash.com/photo-1565849904461-04a58ad377e0?w=1400&q=80&auto=format&fit=crop',
  'Bags & Backpacks': 'https://images.unsplash.com/photo-1581605405669-fcdf81165afa?w=1400&q=80&auto=format&fit=crop',
  Accessories: 'https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?w=1400&q=80&auto=format&fit=crop',
  Books: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=1400&q=80&auto=format&fit=crop',
  Documents: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=1400&q=80&auto=format&fit=crop',
  Other: 'https://images.unsplash.com/photo-1497032205916-ac775f0649ae?w=1400&q=80&auto=format&fit=crop',
};

const TYPE_IMAGE_MAP = {
  lost: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=1400&q=80&auto=format&fit=crop',
  found: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=1400&q=80&auto=format&fit=crop',
  avatar: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&q=80&auto=format&fit=crop',
};

export function getImageFallbacks({ category, type, title } = {}) {
  const candidates = [];

  if (category && CATEGORY_IMAGE_MAP[category]) {
    candidates.push(CATEGORY_IMAGE_MAP[category]);
  }

  if (type && TYPE_IMAGE_MAP[String(type).toLowerCase()]) {
    candidates.push(TYPE_IMAGE_MAP[String(type).toLowerCase()]);
  }

  if (title) {
    const normalized = String(title).toLowerCase();
    if (normalized.includes('book') || normalized.includes('notebook') || normalized.includes('notes')) {
      candidates.push(CATEGORY_IMAGE_MAP['Books & Notes']);
    }
    if (normalized.includes('headphone') || normalized.includes('airpod') || normalized.includes('laptop') || normalized.includes('phone')) {
      candidates.push(CATEGORY_IMAGE_MAP.Electronics);
    }
  }

  candidates.push('https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=1400&q=80&auto=format&fit=crop');
  candidates.push(SVG_FALLBACK);

  return [...new Set(candidates)];
}
