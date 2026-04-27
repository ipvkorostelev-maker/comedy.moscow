import type { Metadata } from 'next'
export const revalidate = 300
import { getAllEvents } from '@/lib/data'
import { BASE } from '@/lib/utils'
import EventCard from '@/components/cards/EventCard'
import CalendarWrapper from '@/components/ui/CalendarWrapper'

export const metadata: Metadata = {
  title: 'Стендап-концерты в Москве и Санкт-Петербурге',
  description: 'Афиша стендап-концертов в России. Расписание, составы, отзывы. Билеты онлайн от 800 ₽.',
  alternates: { canonical: `${BASE}/events` },
  openGraph: {
    title: 'Стендап-концерты в Москве и Санкт-Петербурге | Смешно',
    description: 'Афиша стендап-концертов в России. Расписание, составы, отзывы. Билеты онлайн от 800 ₽.',
    url: `${BASE}/events`,
    images: [{ url: '/og-default.jpg', width: 1200, height: 630, alt: 'Стендап-концерты | Смешно' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Стендап-концерты в Москве | Смешно',
    description: 'Афиша стендап-концертов. Билеты онлайн.',
    images: ['/og-default.jpg'],
  },
}

interface Props {
  searchParams: { date?: string }
}

export default async function EventsPage({ searchParams }: Props) {
  const events = await getAllEvents()
  const dateFilter = searchParams.date ?? null
  const filtered = dateFilter
    ? events.filter((e) => e.date === dateFilter)
    : events
  const cities = [...new Set(events.map((e) => e.city))]
  const eventDates = new Set(events.map((e) => e.date))

  return (
    <div className="pt-8">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="py-12 border-b border-border mb-6">
          <h1 className="font-serif font-black text-4xl lg:text-5xl text-cream mb-3">События</h1>
          <div className="flex flex-wrap gap-2 items-center mb-5">
            <span className="text-muted text-sm">{events.length} мероприятий</span>
            <span className="text-muted-2">·</span>
            {cities.map((city) => (
              <span key={city} className="text-xs text-muted bg-surface border border-border px-3 py-1 rounded-full">
                {city}
              </span>
            ))}
          </div>
          <CalendarWrapper eventDates={eventDates} selected={dateFilter} />
        </div>

        {dateFilter && (
          <div className="mb-6">
            <a href="/events" className="text-xs text-muted hover:text-cream transition-colors">
              Сбросить фильтр ✕
            </a>
          </div>
        )}

        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-16">
            {filtered.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        ) : (
          <div className="py-16 text-center pb-16">
            <p className="text-muted text-sm">На эту дату концертов нет</p>
            <a href="/events" className="mt-3 inline-block text-xs text-red hover:opacity-80 transition-opacity">
              Показать все
            </a>
          </div>
        )}
      </div>
    </div>
  )
}
