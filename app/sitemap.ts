import type { MetadataRoute } from 'next'
import { getAllEvents, getAllArtists } from '@/lib/data'

const BASE = 'https://comedy.moscow'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [events, artists] = await Promise.all([getAllEvents(), getAllArtists()])

  return [
    {
      url: BASE,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${BASE}/events`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${BASE}/artists`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    ...events.map((e) => ({
      url: `${BASE}/events/${e.slug}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    })),
    ...artists.map((a) => ({
      url: `${BASE}/artists/${a.slug}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    })),
  ]
}
