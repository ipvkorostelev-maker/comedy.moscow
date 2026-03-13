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

      <div className="space-y-1">
        <h3 className="font-serif font-bold text-cream text-base leading-tight group-hover:text-red transition-colors line-clamp-2">
          {event.title}
        </h3>
        <p className="text-xs text-muted">
          {formatDateShort(event.date)} · {event.time} · {event.city}
        </p>
        <p className="text-sm font-bold text-red">от {formatPrice(price)}</p>
      </div>
    </Link>
  )
}
