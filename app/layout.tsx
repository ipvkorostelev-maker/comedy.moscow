import type { Metadata, Viewport } from 'next'
import { Oswald, Inter } from 'next/font/google'
import Script from 'next/script'
import './globals.css'
import Nav from '@/components/layout/Nav'
import Footer from '@/components/layout/Footer'
import ZoomLock from '@/components/ui/ZoomLock'
import { NavLabelProvider } from '@/components/ui/NavLabelProvider'
import { ConsentProvider } from '@/components/providers/ConsentProvider'
import { BASE } from '@/lib/utils'
import { getCities } from '@/lib/data'

// Запрет зума на мобильных (по требованию владельца сайта)
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

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

export const metadata: Metadata = {
  metadataBase: new URL(BASE),
  title: {
    default: 'Стендап концерты в Москве — comedy.moscow',
    template: '%s',
  },
  description: 'Афиша стендап концертов в Москве. Расписание, составы комиков, отзывы зрителей. Купить билеты онлайн — быстро и удобно.',
  robots: { index: true, follow: true },
  openGraph: {
    type: 'website',
    locale: 'ru_RU',
    siteName: 'Смешно',
    url: BASE,
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
      description: 'Платформа для поиска и покупки билетов на стендап-концерты',
      email: 'river-show@mail.ru',
      telephone: '+7 906 731 45 51',
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Москва',
        addressCountry: 'RU',
      },
      sameAs: [
        'https://vk.com/smeshno',
        'https://t.me/smeshno',
        'https://www.youtube.com/@smeshno',
      ],
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

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const cities = await getCities()
  return (
    <html lang="ru" className={`${oswald.variable} ${inter.variable}`}>
      <head>
        <meta name="theme-color" content="#0c0c10" />
        <link rel="preconnect" href="https://s3.intickets.ru" />
        <link rel="preconnect" href="https://images.unsplash.com" />
        <link rel="preconnect" href="https://womanstandup.ru" />
        <link rel="preconnect" href="https://static.tildacdn.com" />
        <link rel="alternate" type="application/rss+xml" title="Стендап концерты — comedy.moscow" href="/rss.xml" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32.png" />
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
        <script
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{
            __html: `
              window['disableYaCounter108210320'] = true;
              window['disableYaCounter94359734'] = true;
            `,
          }}
        />
        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
        />
      </head>
      <body>
        <ConsentProvider>
          <ZoomLock />
          <NavLabelProvider>
            <Nav cities={cities} />
            <main>{children}</main>
          </NavLabelProvider>
          <Footer />
          <Script
            id="yandex-dealer"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{ __html: `
              var dealerName = 'YandexTicketsDealer';
              var dealer = window[dealerName] = window[dealerName] || [];
              dealer.push(['setDefaultClientKey', 'ticketsteam-4063']);
              dealer.push(['setDefaultRegionId', 213]);
              (function() {
                var s = document.createElement('script');
                s.async = true;
                s.src = 'https://widget.afisha.yandex.ru/dealer/dealer.js';
                document.getElementsByTagName('script')[0].parentNode.insertBefore(s, document.getElementsByTagName('script')[0]);
              })();
            `}}
          />
        </ConsentProvider>
      </body>
    </html>
  )
}
