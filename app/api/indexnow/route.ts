import { BASE } from '@/lib/utils'

const KEY = '5a7b9c3d8e1f4a6b2c0d9e7f3a5b1c8d'
const ENDPOINTS = [
  'https://api.indexnow.org/IndexNow',
  'https://yandex.com/indexnow',
]

async function submit(urls: string[]) {
  const body = JSON.stringify({
    host: new URL(BASE).host,
    key: KEY,
    keyLocation: `${BASE}/indexnow-key.txt`,
    urlList: urls,
  })

  await Promise.allSettled(
    ENDPOINTS.map((endpoint) =>
      fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body,
      })
    )
  )
}

export async function POST(req: Request) {
  try {
    const { urls } = await req.json()
    if (!Array.isArray(urls) || urls.length === 0) {
      return Response.json({ error: 'Missing urls array' }, { status: 400 })
    }

    // IndexNow limit: max 10,000 URLs per call
    const batch = urls.slice(0, 10_000)
    await submit(batch)

    return Response.json({ ok: true, count: batch.length })
  } catch {
    return Response.json({ error: 'Failed' }, { status: 500 })
  }
}

export async function GET() {
  return Response.json({
    key: KEY,
    keyLocation: `${BASE}/indexnow-key.txt`,
    endpoints: ENDPOINTS,
  })
}
