// api/og.tsx
// Vercel Edge Function — generates Open Graph images for Pulse articles.
// Usage: /api/og?title=...&category=...&date=...
//
// This gives rich social previews when articles are shared on LinkedIn, X, Facebook, etc.

import { ImageResponse } from '@vercel/og';

export const config = {
  runtime: 'edge',
};

const CATEGORY_COLORS: Record<string, { bg: string; text: string; accent: string }> = {
  'SMB Operations':  { bg: '#fffbeb', text: '#92400e', accent: '#f59e0b' },
  'AI Governance':   { bg: '#f0f9ff', text: '#075985', accent: '#0ea5e9' },
  'AI Tools':        { bg: '#ecfdf5', text: '#065f46', accent: '#10b981' },
  'Legal Tech':      { bg: '#f5f3ff', text: '#5b21b6', accent: '#8b5cf6' },
};

const DEFAULT_COLORS = { bg: '#fafaf9', text: '#44403c', accent: '#78716c' };

export default function handler(req: Request) {
  const { searchParams } = new URL(req.url);
  const title = searchParams.get('title') || 'The Pulse';
  const category = searchParams.get('category') || '';
  const date = searchParams.get('date') || '';

  const colors = CATEGORY_COLORS[category] || DEFAULT_COLORS;

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: '#fafaf9',
          fontFamily: 'Georgia, serif',
        }}
      >
        {/* Category accent bar */}
        <div style={{ width: '100%', height: '6px', backgroundColor: colors.accent, display: 'flex' }} />

        {/* Main content */}
        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            padding: '56px 64px 48px',
          }}
        >
          {/* Top: Category + date */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            {category && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  backgroundColor: colors.bg,
                  padding: '6px 14px',
                  borderRadius: '4px',
                }}
              >
                <div
                  style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    backgroundColor: colors.accent,
                  }}
                />
                <span
                  style={{
                    fontSize: '14px',
                    fontFamily: 'monospace',
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em',
                    color: colors.text,
                  }}
                >
                  {category}
                </span>
              </div>
            )}
            {date && (
              <span
                style={{
                  fontSize: '14px',
                  fontFamily: 'monospace',
                  color: '#a8a29e',
                }}
              >
                {date}
              </span>
            )}
          </div>

          {/* Middle: Title */}
          <div style={{ display: 'flex', flex: 1, alignItems: 'center', paddingTop: '24px', paddingBottom: '24px' }}>
            <h1
              style={{
                fontSize: title.length > 100 ? '36px' : title.length > 60 ? '42px' : '48px',
                fontWeight: 500,
                color: '#1c1917',
                lineHeight: 1.3,
                margin: 0,
                maxWidth: '1000px',
              }}
            >
              {title}
            </h1>
          </div>

          {/* Bottom: Branding */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  backgroundColor: '#1c1917',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fafaf9',
                  fontSize: '16px',
                  fontWeight: 700,
                  fontFamily: 'monospace',
                }}
              >
                A
              </div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '16px', fontWeight: 600, color: '#1c1917' }}>
                  The Pulse
                </span>
                <span style={{ fontSize: '12px', color: '#a8a29e', fontFamily: 'monospace' }}>
                  analog-ai.vercel.app
                </span>
              </div>
            </div>
            <span
              style={{
                fontSize: '12px',
                fontFamily: 'monospace',
                textTransform: 'uppercase',
                letterSpacing: '0.15em',
                color: '#a8a29e',
              }}
            >
              Signal intelligence for operators
            </span>
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
