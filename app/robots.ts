import type { MetadataRoute } from 'next'
import { BASE } from '@/lib/utils'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/offer', '/privacy'],
      },
    ],
    sitemap: `${BASE}/sitemap.xml`,
  }
}
