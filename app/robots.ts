import type { MetadataRoute } from 'next'
import { BASE } from '@/lib/utils'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/'],
      },
      {
        userAgent: ['GPTBot', 'OAI-SearchBot', 'ClaudeBot', 'PerplexityBot'],
        allow: '/',
        disallow: ['/api/'],
      },
      {
        userAgent: ['CCBot', 'anthropic-ai', 'cohere-ai'],
        disallow: '/',
      },
    ],
    sitemap: `${BASE}/sitemap.xml`,
  }
}
