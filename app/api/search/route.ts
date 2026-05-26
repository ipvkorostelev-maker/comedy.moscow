import { getAllEvents } from '@/lib/data'

interface SearchResult {
  slug: string
  title: string
  image: string
  date: string
  time: string
  venueName?: string
  city: string
  artistNames: string[]
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const q = (searchParams.get('q') ?? '').toLowerCase().trim()

  if (q.length < 2) {
    return Response.json([], {
      headers: { 'Cache-Control': 'public, max-age=60' },
    })
  }

  const events = await getAllEvents()

  const results: SearchResult[] = events
    .filter((e) => {
      return (
        e.title.toLowerCase().includes(q) ||
        (e.artistNames ?? []).some((n) => n.toLowerCase().includes(q)) ||
        (e.venueName ?? '').toLowerCase().includes(q) ||
        e.city.toLowerCase().includes(q)
      )
    })
    .slice(0, 8)
    .map((e) => ({
      slug: e.slug,
      title: e.title,
      image: e.image,
      date: e.date,
      time: e.time,
      venueName: e.venueName,
      city: e.city,
      artistNames: e.artistNames ?? [],
    }))

  return Response.json(results, {
    headers: { 'Cache-Control': 'public, max-age=60' },
  })
}
