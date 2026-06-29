import { NextRequest, NextResponse } from 'next/server'
import sharp from 'sharp'

const ALLOWED_HOSTS = ['womanstandup.ru', 'static.tildacdn.com', 'images.unsplash.com']

function isAllowed(url: string): boolean {
  try {
    const host = new URL(url).hostname
    return ALLOWED_HOSTS.some((h) => host === h || host.endsWith(`.${h}`))
  } catch {
    return false
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl
  const url = searchParams.get('url')
  const w = parseInt(searchParams.get('w') || '0', 10)
  const q = parseInt(searchParams.get('q') || '85', 10)

  if (!url || !w || w < 1 || w > 3840) {
    return new NextResponse('Invalid params', { status: 400 })
  }

  if (!isAllowed(url)) {
    return new NextResponse('Not allowed', { status: 403 })
  }

  try {
    const response = await fetch(url, { signal: AbortSignal.timeout(8000) })
    if (!response.ok) {
      return new NextResponse('Fetch failed', { status: 502 })
    }

    const contentType = response.headers.get('content-type') || 'image/jpeg'
    const buffer = Buffer.from(await response.arrayBuffer())

    const resized = await sharp(buffer)
      .resize({ width: w, withoutEnlargement: true })
      .jpeg({ quality: q, mozjpeg: true })
      .toBuffer()

    return new NextResponse(resized, {
      headers: {
        'Content-Type': 'image/jpeg',
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    })
  } catch {
    return new NextResponse('Error', { status: 500 })
  }
}
