import Image from 'next/image'
import Link from 'next/link'
import { Event } from '@/lib/types'
import { cn, formatDateShort, formatPrice, minEventPrice } from '@/lib/utils'

interface EventCardProps {
  event: Event
  /** Горизонтальная картинка (3:2 — исходники событий 1200x800) вместо постера 3:4 */
  landscape?: boolean
}

export default function EventCard({ event, landscape = false }: EventCardProps) {
  const price = minEventPrice(event)
  const dayShort = new Date(event.date).toLocaleDateString('ru-RU', { weekday: 'short' })

  return (
    <Link
      href={`/events/${event.slug}`}
      aria-label={event.title}
      className="group flex flex-col h-full w-full shadow-none transition-[transform,box-shadow] duration-200 hover:-translate-y-0.5 hover:shadow-[0_18px_40px_-12px_rgba(0,0,0,0.75),0_8px_24px_-8px_rgba(255,77,0,0.10)]"
    >
      {/* Image */}
      <div className={cn(
        'relative overflow-hidden rounded-lg img-loading-container mb-3',
        landscape ? 'aspect-[3/2]' : 'aspect-[3/4]'
      )}>
        <Image
          src={event.image}
          alt={event.title}
          fill
          className="object-cover object-center transition-transform duration-200 group-hover:scale-[1.03]"
          sizes={landscape
            ? '(max-width: 768px) 100vw, (max-width: 1440px) 50vw, 33vw'
            : '(max-width: 768px) 60vw, (max-width: 1440px) 25vw, 300px'}
        />
        {event.ticketsLeft < 25 && (
          <span className="absolute top-2 left-2 inline-flex items-center bg-red text-white text-[10px] font-bold px-2 py-1 rounded">
            {event.ticketsLeft} мест
          </span>
        )}
      </div>

      {/* Info */}
      <div className="flex flex-col">
        <p className="text-[11px] uppercase tracking-wide text-muted mb-1.5">
          {dayShort} · {formatDateShort(event.date)} · {event.time}
        </p>
        <h3 className="font-serif font-black text-[17px] leading-tight text-cream uppercase line-clamp-2 group-hover:text-red transition-colors duration-200 mb-1">
          {event.title}
        </h3>
        {(event.venueName || event.city) && (
          <p className="text-xs text-muted line-clamp-1 mb-2">
            {[event.venueName, event.city].filter(Boolean).join(' · ')}
          </p>
        )}
        {price > 0 && (
          <p className="font-serif font-black text-red text-base">
            от {formatPrice(price)}
          </p>
        )}
      </div>
    </Link>
  )
}
