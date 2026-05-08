import type { Metadata } from 'next'
import Image from 'next/image'
import CorporateSections from './CorporateSections'

const HERO_DESKTOP = 'https://static.tildacdn.com/tild3936-6233-4432-a564-623830346564/IMG_6828.PNG'
const HERO_MOBILE = 'https://static.tildacdn.com/tild3632-6261-4165-b130-333363316639/11.jpg'
const OG_IMAGE = 'https://static.tildacdn.com/tild3936-6233-4432-a564-623830346564/IMG_6828.PNG'

export const metadata: Metadata = {
  title: 'Стендап на корпоратив — заказать комиков на мероприятие | Смешно',
  description: 'Организация стендап-выступлений на корпоративы и частные мероприятия в Москве. Медийные и начинающие комики, готовые шоу под ключ. Звоните: +7 906 731-45-51.',
  robots: { index: false, follow: false },
  openGraph: {
    title: 'Стендап на корпоратив — комики на ваш праздник | Смешно',
    description: 'Стендап-комики на корпоратив и частное мероприятие. Звёзды ТВ и YouTube, готовые шоу под ключ, любой бюджет.',
    url: 'https://comedy.moscow/corporate',
    siteName: 'Смешно',
    locale: 'ru_RU',
    type: 'website',
    images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: 'Стендап на корпоратив — Смешно' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Стендап на корпоратив — комики на ваш праздник | Смешно',
    description: 'Закажите стендап-комиков на мероприятие. Звёзды, готовые шоу, любой бюджет.',
    images: [OG_IMAGE],
  },
}

export default function CorporatePage() {
  return (
    <main className="min-h-screen">
      {/* ── HERO ── */}
      <section className="relative h-[90vh] min-h-[500px] lg:h-[85vh] lg:min-h-[550px] flex items-end lg:items-center overflow-hidden">
        {/* Background image with Ken Burns animation */}
        <div className="absolute inset-0 z-0">
          {/* Desktop image */}
          <div className="hidden lg:block absolute inset-0" style={{ animation: 'kenBurns 12s ease-out forwards' }}>
            <Image
              src={HERO_DESKTOP}
              alt="Стендап выступление"
              fill
              priority
              quality={90}
              className="object-cover"
              sizes="100vw"
            />
          </div>
          {/* Mobile image */}
          <div className="lg:hidden absolute inset-0" style={{ animation: 'kenBurns 12s ease-out forwards' }}>
            <Image
              src={HERO_MOBILE}
              alt="Стендап выступление"
              fill
              priority
              quality={90}
              className="object-cover object-[left_center]"
              sizes="100vw"
            />
          </div>
          {/* Overlay — bottom gradient on mobile, side gradient on desktop */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-black/30 lg:bg-gradient-to-r lg:from-black lg:via-black/90 lg:to-black/50" />
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12 w-full pb-12 lg:pb-0">
          <div className="max-w-3xl">
            <p
              className="text-red text-[11px] lg:text-sm uppercase tracking-[0.3em] mb-4 lg:mb-6 font-semibold animate-hero-content"
              style={{ animationDelay: '0ms' }}
            >
              Корпоративы и частные мероприятия
            </p>
            <h1
              className="font-serif font-black text-cream text-3xl sm:text-5xl lg:text-8xl uppercase leading-[0.9] mb-4 lg:mb-6 animate-hero-content"
              style={{ animationDelay: '80ms' }}
            >
              Стендап комики<br />
              <span className="text-red">на ваш праздник</span>
            </h1>
            <p
              className="text-cream/60 text-sm lg:text-lg leading-relaxed max-w-xl mb-6 lg:mb-10 animate-hero-content"
              style={{ animationDelay: '150ms' }}
            >
              Удивите гостей необычной программой вечера. Шоу Стендап — яркий сюрприз,
              который сделает ваш праздник незабываемым. Гарантируем отличный результат.
            </p>
            <div
              className="flex flex-wrap items-center gap-3 lg:gap-4 animate-hero-content"
              style={{ animationDelay: '220ms' }}
            >
              <a
                href="tel:+79067314551"
                className="inline-flex items-center gap-2 bg-red hover:bg-red-hover text-white font-bold px-6 py-3.5 lg:px-8 lg:py-4 rounded-xl transition-all shadow-red text-sm lg:text-lg"
              >
                Связаться
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </a>
              <a
                href="tel:+79031597317"
                className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/15 text-cream font-medium px-5 py-3.5 lg:px-6 lg:py-4 rounded-xl hover:bg-white/15 transition-all text-xs lg:text-base"
              >
                Медийные комики
              </a>
            </div>
          </div>
        </div>

        {/* Scroll hint — hidden on mobile via lg:flex */}
        <div className="hidden lg:block absolute bottom-8 left-1/2 -translate-x-1/2 z-10 animate-bounce">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#F0EDE8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="opacity-40">
            <path d="M12 5v14M5 12l7 7 7-7"/>
          </svg>
        </div>
      </section>

      {/* ── SECTIONS ── */}
      <CorporateSections />
    </main>
  )
}
