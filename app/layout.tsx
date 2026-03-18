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

export const metadata: Metadata = {
  title: {
    default: 'Смешно — стендап-концерты',
    template: '%s | Смешно',
  },
  description: 'Лучшие стендап-концерты Москвы и Санкт-Петербурга. Покупай билеты онлайн.',
  openGraph: {
    type: 'website',
    locale: 'ru_RU',
    siteName: 'Смешно',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" className={`${oswald.variable} ${inter.variable}`}>
      <head>
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
