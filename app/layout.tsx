import type { Metadata } from 'next'
import { Oswald, Inter } from 'next/font/google'
import Script from 'next/script'
import './globals.css'
import Nav from '@/components/layout/Nav'
import Footer from '@/components/layout/Footer'
import CookieBanner from '@/components/ui/CookieBanner'
import { BASE } from '@/lib/utils'

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
    template: '%s | Стендап в Москве',
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

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" className={`${oswald.variable} ${inter.variable}`}>
      <head>
        <meta name="theme-color" content="#0c0c10" />
        <link rel="preconnect" href="https://s3.intickets.ru" />
        <link rel="preconnect" href="https://mc.yandex.ru" />
        <link rel="preconnect" href="https://top-fwz1.mail.ru" />
        <link rel="preconnect" href="https://images.unsplash.com" />
        <link rel="preconnect" href="https://womanstandup.ru" />
        <link rel="preconnect" href="https://static.tildacdn.com" />
        <link rel="alternate" type="application/rss+xml" title="Стендап концерты — comedy.moscow" href="/rss.xml" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32.png" />
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
        />
        <link rel="preload" href="https://s3.intickets.ru/intickets.min.css" as="style" />
        <script dangerouslySetInnerHTML={{ __html: `var l=document.querySelector('link[href="https://s3.intickets.ru/intickets.min.css"]');l.onload=function(){l.onload=null;l.rel='stylesheet'}` }} />
        <noscript><link rel="stylesheet" href="https://s3.intickets.ru/intickets.min.css" /></noscript>
      </head>
      <body>
        <Nav />
        <main>{children}</main>
        <Footer />
        <CookieBanner />
        <Script
          src="https://s3.intickets.ru/intickets.js"
          strategy="afterInteractive"
        />
        <Script
          id="vk-pixel"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{ __html: `
            var _tmr = window._tmr || (window._tmr = []);
            _tmr.push({id: "3764427", type: "pageView", start: (new Date()).getTime()});
            (function (d, w, id) {
              if (d.getElementById(id)) return;
              var ts = d.createElement("script"); ts.type = "text/javascript"; ts.async = true; ts.id = id;
              ts.src = "https://top-fwz1.mail.ru/js/code.js";
              var f = function () {var s = d.getElementsByTagName("script")[0]; s.parentNode.insertBefore(ts, s);};
              if (w.opera == "[object Opera]") { d.addEventListener("DOMContentLoaded", f, false); } else { f(); }
            })(document, window, "topmailru-code");
          `}}
        />
        <Script
          id="yandex-metrika"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{ __html: `
            (function(m,e,t,r,i,k,a){
              m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
              m[i].l=1*new Date();
              for (var j = 0; j < document.scripts.length; j++) {if (document.scripts[j].src === r) { return; }}
              k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)
            })(window, document,'script','https://mc.yandex.ru/metrika/tag.js', 'ym');
            ym(108210320, 'init', {webvisor:true, clickmap:true, ecommerce:"dataLayer", accurateTrackBounce:true, trackLinks:true, trustedDomains:['afisha.yandex.ru','widget.afisha.yandex.ru']});
            ym(94359734, 'init', {clickmap:true, ecommerce:"dataLayer", accurateTrackBounce:true, trackLinks:true, trustedDomains:['afisha.yandex.ru','widget.afisha.yandex.ru']});
          `}}
        />
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
      </body>
    </html>
  )
}
