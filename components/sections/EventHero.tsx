import Image from 'next/image'
import { Event, Artist, Venue } from '@/lib/types'
import { formatDate, formatPrice } from '@/lib/utils'
import Badge from '@/components/ui/Badge'
import BuyButton from '@/components/ui/BuyButton'
import MetaPill from '@/components/ui/MetaPill'
import ArtistCard from '@/components/cards/ArtistCard'
import { FlameIcon } from '@/components/ui/icons'

interface EventHeroProps {
  event: Event
  artists: Artist[]
  venue: Venue | undefined
  price: number
}

export default function EventHero({ event, artists, venue, price }: EventHeroProps) {
  const badges = (
    <div className="flex flex-wrap gap-2 mb-4">
      {event.featured && (
        <Badge variant="red" className="gap-1.5">
          <FlameIcon className="w-2.5 h-2.5" />
          Стендап в Москве
        </Badge>
      )}
      {event.rating > 0 && <Badge variant="gold">★ {event.rating}</Badge>}
      <Badge variant="dark">{event.ageRestriction}</Badge>
      {event.duration && <Badge variant="dark">~{event.duration}</Badge>}
    </div>
  )

  const pills = (
    <div className="flex flex-wrap gap-2.5 items-center mb-6">
      <MetaPill type="date" variant="glass" className="text-sm px-3.5 py-1.5 font-semibold">
        {formatDate(event.date)}
      </MetaPill>
      <MetaPill type="time" variant="glass" className="text-sm px-3.5 py-1.5 font-semibold">
        {event.time}
      </MetaPill>
      <MetaPill type="venue" variant="glass" className="text-sm px-3.5 py-1.5">
        {event.venueName ?? venue?.name ?? event.city}
      </MetaPill>
    </div>
  )

  const buttons = (
    <div className="flex flex-wrap gap-3 mb-6">
      <BuyButton
        ticketType={event.ticketType}
        ticketUrl={event.ticketUrl}
        yandexWidgetId={event.yandexWidgetId}
      />
      <a
        href="#about"
        className="flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/15 text-cream text-sm font-medium px-6 py-3.5 rounded-lg hover:bg-white/15 transition-all"
      >
        Подробнее ↓
      </a>
    </div>
  )

  const artistsRow = artists.length > 0 ? (
    <div>
      <p className="text-[10px] text-muted uppercase tracking-[0.15em] mb-3">Состав концерта:</p>
      <div className="flex gap-4 overflow-x-auto pb-2" style={{ scrollbarWidth: 'none' }}>
        {artists.map((artist) => (
          <a key={artist.id} href={`/artists/${artist.slug}`} className="flex-shrink-0 flex flex-col items-center gap-2 group">
            <div className="w-14 h-14 rounded-full overflow-hidden bg-surface border-2 border-border group-hover:border-red transition-colors duration-200 flex-shrink-0">
              {artist.photo ? (
                <img src={artist.photo} alt={artist.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-muted text-lg font-bold">
                  {artist.name[0]}
                </div>
              )}
            </div>
            <span className="text-[11px] text-cream/70 group-hover:text-cream transition-colors text-center leading-tight max-w-[70px]">
              {artist.name}
            </span>
          </a>
        ))}
      </div>
    </div>
  ) : null

  return (
    <>
      {/* ── MOBILE: stacked ── */}
      <div className="lg:hidden bg-bg mt-[60px]">
        <div
          className="relative w-full overflow-hidden pt-16"
          style={{ height: 'calc(56vw + 64px)', minHeight: 240, maxHeight: 380 }}
        >
          <Image
            src={event.image}
            alt={event.title}
            fill
            priority
            className="object-cover object-center"
            sizes="100vw"
          />
          <div className="absolute inset-x-0 bottom-0 h-12 z-10 bg-gradient-to-t from-bg to-transparent" />
          <div className="absolute inset-x-0 top-0 h-16 z-10 bg-gradient-to-b from-bg/70 to-transparent" />
        </div>
        <div className="px-5 pt-4 pb-8">
          {badges}
          <h1 className="font-serif font-black text-cream leading-[0.93] tracking-[-0.02em] text-[clamp(26px,3.5vw,52px)] mb-2">
            {event.title}
          </h1>
          {event.subtitle && (
            <p className="text-cream/60 text-[clamp(13px,1.4vw,18px)] font-sans font-normal mt-3 mb-4 leading-relaxed">
              {event.subtitle}
            </p>
          )}
          {pills}
          {buttons}
          {artistsRow}
        </div>
      </div>

      {/* ── DESKTOP: split ── */}
      <div className="hidden lg:flex mt-[50px] bg-bg overflow-hidden">
        {/* Content — left 45% */}
        <div className="w-[45%] flex-shrink-0 flex flex-col justify-center px-16 py-10 z-20">
          {badges}
          <h1 className="font-serif font-black text-cream leading-[0.93] tracking-[-0.02em] text-[clamp(26px,3.5vw,52px)] mb-2">
            {event.title}
          </h1>
          {event.subtitle && (
            <p className="text-cream/60 text-[clamp(13px,1.4vw,18px)] font-sans font-normal mt-3 mb-4 leading-relaxed">
              {event.subtitle}
            </p>
          )}
          {pills}
          {price > 0 && (
            <p className="text-cream/40 text-sm tracking-wide mb-5">
              от {formatPrice(price)}
            </p>
          )}
          {buttons}
          {artistsRow}
        </div>

        {/* Image — right 55%, never upscaled beyond native 1200×800 */}
        <div className="relative flex-1 overflow-hidden" style={{ maxWidth: '900px' }}>
          <Image
            src={event.image}
            alt={event.title}
            width={1200}
            height={800}
            priority
            className="w-full h-auto block"
            sizes="(max-width: 1920px) 55vw, 660px"
          />
          <div className="absolute inset-y-0 left-0 w-48 z-10 bg-gradient-to-r from-bg to-transparent" />
          <div className="absolute inset-x-0 top-0 h-20 z-10 bg-gradient-to-b from-bg to-transparent" />
          <div className="absolute inset-x-0 bottom-0 h-20 z-10 bg-gradient-to-t from-bg to-transparent" />
        </div>
      </div>
    </>
  )
}
