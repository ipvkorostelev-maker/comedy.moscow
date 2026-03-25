import type { Metadata } from 'next'
import { Oswald, Inter } from 'next/font/google'
import './globals.css'
import Nav from '@/components/layout/Nav'
import Footer from '@/components/layout/Footer'
import CookieBanner from '@/components/ui/CookieBanner'

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
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32.png" />
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
        {/* Yandex.Metrika counter */}
        <script dangerouslySetInnerHTML={{ __html: `
          (function(m,e,t,r,i,k,a){
            m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
            m[i].l=1*new Date();
            for (var j = 0; j < document.scripts.length; j++) {if (document.scripts[j].src === r) { return; }}
            k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)
          })(window, document,'script','https://mc.yandex.ru/metrika/tag.js?id=108210320', 'ym');
          ym(108210320, 'init', {ssr:true, webvisor:true, clickmap:true, ecommerce:"dataLayer", referrer: document.referrer, url: location.href, accurateTrackBounce:true, trackLinks:true});
        `}} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
        />
        <script dangerouslySetInnerHTML={{ __html: `
          var dealerName = 'YandexTicketsDealer';
          var dealer = window[dealerName] = window[dealerName] || [];
          dealer.push(['setDefaultClientKey', 'ticketsteam-4063']);
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
        <noscript><div><img src="https://mc.yandex.ru/watch/108210320" style={{position:'absolute', left:'-9999px'}} alt="" /></div></noscript>
        <Nav />
        <main>{children}</main>
        <Footer />
        <CookieBanner />
      </body>
    </html>
  )
}
