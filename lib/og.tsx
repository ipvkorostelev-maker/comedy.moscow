import { readFile } from 'fs/promises'
import type { ReactNode } from 'react'

export const OG_SIZE = { width: 1200, height: 630 }
export const OG_CONTENT_TYPE = 'image/png'

export interface OgFont {
  name: string
  data: ArrayBuffer
  weight: 400 | 700
  style: 'normal'
}

const GOOGLE_FONTS_CSS =
  'https://fonts.googleapis.com/css2?family=Inter:wght@400;700&display=swap'

const LOCAL_FONT_PATHS: { weight: 400 | 700; paths: string[] }[] = [
  {
    weight: 400,
    paths: [
      '/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf',
      '/usr/share/fonts/truetype/liberation/LiberationSans-Regular.ttf',
      '/System/Library/Fonts/Supplemental/Arial.ttf',
    ],
  },
  {
    weight: 700,
    paths: [
      '/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf',
      '/usr/share/fonts/truetype/liberation/LiberationSans-Bold.ttf',
      '/System/Library/Fonts/Supplemental/Arial Bold.ttf',
    ],
  },
]

async function fetchWithTimeout(
  url: string,
  timeoutMs = 2000,
  init?: RequestInit,
): Promise<Response | undefined> {
  try {
    const controller = new AbortController()
    const t = setTimeout(() => controller.abort(), timeoutMs)
    const res = await fetch(url, { ...init, signal: controller.signal })
    clearTimeout(t)
    return res
  } catch {
    return undefined
  }
}

async function loadGoogleFonts(): Promise<OgFont[]> {
  // No custom User-Agent: Google Fonts returns TrueType (ttf) for node/undici UAs.
  const cssRes = await fetchWithTimeout(GOOGLE_FONTS_CSS, 3000)
  if (!cssRes) return []
  const css = await cssRes.text()
  const fonts: OgFont[] = []
  const blockRe = /@font-face\s*{([^}]+)}/g
  let blockMatch: RegExpExecArray | null
  while ((blockMatch = blockRe.exec(css)) !== null) {
    const block = blockMatch[1]
    // Only TrueType fonts are supported by Satori; skip woff/woff2 entries.
    if (!block.includes("format('truetype')")) continue
    const weightMatch = block.match(/font-weight:\s*(\d+)/)
    const urlMatch = block.match(/src:\s*url\(([^)]+)\)/)
    if (!weightMatch || !urlMatch) continue
    const weight = parseInt(weightMatch[1], 10)
    const url = urlMatch[1].replace(/['"]/g, '').trim()
    const fontRes = await fetchWithTimeout(url, 5000)
    if (!fontRes) continue
    const data = await fontRes.arrayBuffer()
    fonts.push({ name: 'Inter', data, weight: weight as OgFont['weight'], style: 'normal' })
  }
  return fonts
}

async function loadLocalFonts(): Promise<OgFont[]> {
  const fonts: OgFont[] = []
  for (const { weight, paths } of LOCAL_FONT_PATHS) {
    for (const p of paths) {
      try {
        const buf = await readFile(p)
        const data = buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength)
        fonts.push({ name: 'Inter', data, weight, style: 'normal' })
        break
      } catch {
        // try next path
      }
    }
  }
  return fonts
}

let cachedFontsPromise: Promise<OgFont[]> | null = null

export async function loadFonts(): Promise<OgFont[]> {
  if (!cachedFontsPromise) {
    cachedFontsPromise = (async () => {
      const google = await loadGoogleFonts()
      if (google.length >= 2) return google
      const local = await loadLocalFonts()
      if (local.length > 0) return local
      return []
    })()
  }
  const fonts = await cachedFontsPromise
  if (fonts.length === 0) cachedFontsPromise = null
  return fonts
}

export async function fetchImageBase64(
  url: string,
  timeoutMs = 2000,
): Promise<string | undefined> {
  if (!url) return undefined
  try {
    const res = await fetchWithTimeout(url, timeoutMs)
    if (!res || !res.ok) return undefined
    const contentType = res.headers.get('content-type') || 'image/jpeg'
    const buf = Buffer.from(await res.arrayBuffer())
    return `data:${contentType};base64,${buf.toString('base64')}`
  } catch {
    return undefined
  }
}

export function OgContainer({
  children,
  backgroundImage,
}: {
  children: ReactNode
  backgroundImage?: string
}) {
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        background: 'linear-gradient(135deg, #0c0c10 0%, #1c0a06 55%, #2e1108 100%)',
        fontFamily: "'Inter', sans-serif",
      }}
    >
      {backgroundImage && (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            alt=""
            src={backgroundImage}
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
          />
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background:
                'linear-gradient(to bottom, rgba(12,12,16,0.55) 0%, rgba(12,12,16,0.75) 55%, rgba(12,12,16,0.96) 100%)',
            }}
          />
        </>
      )}

      {/* Top accent */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: 5,
          background: '#E8432A',
          display: 'flex',
          zIndex: 1,
        }}
      />

      {/* Brand */}
      <div
        style={{
          position: 'absolute',
          top: 28,
          left: 0,
          right: 0,
          display: 'flex',
          justifyContent: 'center',
          zIndex: 1,
        }}
      >
        <div
          style={{
            color: '#E8432A',
            fontSize: 16,
            fontWeight: 700,
            letterSpacing: 8,
            textTransform: 'uppercase',
          }}
        >
          COMEDY.MOSCOW
        </div>
      </div>

      {/* Content */}
      <div
        style={{
          position: 'relative',
          zIndex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          height: '100%',
          padding: '64px 80px 80px',
          boxSizing: 'border-box',
        }}
      >
        {children}
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
          zIndex: 1,
        }}
      />
    </div>
  )
}

function truncateText(text: string, max = 80): string {
  if (text.length <= max) return text
  return text.slice(0, max - 1).trim() + '…'
}

export function OgTitle({ children }: { children: string }) {
  const text = truncateText(children, 80)
  const fontSize = text.length > 42 ? 56 : text.length > 28 ? 64 : 72
  return (
    <div
      style={{
        color: '#F0EDE8',
        fontSize,
        fontWeight: 700,
        lineHeight: 1.05,
        textAlign: 'center',
        maxWidth: 1040,
      }}
    >
      {text}
    </div>
  )
}

export function OgSubtitle({ children }: { children: string }) {
  return (
    <div
      style={{
        color: 'rgba(240,237,232,0.72)',
        fontSize: 26,
        fontWeight: 400,
        textAlign: 'center',
        marginTop: 20,
        maxWidth: 900,
        lineHeight: 1.3,
      }}
    >
      {children}
    </div>
  )
}

export function OgPill({ children }: { children: string }) {
  return (
    <div
      style={{
        marginTop: 28,
        padding: '10px 22px',
        borderRadius: 999,
        border: '1px solid rgba(240,237,232,0.25)',
        background: 'rgba(12,12,16,0.45)',
        color: '#F0EDE8',
        fontSize: 18,
        fontWeight: 600,
        letterSpacing: 1,
      }}
    >
      {children}
    </div>
  )
}
