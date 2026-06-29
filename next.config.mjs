/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    loader: 'custom',
    loaderFile: './lib/imageLoader.ts',
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'womanstandup.ru' },
      { protocol: 'https', hostname: 'static.tildacdn.com' },
    ],
    deviceSizes: [640, 828, 1080, 1200, 1600, 1920, 2400, 3840],
    imageSizes: [64, 128, 256, 384, 512],
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 86400,
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
          { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
          { key: 'Cross-Origin-Opener-Policy', value: 'same-origin' },
          { key: 'Content-Security-Policy', value: "default-src 'self'; script-src 'self' 'unsafe-inline' https://top-fwz1.mail.ru https://mc.yandex.ru https://widget.afisha.yandex.ru https://s3.intickets.ru; style-src 'self' 'unsafe-inline' https://s3.intickets.ru; img-src 'self' data: https:; connect-src 'self' https://mc.yandex.ru https://top-fwz1.mail.ru; frame-src https://widget.afisha.yandex.ru" },
        ],
      },
      {
        source: '/_next/static/(.*)',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
      {
        source: '/((?!api|feed.xml|rss.xml|_next).*)',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=300, stale-while-revalidate=60, stale-if-error=86400' },
        ],
      },
    ]
  },
}

export default nextConfig
