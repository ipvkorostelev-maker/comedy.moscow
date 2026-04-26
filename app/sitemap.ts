import type { MetadataRoute } from 'next'
import { getAllEvents, getAllArtists } from '@/lib/data'
import { BASE } from '@/lib/utils'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [events, artists] = await Promise.all([getAllEvents(), getAllArtists()])

  return [
    {
      url: BASE,
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${BASE}/events`,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${BASE}/artists`,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${BASE}/contacts`,
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    ...events.map((e) => ({
      url: `${BASE}/events/${e.slug}`,
      lastModified: new Date(e.date),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    })),
    ...artists.map((a) => ({
      url: `${BASE}/artists/${a.slug}`,
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    })),
  ]
}
