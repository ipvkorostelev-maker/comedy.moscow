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
          Хит сезона
        </Badge>
      )}
      {event.rating > 0 && <Badge variant="gold">★ {event.rating}</Badge>}
      <Badge variant="dark">{event.ageRestriction}</Badge>
      {event.duration && <Badge variant="dark">{event.duration}</Badge>}
      {event.ticketsLeft < 25 && (
        <Badge variant="dark">Осталось {event.ticketsLeft} мест</Badge>
      )}
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
    <div className="flex gap-3 overflow-x-auto pb-2" style={{ scrollbarWidth: 'none' }}>
      {artists.map((artist) => (
        <div key={artist.id} className="flex-shrink-0 w-[90px] lg:w-[100px]">
          <ArtistCard artist={artist} />
        </div>
      ))}
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
      <div className="hidden lg:block relative h-[80vh] mt-[50px] bg-bg overflow-hidden">
        {/* Image — right half */}
        <div className="absolute inset-y-0 left-[45%] right-0 overflow-hidden">
          <Image
            src={event.image}
            alt={event.title}
            fill
            priority
            className="object-cover object-center"
            sizes="55vw"
          />
          <div className="absolute inset-y-0 left-0 w-64 z-10 bg-gradient-to-r from-bg to-transparent" />
          <div className="absolute inset-x-0 top-0 h-24 z-10 bg-gradient-to-b from-bg to-transparent" />
          <div className="absolute inset-x-0 bottom-0 h-24 z-10 bg-gradient-to-t from-bg to-transparent" />
        </div>

        {/* Content — left */}
        <div className="relative z-20 h-full flex flex-col justify-center px-16 max-w-[52%]">
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
      </div>
    </>
  )
}
