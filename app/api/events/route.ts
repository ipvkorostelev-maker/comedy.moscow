import { getAllEvents } from '@/lib/data'
import { minEventPrice } from '@/lib/utils'

const BASE = 'https://comedy.moscow'

export async function GET() {
  const events = await getAllEvents()

  const data = events.map((e) => ({
    id: e.id,
    title: e.title,
    subtitle: e.subtitle ?? null,
    slug: e.slug,
    url: `${BASE}/events/${e.slug}`,
    image: e.image,
    date: e.date,
    time: e.time,
    venueName: e.venueName ?? null,
    city: e.city ?? null,
    price: minEventPrice(e),
    tags: e.tags ?? [],
    ageRestriction: e.ageRestriction ?? null,
    duration: e.duration ?? null,
  }))

  return Response.json(data, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Cache-Control': 'public, max-age=3600',
    },
  })
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
