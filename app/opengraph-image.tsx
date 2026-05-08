import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'Стендап концерты в Москве — comedy.moscow'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          background: '#0c0c10',
          position: 'relative',
        }}
      >
        {/* Concert background */}
        <img
          src="https://static.tildacdn.com/tild3136-6237-4633-b864-616637343930/IMG_6850.PNG"
          style={{ position: 'absolute', width: '100%', height: '100%', objectFit: 'cover', opacity: 0.45 }}
        />
        {/* Dark overlay */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            background: 'linear-gradient(135deg, rgba(0,0,0,0.82) 0%, rgba(0,0,0,0.52) 100%)',
          }}
        />
        {/* Content */}
        <div
          style={{
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
          }}
        >
          {/* Brand label */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              marginBottom: 30,
            }}
          >
            <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#E8432A' }} />
            <div
              style={{
                color: '#E8432A',
                fontSize: 18,
                letterSpacing: 8,
                fontWeight: 600,
              }}
            >
              COMEDY.MOSCOW
            </div>
            <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#E8432A' }} />
          </div>

          {/* Main headline */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              color: '#F0EDE8',
              fontSize: 96,
              fontWeight: 700,
              lineHeight: 1.0,
              letterSpacing: 4,
            }}
          >
            <span>STANDUP</span>
            <span>MOSCOW</span>
          </div>

          {/* Tagline */}
          <div
            style={{
              color: 'rgba(240,237,232,0.45)',
              fontSize: 20,
              marginTop: 28,
              letterSpacing: 5,
              display: 'flex',
            }}
          >
            COMEDY SHOWS · TICKETS ONLINE
          </div>
        </div>
      </div>
    ),
    { ...size },
  )
}
