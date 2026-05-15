export const revalidate = 300

import type { Metadata } from 'next'
import { getAllEvents, getAllArtists } from '@/lib/data'
import ArtistCard from '@/components/cards/ArtistCard'
import EventCard from '@/components/cards/EventCard'
import SectionHeader from '@/components/ui/SectionHeader'
import HeroSlider from '@/components/sections/HeroSlider'
import CalendarWrapper from '@/components/ui/CalendarWrapper'

interface Props {
  searchParams: { date?: string }
}

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Стендап концерты в Москве — comedy.moscow',
    description: 'Афиша стендап концертов в Москве. Расписание, составы комиков, отзывы зрителей. Купить билеты онлайн — быстро и удобно.',
    alternates: { canonical: 'https://comedy.moscow' },
    openGraph: {
      title: 'Стендап концерты в Москве | Смешно',
      description: 'Афиша стендап концертов в Москве. Расписание, составы, отзывы. Билеты онлайн.',
      url: 'https://comedy.moscow',
      siteName: 'Смешно',
      locale: 'ru_RU',
      images: [{ url: 'https://comedy.moscow/opengraph-image', width: 1200, height: 630, alt: 'comedy.moscow — стендап в Москве' }],
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Стендап концерты в Москве | Смешно',
      description: 'Афиша стендап концертов. Билеты онлайн.',
    },
  }
}

export default async function HomePage({ searchParams }: Props) {
  const [allEvents, artists] = await Promise.all([getAllEvents(), getAllArtists()])
  const dateFilter = searchParams.date ?? null
  const filtered = dateFilter
    ? allEvents.filter((e) => e.date === dateFilter)
    : allEvents

  const eventDates = new Set(allEvents.map((e) => e.date))

  return (
    <>
      <div className="px-6 lg:px-20 pt-24 lg:pt-28 pb-3 lg:pb-5">
        <div className="flex items-center gap-3">
          <span className="w-8 h-[2px] bg-red/40 rounded-full" />
          <h1 className="font-sans text-[11px] lg:text-xs text-cream/45 uppercase tracking-[0.22em] font-medium">
            Стендап-концерты в Москве
          </h1>
        </div>
      </div>

      {/* 4 nearest upcoming concerts in hero */}
      <HeroSlider events={allEvents.slice(0, 4)} />

      {/* ── SCHEDULE ── */}
      <section className="pt-10 pb-4">
        <div className="mb-8">
          <div className="max-w-7xl mx-auto px-6 lg:px-12 mb-5 flex items-center justify-between">
            <h2 className="font-serif font-bold text-xl text-cream">Расписание</h2>
            {dateFilter && (
              <a
                href="/"
                className="text-xs text-muted hover:text-cream transition-colors"
              >
                Сбросить ✕
              </a>
            )}
          </div>
          <CalendarWrapper
            eventDates={eventDates}
            selected={dateFilter}
          />
        </div>

        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          {filtered.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          ) : (
            <div className="py-16 text-center">
              <p className="text-muted text-sm">На эту дату концертов нет</p>
              <a
                href="/"
                className="mt-3 inline-block text-xs text-red hover:opacity-80 transition-opacity"
              >
                Показать все
              </a>
            </div>
          )}
        </div>
      </section>

      {/* ── ARTISTS ── */}
      <section className="max-w-7xl mx-auto px-6 lg:px-12 py-12 border-t border-border">
        <SectionHeader title="Комики" linkHref="/artists" linkLabel="Все артисты" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {artists.slice(0, 4).map((artist) => (
            <ArtistCard key={artist.id} artist={artist} />
          ))}
        </div>
      </section>
    </>
  )
}
