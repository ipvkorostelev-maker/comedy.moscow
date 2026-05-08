import { getAllArtists } from '@/lib/data'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const q = (searchParams.get('q') ?? '').toLowerCase().trim()
  const offset = parseInt(searchParams.get('offset') ?? '0', 10) || 0
  const limit = Math.min(parseInt(searchParams.get('limit') ?? '12', 10) || 12, 100)

  const all = await getAllArtists()

  const filtered = q
    ? all.filter((a) => a.name.toLowerCase().includes(q))
    : all

  const page = filtered.slice(offset, offset + limit)

  return Response.json(
    {
      artists: page,
      total: filtered.length,
      hasMore: offset + limit < filtered.length,
    },
    {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'public, max-age=300',
      },
    }
  )
}

export async function OPTIONS() {
  return new Response(null, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  })
}
