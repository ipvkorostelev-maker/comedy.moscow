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
      {
        userAgent: ['GPTBot', 'OAI-SearchBot', 'ClaudeBot', 'PerplexityBot'],
        allow: '/',
      },
      {
        userAgent: ['CCBot', 'anthropic-ai', 'cohere-ai'],
        disallow: '/',
      },
    ],
    sitemap: `${BASE}/sitemap.xml`,
  }
}
