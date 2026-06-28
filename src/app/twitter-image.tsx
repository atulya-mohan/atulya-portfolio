import { ImageResponse } from 'next/og';

export const runtime = 'nodejs';
export const alt = 'Atulya Mohan — Mechanical Engineer & Product Developer';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function TwitterImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '72px 80px',
          background: '#0f0f0f',
          color: '#F0F2E6',
          fontFamily: 'system-ui, sans-serif',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
          }}
        >
          <div style={{ display: 'flex', width: '64px', height: '4px', background: '#FF4F00' }} />
          <div style={{ display: 'flex', fontSize: '18px', letterSpacing: '0.25em', textTransform: 'uppercase' as const, color: 'rgba(240,242,230,0.5)' }}>
            Portfolio
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div style={{ display: 'flex', fontSize: '96px', fontWeight: 700, lineHeight: 0.9, letterSpacing: '-0.02em', textTransform: 'uppercase' as const }}>
            Atulya Mohan
          </div>
          <div style={{ display: 'flex', width: '48px', height: '3px', background: '#FF4F00' }} />
          <div style={{ display: 'flex', fontSize: '22px', letterSpacing: '0.15em', textTransform: 'uppercase' as const, color: 'rgba(240,242,230,0.6)' }}>
            Mechanical Engineer · Product Developer · CMU ETIM
          </div>
        </div>

        <div style={{ display: 'flex', fontSize: '16px', letterSpacing: '0.2em', textTransform: 'uppercase' as const, color: 'rgba(240,242,230,0.35)' }}>
          atulya-portfolio.vercel.app
        </div>
      </div>
    ),
    { ...size }
  );
}
