import Link from 'next/link'
import { Event } from '@/lib/types'
import EventCard from '@/components/cards/EventCard'

interface EventRailProps {
  events: Event[]
  title?: string
}

export default function EventRail({ events, title = 'Ближайшие концерты' }: EventRailProps) {
  if (events.length === 0) return null

  return (
    <section>
      <div className="flex items-end justify-between mb-4 px-6 lg:px-12">
        <h2 className="font-serif font-black text-cream uppercase text-xl lg:text-2xl">{title}</h2>
        <Link
          href="/events"
          className="text-sm text-muted hover:text-cream transition-colors duration-200"
        >
          Все события →
        </Link>
      </div>
      <div className="flex gap-4 overflow-x-auto scrollbar-hide snap-x snap-mandatory pb-2 px-6 lg:px-12">
        {events.map((event) => (
          <div
            key={event.id}
            className="shrink-0 snap-start w-[62vw] sm:w-[38vw] md:w-[26vw] lg:w-[19%] xl:w-[16.5%]"
          >
            <EventCard event={event} />
          </div>
        ))}
      </div>
    </section>
  )
}
