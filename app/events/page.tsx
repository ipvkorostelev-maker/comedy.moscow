import type { Metadata } from 'next'
export const revalidate = 60
import { getAllEvents } from '@/lib/data'
import EventCard from '@/components/cards/EventCard'

export const metadata: Metadata = {
  title: 'События',
  description: 'Все стендап-концерты и мероприятия.',
}

export default async function EventsPage() {
  const events = await getAllEvents()
  const cities = [...new Set(events.map((e) => e.city))]

  return (
    <div className="pt-24">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="py-12 border-b border-border mb-10">
          <h1 className="font-serif font-black text-4xl lg:text-5xl text-cream mb-3">События</h1>
          <div className="flex flex-wrap gap-2 items-center">
            <span className="text-muted text-sm">{events.length} мероприятий</span>
            <span className="text-muted-2">·</span>
            {cities.map((city) => (
              <span key={city} className="text-xs text-muted bg-surface border border-border px-3 py-1 rounded-full">
                {city}
              </span>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 pb-16">
          {events.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      </div>
    </div>
  )
}
