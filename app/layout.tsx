import type { Metadata } from 'next'
import { Oswald, Inter } from 'next/font/google'
import './globals.css'
import Nav from '@/components/layout/Nav'
import Footer from '@/components/layout/Footer'

const oswald = Oswald({
  subsets: ['cyrillic', 'latin'],
  variable: '--font-oswald',
  weight: ['500', '600', '700'],
})

const inter = Inter({
  subsets: ['cyrillic', 'latin'],
  variable: '--font-inter',
  weight: ['300', '400', '500', '600', '700'],
})

const BASE = 'https://comedy.moscow'

export const metadata: Metadata = {
  metadataBase: new URL(BASE),
  title: {
    default: 'Стендап концерты в Москве — comedy.moscow',
    template: '%s | Смешно',
  },
  description: 'Афиша стендап концертов в Москве. Расписание, составы комиков, отзывы зрителей. Купить билеты онлайн — быстро и удобно.',
  robots: { index: true, follow: true },
  openGraph: {
    type: 'website',
    locale: 'ru_RU',
    siteName: 'Смешно',
    url: BASE,
    images: [{ url: '/og-default.jpg', width: 1200, height: 630, alt: 'Смешно — стендап-концерты' }],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@smeshno_moscow',
  },
}

const orgSchema = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': `${BASE}/#organization`,
      name: 'Смешно',
      url: BASE,
      logo: { '@type': 'ImageObject', url: `${BASE}/logo.png` },
      description: 'Платформа для поиска и покупки билетов на стендап-концерты в России',
      sameAs: ['https://vk.com/smeshno', 'https://t.me/smeshno'],
    },
    {
      '@type': 'WebSite',
      '@id': `${BASE}/#website`,
      url: BASE,
      name: 'Смешно',
      description: 'Стендап-концерты в Москве и Санкт-Петербурге',
      publisher: { '@id': `${BASE}/#organization` },
      potentialAction: {
        '@type': 'SearchAction',
        target: { '@type': 'EntryPoint', urlTemplate: `${BASE}/events?q={search_term_string}` },
        'query-input': 'required name=search_term_string',
      },
    },
  ],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" className={`${oswald.variable} ${inter.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
        />
        <script dangerouslySetInnerHTML={{ __html: `
          var dealerName = 'YandexTicketsDealer';
          var dealer = window[dealerName] = window[dealerName] || [];
          dealer.push(['setDefaultClientKey', '00701a9a-2a94-47d9-8f02-75e7bcbdbb4b']);
          dealer.push(['setDefaultRegionId', 213]);
          (function() {
            var s = document.createElement('script');
            s.async = true;
            s.src = 'https://widget.afisha.yandex.ru/dealer/dealer.js?' + Date.now();
            document.getElementsByTagName('script')[0].parentNode.insertBefore(s, document.getElementsByTagName('script')[0]);
          })();
        `}} />
      </head>
      <body>
        <Nav />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  )
}
