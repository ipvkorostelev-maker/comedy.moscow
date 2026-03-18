import Image from 'next/image'
import Link from 'next/link'
import { Event } from '@/lib/types'
import { formatDateShort, formatPrice, minEventPrice } from '@/lib/utils'
import Badge from '@/components/ui/Badge'

interface EventCardProps {
  event: Event
}

export default function EventCard({ event }: EventCardProps) {
  const price = minEventPrice(event)

  return (
    <Link href={`/events/${event.slug}`} className="group block">
      <div className="relative aspect-[4/3] overflow-hidden rounded-xl mb-3 bg-surface">
        <Image
          src={event.image}
          alt={event.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/20 to-transparent" />

        {event.ticketsLeft < 25 && (
          <div className="absolute top-3 left-3">
            <Badge variant="red">⚡ Осталось {event.ticketsLeft}</Badge>
          </div>
        )}

        <div className="absolute top-3 right-3">
          <Badge variant="gold">★ {event.rating}</Badge>
        </div>

        <div className="absolute bottom-3 left-3 flex gap-1 flex-wrap">
          {event.tags.slice(0, 2).map((tag) => (
            <Badge key={tag} variant="dark">
              {tag}
            </Badge>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <h3 className="font-serif font-bold text-cream text-base leading-tight group-hover:text-red transition-colors line-clamp-2">
          {event.title}
        </h3>
        <div className="flex flex-wrap gap-1.5">
          <span className="inline-flex items-center gap-1 bg-white/8 border border-white/10 text-cream/80 text-[11px] font-medium px-2.5 py-1 rounded-full">
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="opacity-60"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
            {formatDateShort(event.date)}
          </span>
          <span className="inline-flex items-center gap-1 bg-white/8 border border-white/10 text-cream/80 text-[11px] font-medium px-2.5 py-1 rounded-full">
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="opacity-60"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            {event.time}
          </span>
          {(event.venueName ?? event.city) && (
            <span className="inline-flex items-center gap-1 bg-white/8 border border-white/10 text-cream/80 text-[11px] font-medium px-2.5 py-1 rounded-full max-w-full">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="opacity-60 flex-shrink-0"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
              <span className="truncate">{event.venueName ?? event.city}</span>
            </span>
          )}
        </div>
        {price > 0 && (
          <p className="text-sm font-bold text-red">от {formatPrice(price)}</p>
        )}
      </div>
    </Link>
  )
}
