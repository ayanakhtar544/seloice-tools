import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    // Dynamic values from URL
    const title = searchParams.has('title')
      ? searchParams.get('title')?.slice(0, 80)
      : 'Seloice Tools | Creator OS';
    
    // Emotion/Hook badge
    const badge = searchParams.has('badge') ? searchParams.get('badge') : '100% Free Tool';

    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#050505',
            backgroundImage: 'radial-gradient(circle at 50% -20%, #4f46e533 0%, transparent 50%), radial-gradient(circle at 100% 100%, #db277733 0%, transparent 50%)',
            fontFamily: 'Inter, sans-serif',
            padding: '80px',
          }}
        >
          {/* Logo / Brand */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '40px',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                fontSize: '32px',
                fontWeight: '900',
                color: '#ffffff',
                letterSpacing: '-0.05em',
                textTransform: 'uppercase',
                fontStyle: 'italic',
              }}
            >
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/>
              </svg>
              SELOICE
            </div>
          </div>

          {/* Badge */}
          <div
            style={{
              display: 'flex',
              padding: '12px 24px',
              backgroundColor: 'rgba(99, 102, 241, 0.1)',
              border: '1px solid rgba(99, 102, 241, 0.3)',
              borderRadius: '100px',
              color: '#818cf8',
              fontSize: '20px',
              fontWeight: '900',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              marginBottom: '30px',
            }}
          >
            {badge}
          </div>

          {/* Main Title */}
          <div
            style={{
              display: 'flex',
              fontSize: '72px',
              fontWeight: '900',
              color: '#ffffff',
              textAlign: 'center',
              lineHeight: 1.1,
              letterSpacing: '-0.04em',
              textTransform: 'uppercase',
              fontStyle: 'italic',
              marginBottom: '40px',
              maxWidth: '900px',
            }}
          >
            {title}
          </div>

          {/* Footer / Star Rating Simulator */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              marginTop: 'auto',
            }}
          >
            <div style={{ display: 'flex', gap: '4px' }}>
              {[1, 2, 3, 4, 5].map((_, i) => (
                <svg key={i} width="24" height="24" viewBox="0 0 24 24" fill="#fbbf24" stroke="#fbbf24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                </svg>
              ))}
            </div>
            <div style={{ color: '#9ca3af', fontSize: '24px', fontWeight: 'bold' }}>
              4.9/5 Average Rating
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (e: any) {
    console.log(`${e.message}`);
    return new Response(`Failed to generate the image`, {
      status: 500,
    });
  }
}
