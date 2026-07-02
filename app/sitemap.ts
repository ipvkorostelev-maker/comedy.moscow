import type { MetadataRoute } from 'next'
import { getAllEvents, getAllArtists, getCities } from '@/lib/data'
import { getEnrichedTours } from '@/lib/womanstandup'
import { BASE } from '@/lib/utils'

const BUILD_DATE = new Date("2026-05-23")

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [events, artists, tours, cities] = await Promise.all([
    getAllEvents(),
    getAllArtists(),
    getEnrichedTours(),
    getCities(),
  ])

  return [
    {
      url: BASE,
      lastModified: BUILD_DATE,
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${BASE}/events`,
      lastModified: BUILD_DATE,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${BASE}/artists`,
      lastModified: BUILD_DATE,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${BASE}/corporate`,
      lastModified: BUILD_DATE,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${BASE}/contacts`,
      lastModified: BUILD_DATE,
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    ...events.map((e) => ({
      url: `${BASE}/events/${e.slug}`,
      lastModified: new Date(e.date),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    })),
    ...artists.map((a) => ({
      url: `${BASE}/artists/${a.slug}`,
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    })),
    ...cities
      .filter((c) => c.slug !== 'moskva')
      .map((c) => ({
        url: `${BASE}/city/${c.slug}`,
        lastModified: BUILD_DATE,
        changeFrequency: 'daily' as const,
        priority: 0.7,
      })),
    ...tours.map((t) => ({
      url: `${BASE}/tour/${t.slug}`,
      lastModified: BUILD_DATE,
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    })),
  ]
}
