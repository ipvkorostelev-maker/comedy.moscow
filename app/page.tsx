export const dynamic = 'force-dynamic'

import type { Metadata } from 'next'
import { Suspense } from 'react'
import { getAllEvents, getAllArtists, getMainEvents, isMoscowCity } from '@/lib/data'
import { getEnrichedTours } from '@/lib/womanstandup'
import { BASE } from '@/lib/utils'
import EventCard from '@/components/cards/EventCard'
import HomeSchedule from '@/components/sections/HomeSchedule'
import ToursCarousel from '@/components/sections/ToursCarousel'
import ArtistRail from '@/components/sections/ArtistRail'

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Стендап концерты в Москве — comedy.moscow',
    description: 'Афиша стендап концертов в Москве. Расписание, составы комиков, отзывы зрителей. Купить билеты онлайн — быстро и удобно.',
    alternates: { canonical: BASE },
    openGraph: {
      title: 'Стендап концерты в Москве | Смешно',
      description: 'Афиша стендап концертов в Москве. Расписание, составы, отзывы. Билеты онлайн.',
      url: BASE,
      siteName: 'Смешно',
      locale: 'ru_RU',
      images: [{ url: `${BASE}/opengraph-image`, width: 1200, height: 630, alt: 'comedy.moscow — стендап в Москве' }],
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Стендап концерты в Москве | Смешно',
      description: 'Афиша стендап концертов. Билеты онлайн.',
    },
  }
}

export default async function HomePage() {
  const [allEvents, artists, tours, mainEvents] = await Promise.all([
    getAllEvents(),
    getAllArtists(),
    getEnrichedTours(),
    getMainEvents(),
  ])
  const scheduleEvents = allEvents.filter((e) => isMoscowCity(e.city))
  const highlights = mainEvents.filter((e) => isMoscowCity(e.city))
  const activeArtistIds = new Set(scheduleEvents.flatMap(e => e.artistIds))
  const activeArtists = artists.filter(a => activeArtistIds.has(a.id))
  const today = new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Moscow', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date())

  return (
    <>
      <div className="max-w-[1440px] mx-auto px-5 sm:px-6 lg:px-12 pt-9 sm:pt-14 lg:pt-16">
        <header className="mb-7 sm:mb-9">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-red mb-3">Москва · афиша и билеты</p>
          <h1 className="font-serif font-black uppercase text-cream text-[32px] sm:text-5xl lg:text-[64px] leading-[1.1]">Стендап в Москве</h1>
          <p className="mt-4 max-w-xl text-sm sm:text-base text-muted leading-relaxed">Любимые комики и новые имена. Выберите концерт на удобную дату.</p>
        </header>
        <Suspense fallback={<p className="py-12 text-muted">Загружаем афишу…</p>}>
          <HomeSchedule events={scheduleEvents} today={today} />
        </Suspense>
        {highlights.length > 0 && (
          <section className="mt-14 lg:mt-20 pt-8 border-t border-white/10">
            <p className="text-xs uppercase tracking-[0.18em] text-red font-semibold mb-2">Особый повод для вечера</p>
            <h2 className="font-serif font-black uppercase text-xl sm:text-3xl text-cream mb-6">Большие сольные концерты</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-7">{highlights.map(event => <EventCard key={event.id} event={event} landscape />)}</div>
          </section>
        )}
      </div>
      {tours.length > 0 && (
        <div id="tours" className="scroll-mt-20 max-w-[1440px] mx-auto pt-14 lg:pt-20 pb-4">
          <ToursCarousel tours={tours} />
        </div>
      )}
      {activeArtists.length > 0 && (
        <div className="max-w-[1440px] mx-auto pt-14 lg:pt-20 pb-4">
          <ArtistRail artists={activeArtists.slice(0, 12)} />
        </div>
      )}
      <section className="max-w-[1440px] mx-auto px-5 sm:px-6 lg:px-12 pt-14 lg:pt-20 pb-8">
        <div className="border-t border-white/10 pt-8 grid sm:grid-cols-2 gap-7 sm:gap-12">
          <div><h2 className="text-lg font-semibold text-cream">Как купить билеты?</h2><p className="mt-3 text-sm leading-relaxed text-muted">Выберите концерт, откройте его страницу и нажмите «Купить билеты». Выбор мест и оплата проходят у билетного оператора.</p></div>
          <div><h2 className="text-lg font-semibold text-cream">Нужна помощь с билетом?</h2><p className="mt-3 text-sm leading-relaxed text-muted">По вопросам оплаты и возврата обратитесь к оператору, указанному в билете. Ссылки на службы возврата — внизу сайта.</p><a href="/contacts" className="inline-flex items-center min-h-[44px] text-sm text-red hover:underline">Контакты организаторов →</a></div>
        </div>
      </section>
    </>
  )
}
