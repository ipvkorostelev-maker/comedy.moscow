import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'comedy.moscow — стендап в Москве'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #0c0c10 0%, #1c0a06 55%, #2e1108 100%)',
          position: 'relative',
        }}
      >
        {/* Top accent line */}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 5, background: '#E8432A', display: 'flex' }} />

        {/* Orange glow blob */}
        <div
          style={{
            position: 'absolute',
            bottom: -80,
            right: -80,
            width: 500,
            height: 500,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(232,67,42,0.18) 0%, transparent 70%)',
            display: 'flex',
          }}
        />
        <div
          style={{
            position: 'absolute',
            top: -60,
            left: -60,
            width: 350,
            height: 350,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(232,67,42,0.10) 0%, transparent 70%)',
            display: 'flex',
          }}
        />

        {/* Content */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }}>
          {/* Brand label */}
          <div
            style={{
              color: '#E8432A',
              fontSize: 18,
              fontWeight: 600,
              letterSpacing: 10,
              textTransform: 'uppercase',
              marginBottom: 28,
              display: 'flex',
            }}
          >
            COMEDY.MOSCOW
          </div>

          {/* Main headline */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              color: '#F0EDE8',
              fontSize: 100,
              fontWeight: 700,
              lineHeight: 1.0,
              letterSpacing: 6,
            }}
          >
            <span style={{ display: 'flex' }}>STANDUP</span>
            <span style={{ display: 'flex' }}>MOSCOW</span>
          </div>

          {/* Divider */}
          <div
            style={{
              width: 56,
              height: 3,
              background: '#E8432A',
              marginTop: 32,
              marginBottom: 24,
              display: 'flex',
            }}
          />

          {/* Tagline */}
          <div
            style={{
              color: 'rgba(240,237,232,0.4)',
              fontSize: 18,
              letterSpacing: 6,
              display: 'flex',
            }}
          >
            COMEDY SHOWS · TICKETS ONLINE
          </div>
        </div>

        {/* Bottom accent */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: 2,
            background: 'linear-gradient(to right, #E8432A, transparent)',
            display: 'flex',
          }}
        />
      </div>
    ),
    { ...size },
  )
}
