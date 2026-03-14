'use client'

import { useState, useMemo } from 'react'
import { Event } from '@/lib/types'
import EventCard from '@/components/cards/EventCard'
import EventCalendar from './EventCalendar'

interface Props {
  events: Event[]
}

export default function HomeEventsSection({ events }: Props) {
  const [selected, setSelected] = useState<string | null>(null)

  const eventDates = useMemo(
    () => new Set(events.map((e) => e.date)),
    [events]
  )

  const filtered = useMemo(
    () => selected ? events.filter((e) => e.date === selected) : events,
    [events, selected]
  )

  return (
    <section className="pt-10 pb-4">
      {/* Calendar */}
      <div className="mb-8">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 mb-5 flex items-center justify-between">
          <h2 className="font-serif font-bold text-xl text-cream">Расписание</h2>
          {selected && (
            <button
              onClick={() => setSelected(null)}
              className="text-xs text-muted hover:text-cream transition-colors"
            >
              Сбросить ✕
            </button>
          )}
        </div>
        <EventCalendar
          eventDates={eventDates}
          selected={selected}
          onSelect={setSelected}
        />
      </div>

      {/* Events grid */}
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
            <button
              onClick={() => setSelected(null)}
              className="mt-3 text-xs text-red hover:opacity-80 transition-opacity"
            >
              Показать все
            </button>
          </div>
        )}
      </div>
    </section>
  )
}
