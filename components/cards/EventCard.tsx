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
      {/* ── Main image ── */}
      <Image
        src={event.image}
        alt={event.title}
        fill
        className="object-cover object-center transition-transform duration-700 group-hover:scale-[1.05]"
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
      />

      {/* ── Top fade for badge readability ── */}
      <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black/55 to-transparent z-10 pointer-events-none" />

      {/* ── Dominant-color glass panel ──
           A blurred, saturated copy of the image bottom creates
           the "ambient color glow" effect matching the photo's palette.
           No JS needed — the blur averages pixel colors naturally. ── */}
      <div className="absolute inset-x-0 bottom-0 h-[58%] overflow-hidden z-[5]">
        {/* Blurred colour source */}
        <div className="absolute inset-0 scale-[1.25] translate-y-[5%]">
          <Image
            src={event.image}
            alt=""
            fill
            aria-hidden="true"
            className="object-cover object-bottom blur-[32px] saturate-[1.6] brightness-[0.55]"
            sizes="(max-width: 640px) 50vw, 20vw"
          />
        </div>
        {/* Extra darkening tint for text legibility */}
        <div className="absolute inset-0 bg-black/35" />
        {/* Feathered top edge — smooth blend into the main image */}
        <div className="absolute inset-x-0 top-0 h-12 bg-gradient-to-b from-transparent to-transparent
          [mask-image:linear-gradient(to_bottom,transparent,black)]" />
      </div>

      {/* ── Connecting gradient (image → glass panel) ── */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent z-[6] pointer-events-none" />

      {/* ── Top badges ── */}
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

      {/* ── Content ── */}
      <div className="absolute inset-x-0 bottom-0 p-4 z-20">

        {/* Title — the main focal point */}
        <h3 className="font-serif font-black text-white leading-[1.1] tracking-tight mb-2.5
          text-[clamp(15px,2vw,20px)] drop-shadow-sm line-clamp-3">
          {event.title}
        </h3>

        {/* Tags (1 max on card) */}
        {event.tags[0] && (
          <p className="text-white/40 text-[10px] uppercase tracking-widest mb-2 font-medium">
            {event.tags[0]}
          </p>
        )}

        {/* Date + time pills */}
        <div className="flex flex-wrap gap-1.5 mb-3">
          <MetaPill type="date" variant="glass">{formatDateShort(event.date)}</MetaPill>
          <MetaPill type="time" variant="glass">{event.time}</MetaPill>
        </div>

        {/* Price + CTA row */}
        <div className="flex items-center justify-between gap-2">
          <span className="text-white/50 text-[11px]">
            {price > 0 ? `от ${formatPrice(price)}` : 'Уточняется'}
          </span>
          <span
            className="inline-flex items-center gap-1
              bg-white/15 backdrop-blur-sm border border-white/20
              text-white text-[11px] font-semibold px-4 py-1.5 rounded-full
              group-hover:bg-white/25 transition-colors duration-200"
          >
            Купить →
          </span>
        </div>

      </div>
    </Link>
  )
}
