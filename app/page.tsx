export const revalidate = 300

import type { Metadata } from 'next'
import { getAllEvents, getAllArtists } from '@/lib/data'
import { getEnrichedTours } from '@/lib/womanstandup'
import { BASE } from '@/lib/utils'
import EventCard from '@/components/cards/EventCard'
import HeroSlider from '@/components/sections/HeroSlider'
import ToursCarousel from '@/components/sections/ToursCarousel'
import EventRail from '@/components/sections/EventRail'
import ArtistRail from '@/components/sections/ArtistRail'
import CalendarWrapper from '@/components/ui/CalendarWrapper'

interface Props {
  searchParams: { date?: string }
}

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

export default async function HomePage({ searchParams }: Props) {
  const [allEvents, artists, tours] = await Promise.all([getAllEvents(), getAllArtists(), getEnrichedTours()])
  const dateFilter = searchParams.date ?? null
  const filtered = dateFilter
    ? allEvents.filter((e) => e.date === dateFilter)
    : allEvents

  const eventDates = new Set(allEvents.map((e) => e.date))

  return (
    <>
      <h1 className="sr-only">Стендап концерты в Москве — афиша и билеты</h1>

      {/* ── HERO ── */}
      {!dateFilter && <HeroSlider events={allEvents.slice(0, 4)} />}

      {/* ── UPCOMING RAIL ── */}
      {!dateFilter && allEvents.length > 0 && (
        <div className="max-w-[1440px] mx-auto pt-12 lg:pt-16">
          <EventRail events={allEvents.slice(0, 12)} />
        </div>
      )}

      {/* ── SCHEDULE ── */}
      <section className="max-w-[1440px] mx-auto pt-12 lg:pt-16 pb-4">
        <div className="px-6 lg:px-12">
          <div className="mb-5 flex items-end justify-between">
            <h2 className="font-serif font-black text-cream uppercase text-xl lg:text-2xl">Расписание</h2>
            {dateFilter && (
              <a
                href="/"
                className="text-sm text-muted hover:text-cream transition-colors"
              >
                Сбросить ✕
              </a>
            )}
          </div>

          <div className="mb-8 -mx-6 px-6 lg:mx-0 lg:px-0">
            <CalendarWrapper
              eventDates={eventDates}
              selected={dateFilter}
            />
          </div>

          {filtered.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-8">
              {filtered.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          ) : (
            <div className="py-16 text-center">
              <p className="text-muted text-sm">На эту дату концертов нет</p>
              <a
                href="/"
                className="mt-3 inline-block text-sm text-red hover:opacity-80 transition-opacity"
              >
                Показать все
              </a>
            </div>
          )}
        </div>
      </section>

      {/* ── TOURS ── */}
      {tours.length > 0 && (
        <div id="tours" className="max-w-[1440px] mx-auto pt-12 lg:pt-16 pb-4">
          <ToursCarousel tours={tours} />
        </div>
      )}

      {/* ── ARTISTS ── */}
      {artists.length > 0 && (
        <div className="max-w-[1440px] mx-auto pt-12 lg:pt-16 pb-4">
          <ArtistRail artists={artists.slice(0, 12)} />
        </div>
      )}
    </>
  )
}
