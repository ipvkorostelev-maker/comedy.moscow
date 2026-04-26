import { NextRequest } from 'next/server'

export async function GET(req: NextRequest) {
  const url = req.nextUrl.searchParams.get('url')
  if (!url) return Response.json({ error: 'Missing url' }, { status: 400 })

  try {
    const res = await fetch(url, {
      signal: AbortSignal.timeout(10_000),
    })
    if (!res.ok) return Response.json({ error: `Upstream ${res.status}` }, { status: 502 })

    const buffer = Buffer.from(await res.arrayBuffer())
    const ct = res.headers.get('content-type') || 'image/jpeg'

    return Response.json({
      dataUrl: `data:${ct};base64,${buffer.toString('base64')}`,
    })
  } catch {
    return Response.json({ error: 'Fetch failed' }, { status: 502 })
  }
}
