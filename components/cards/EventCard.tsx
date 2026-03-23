import Image from 'next/image'
import Link from 'next/link'
import { Event } from '@/lib/types'
import { formatDateShort, formatPrice, minEventPrice } from '@/lib/utils'
import MetaPill from '@/components/ui/MetaPill'
import { ZapIcon } from '@/components/ui/icons'

interface EventCardProps {
  event: Event
}

export default function EventCard({ event }: EventCardProps) {
  const price = minEventPrice(event)

  return (
    <Link
      href={`/events/${event.slug}`}
      className="group block relative aspect-[3/4] rounded-[22px] overflow-hidden cursor-pointer
        shadow-[0_2px_24px_rgba(0,0,0,0.55)]
        hover:shadow-[0_8px_48px_rgba(0,0,0,0.75)]
        hover:ring-1 hover:ring-white/10
        transition-all duration-500"
    >
      {/* ── Layer 1: Main photo ── */}
      <Image
        src={event.image}
        alt={event.title}
        fill
        className="object-cover object-center transition-transform duration-700 group-hover:scale-[1.05]"
        sizes="(max-width: 768px) 50vw, 33vw"
      />

      {/* ── Layer 2: Top fade for badge readability ── */}
      <div className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-black/60 to-transparent z-10 pointer-events-none" />

      {/* ── Layer 3: Dominant-color glass panel (bottom 44% only) ──
           overflow-hidden clips the blurred copy; -inset-4 expands it
           so no blur edge artifacts appear at the panel borders. ── */}
      <div className="absolute inset-x-0 bottom-0 h-[44%] overflow-hidden z-[5]">
        {/* Blurred colour source — extends 16px beyond container edges */}
        <div className="absolute -inset-4">
          <Image
            src={event.image}
            alt=""
            fill
            aria-hidden="true"
            className="object-cover object-bottom blur-[28px] saturate-[1.8] brightness-[0.45]"
            sizes="(max-width: 768px) 50vw, 33vw"
          />
        </div>
        {/* Darkening tint for text legibility */}
        <div className="absolute inset-0 bg-black/40" />
      </div>

      {/* ── Layer 4: Connecting gradient (image → glass panel) ──
           Sits just above the glass panel, feathers the transition. ── */}
      <div className="absolute inset-x-0 bottom-[44%] h-20 bg-gradient-to-b from-transparent to-black/55 z-[6] pointer-events-none" />

      {/* ── Layer 5: Top badges ── */}
      <div className="absolute top-3.5 left-3.5 right-3.5 flex items-start justify-between gap-2 z-20">
        {event.ticketsLeft < 25 && (
          <span className="inline-flex items-center gap-1 bg-red text-white text-[10px] font-bold tracking-wide px-2.5 py-1 rounded-md shadow-red-sm">
            <ZapIcon className="w-2.5 h-2.5 flex-shrink-0" />
            {event.ticketsLeft} мест
          </span>
        )}
        {event.rating > 0 && (
          <span className="ml-auto inline-flex items-center gap-1 bg-black/50 backdrop-blur-sm text-gold text-[10px] font-bold px-2.5 py-1 rounded-md">
            ★ {event.rating}
          </span>
        )}
      </div>

      {/* ── Layer 6: Content ── */}
      <div className="absolute inset-x-0 bottom-0 p-4 z-20">

        {/* Tags (1 max) */}
        {event.tags[0] && (
          <p className="text-white/45 text-[9px] uppercase tracking-[0.12em] mb-1.5 font-semibold">
            {event.tags[0]}
          </p>
        )}

        {/* Title — the main focal point */}
        <h3 className="font-serif font-black text-white leading-[1.08] tracking-tight mb-3
          text-[clamp(16px,2.2vw,21px)] drop-shadow-sm line-clamp-3">
          {event.title}
        </h3>

        {/* Date + time pills */}
        <div className="flex flex-wrap gap-1.5 mb-3">
          <MetaPill type="date" variant="glass">{formatDateShort(event.date)}</MetaPill>
          <MetaPill type="time" variant="glass">{event.time}</MetaPill>
        </div>

        {/* Price + CTA row */}
        <div className="flex items-center justify-between gap-2">
          <span className="text-white/45 text-[11px]">
            {price > 0 ? `от ${formatPrice(price)}` : 'Уточняется'}
          </span>
          <span
            className="inline-flex items-center gap-1
              bg-white/15 backdrop-blur-sm border border-white/20
              text-white text-[11px] font-semibold px-3.5 py-1.5 rounded-full
              group-hover:bg-white/25 transition-colors duration-200"
          >
            Купить →
          </span>
        </div>

      </div>
    </Link>
  )
}
