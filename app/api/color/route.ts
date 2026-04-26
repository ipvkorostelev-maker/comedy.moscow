import { NextRequest } from 'next/server'
import sharp from 'sharp'

export async function GET(req: NextRequest) {
  const url = req.nextUrl.searchParams.get('url')
  if (!url) return Response.json({ error: 'Missing url' }, { status: 400 })

  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(8000) })
    if (!res.ok) return Response.json({ error: `Upstream ${res.status}` }, { status: 502 })

    const buf = Buffer.from(await res.arrayBuffer())

    const { data, info } = await sharp(buf)
      .resize(50, 50, { fit: 'inside' })
      .ensureAlpha()
      .raw()
      .toBuffer({ resolveWithObject: true })

    let r = 0, g = 0, b = 0, count = 0
    const channels = info.channels
    for (let i = 0; i < data.length; i += channels) {
      const a = channels >= 4 ? data[i + 3] : 255
      if (a < 128) continue // skip transparent pixels
      r += data[i]
      g += data[i + 1]
      b += data[i + 2]
      count++
    }

    if (count === 0) return Response.json({ error: 'No opaque pixels' }, { status: 422 })

    r = Math.round(r / count)
    g = Math.round(g / count)
    b = Math.round(b / count)

    // Boost dark colors so glow is visible on black background
    const luma = 0.299 * r + 0.587 * g + 0.114 * b
    if (luma < 60) {
      const boost = 60 - luma
      r = Math.min(255, r + boost)
      g = Math.min(255, g + boost)
      b = Math.min(255, b + boost)
    }

    return Response.json(
      { rgb: `${r}, ${g}, ${b}` },
      { headers: { 'Cache-Control': 'public, max-age=3600' } },
    )
  } catch {
    return Response.json({ error: 'Failed' }, { status: 502 })
  }
}
