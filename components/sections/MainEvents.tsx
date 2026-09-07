import Image from 'next/image'
import Link from 'next/link'
import { Event } from '@/lib/types'
import { formatDateShort, formatPrice, minEventPrice } from '@/lib/utils'

interface MainEventsProps {
  events: Event[]
}

export default function MainEvents({ events }: MainEventsProps) {
  if (events.length === 0) return null

  return (
    <section className="max-w-[1440px] mx-auto pt-12 lg:pt-16">
      <div className="px-6 lg:px-12">
        <div className="mb-5 flex items-end justify-between">
          <div>
            <h2 className="font-serif font-black text-cream uppercase text-xl lg:text-2xl">Главные события</h2>
            <p className="text-sm text-muted mt-1">Не пропустите самое важное</p>
          </div>
          <Link
            href="/events"
            className="text-sm text-muted hover:text-cream transition-colors duration-200"
          >
            Все события →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {events.map((event) => (
            <MainEventCard key={event.id} event={event} />
          ))}
        </div>
      </div>
    </section>
  )
}

function MainEventCard({ event }: { event: Event }) {
  const price = minEventPrice(event)
  const dayShort = new Date(event.date).toLocaleDateString('ru-RU', { weekday: 'short' })

  return (
    <Link
      href={`/events/${event.slug}`}
      aria-label={event.title}
      className="group flex flex-col h-full overflow-hidden rounded-xl border border-border bg-surface-elevated hover:bg-surface-hover transition-all duration-200 hover:-translate-y-0.5 hover:border-red hover:shadow-[0_18px_40px_-12px_rgba(0,0,0,0.75),0_8px_24px_-8px_rgba(255,77,0,0.10)]"
    >
      <div className="relative aspect-[3/2] overflow-hidden img-loading-container">
        <Image
          src={event.image}
          alt={event.title}
          fill
          className="object-cover object-center transition-transform duration-200 group-hover:scale-[1.03]"
          sizes="(max-width: 768px) 100vw, 50vw"
        />
        <span className="absolute top-3 left-3 inline-flex items-center bg-red text-white text-[11px] font-bold px-2.5 py-1 rounded">
          Главное
        </span>
      </div>

      <div className="flex flex-col flex-1 p-4 lg:p-5">
        <p className="text-[11px] uppercase tracking-wide text-muted mb-1.5">
          {dayShort} · {formatDateShort(event.date)} · {event.time}
        </p>
        <h3 className="font-serif font-black text-lg lg:text-xl leading-tight text-cream uppercase line-clamp-2 group-hover:text-red transition-colors duration-200 mb-1.5">
          {event.title}
        </h3>
        {(event.venueName || event.city) && (
          <p className="text-xs text-muted line-clamp-1 mb-3">
            {[event.venueName, event.city].filter(Boolean).join(' · ')}
          </p>
        )}

        <div className="mt-auto flex items-center justify-between gap-3 pt-1">
          {price > 0 ? (
            <p className="font-serif font-black text-red text-base">от {formatPrice(price)}</p>
          ) : (
            <span />
          )}
          <span className="inline-flex items-center justify-center min-h-[44px] px-5 bg-red group-hover:bg-red-hover text-white text-sm font-bold rounded-lg transition-colors duration-200">
            Купить билет
          </span>
        </div>
      </div>
    </Link>
  )
}
