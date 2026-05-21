import type { Metadata } from 'next'
export const revalidate = 300
import { getAllEvents } from '@/lib/data'
import { BASE } from '@/lib/utils'
import EventCard from '@/components/cards/EventCard'
import CalendarWrapper from '@/components/ui/CalendarWrapper'

interface Props {
  searchParams: { date?: string }
}

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const dateFilter = searchParams.date ?? null
  return {
    title: 'Стендап-концерты в Москве и Санкт-Петербурге',
    description: 'Афиша стендап-концертов в России. Расписание, составы, отзывы. Билеты онлайн от 800 ₽.',
    alternates: { canonical: `${BASE}/events` },
    ...(dateFilter ? { robots: { index: false, follow: true } } : {}),
    openGraph: {
      title: 'Стендап-концерты в Москве и Санкт-Петербурге | Смешно',
      description: 'Афиша стендап-концертов в России. Расписание, составы, отзывы. Билеты онлайн от 800 ₽.',
      url: `${BASE}/events`,
      images: [{ url: `${BASE}/opengraph-image`, width: 1200, height: 630 }],
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Стендап-концерты в Москве | Смешно',
      description: 'Афиша стендап-концертов. Билеты онлайн.',
    },
  }
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
    <div className="pt-6">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
              { '@type': 'ListItem', position: 1, name: 'Главная', item: BASE },
              { '@type': 'ListItem', position: 2, name: 'События', item: `${BASE}/events` },
            ],
          }),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'ItemList',
            itemListElement: filtered.map((event, i) => ({
              '@type': 'ListItem',
              position: i + 1,
              url: `${BASE}/events/${event.slug}`,
              name: event.title,
            })),
          }),
        }}
      />
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="pt-4 pb-8 border-b border-border mb-6">
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
