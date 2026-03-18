import Image from 'next/image'
import Link from 'next/link'
import { Event } from '@/lib/types'
import { formatDateShort, formatPrice, minEventPrice } from '@/lib/utils'

interface EventCardProps {
  event: Event
}

export default function EventCard({ event }: EventCardProps) {
  const price = minEventPrice(event)

  return (
    <Link
      href={`/events/${event.slug}`}
      className="group block bg-surface rounded-[16px] overflow-hidden border border-border hover:border-muted-2 transition-all duration-300 hover:shadow-[0_8px_32px_rgba(0,0,0,0.55)]"
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
        {/* gradient only at bottom */}
        <div className="absolute inset-0 bg-gradient-to-t from-surface/80 via-transparent to-transparent" />

        {/* Top badges */}
        <div className="absolute top-3 left-3 right-3 flex items-start justify-between gap-2">
          {event.ticketsLeft < 25 ? (
            <span className="inline-flex items-center gap-1 bg-red text-white text-[10px] font-bold tracking-wide px-2.5 py-1 rounded-md shadow-red-sm">
              ⚡ {event.ticketsLeft} мест
            </span>
          ) : <span />}
          {event.rating > 0 && (
            <span className="inline-flex items-center gap-1 bg-[#1A1208]/90 text-gold text-[10px] font-bold px-2.5 py-1 rounded-md">
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
        {/* Title */}
        <h3 className="font-serif font-bold text-cream text-[15px] leading-snug group-hover:text-red transition-colors duration-200 line-clamp-2">
          {event.title}
        </h3>

        {/* Meta pills */}
        <div className="flex flex-wrap gap-1.5">
          <span className="inline-flex items-center gap-1.5 bg-surface-2 border border-border text-cream/65 text-[11px] font-medium px-2.5 py-1 rounded-md">
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="opacity-50 flex-shrink-0"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
            {formatDateShort(event.date)}
          </span>
          <span className="inline-flex items-center gap-1.5 bg-surface-2 border border-border text-cream/65 text-[11px] font-medium px-2.5 py-1 rounded-md">
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="opacity-50 flex-shrink-0"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            {event.time}
          </span>
          {(event.venueName ?? event.city) && (
            <span className="inline-flex items-center gap-1.5 bg-surface-2 border border-border text-cream/65 text-[11px] font-medium px-2.5 py-1 rounded-md max-w-full">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="opacity-50 flex-shrink-0"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
              <span className="truncate">{event.venueName ?? event.city}</span>
            </span>
          )}
        </div>

        {/* Price + CTA row */}
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
            <span className="translate-x-0 group-hover:translate-x-0.5 transition-transform duration-200">→</span>
          </span>
        </div>
      </div>
    </Link>
  )
}
