import Image from 'next/image'
import Link from 'next/link'
import { Event } from '@/lib/types'
import { formatDateShort, formatPrice, minEventPrice } from '@/lib/utils'
import MetaPill from '@/components/ui/MetaPill'

interface EventCardProps {
  event: Event
}

export default function EventCard({ event }: EventCardProps) {
  const price = minEventPrice(event)

  return (
    <Link
      href={`/events/${event.slug}`}
      className="group block bg-surface rounded-card overflow-hidden border border-border hover:border-muted-2 transition-all duration-300 hover:shadow-card-hover"
    >
      {/* ── IMAGE ── */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          src={event.image}
          alt={event.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-surface/80 via-transparent to-transparent" />

        {/* Top badges */}
        <div className="absolute top-3 left-3 right-3 flex items-start justify-between gap-2">
          {event.ticketsLeft < 25 && (
            <span className="inline-flex items-center gap-1 bg-red text-white text-[10px] font-bold tracking-wide px-2.5 py-1 rounded-md shadow-red-sm">
              ⚡ {event.ticketsLeft} мест
            </span>
          )}
          {event.rating > 0 && (
            <span className="inline-flex items-center gap-1 bg-[#1A1208]/90 text-gold text-[10px] font-bold px-2.5 py-1 rounded-md ml-auto">
              ★ {event.rating}
            </span>
          )}
        </div>

        {/* Tags at bottom-left of image */}
        <div className="absolute bottom-3 left-3 flex gap-1.5 flex-wrap">
          {event.tags.slice(0, 2).map((tag) => (
            <span
              key={tag}
              className="text-[10px] text-cream/70 bg-bg/70 backdrop-blur-sm border border-white/10 px-2 py-0.5 rounded"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* ── INFO ── */}
      <div className="p-4 space-y-3">
        <h3 className="font-serif font-bold text-cream text-[15px] leading-snug group-hover:text-red transition-colors duration-200 line-clamp-2">
          {event.title}
        </h3>

        <div className="flex flex-wrap gap-1.5">
          <MetaPill type="date">{formatDateShort(event.date)}</MetaPill>
          <MetaPill type="time">{event.time}</MetaPill>
          {(event.venueName ?? event.city) && (
            <MetaPill type="venue">{event.venueName ?? event.city}</MetaPill>
          )}
        </div>

        <div className="flex items-center justify-between pt-1 border-t border-border">
          {price > 0 ? (
            <span className="font-serif font-black text-red text-lg leading-none">
              от {formatPrice(price)}
            </span>
          ) : (
            <span className="text-muted text-sm">Цена уточняется</span>
          )}
          <span className="inline-flex items-center gap-1 text-[11px] text-muted group-hover:text-cream transition-colors duration-200">
            Подробнее
            <span className="group-hover:translate-x-0.5 transition-transform duration-200">→</span>
          </span>
        </div>
      </div>
    </Link>
  )
}
