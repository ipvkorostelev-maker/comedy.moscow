import Image from 'next/image'
import { Event, Artist, Venue } from '@/lib/types'
import { formatDateShort, formatPrice, BASE } from '@/lib/utils'
import BuyButton from '@/components/ui/BuyButton'
import InticketsBuyButton from '@/components/ui/InticketsBuyButton'
import MetaPill from '@/components/ui/MetaPill'
import EventBadges from '@/components/ui/EventBadges'
import CommissionButton from '@/components/ui/CommissionButton'

interface EventHeroProps {
  event: Event
  artists: Artist[]
  venue: Venue | undefined
  price: number
}

export default function EventHero({ event, artists, venue, price }: EventHeroProps) {
  const pills = (
    <div className="flex flex-wrap gap-2.5 items-center">
      <MetaPill type="date" variant="glass" className="text-sm px-3.5 py-1.5 font-semibold">
        {formatDateShort(event.date)}
      </MetaPill>
      <MetaPill type="time" variant="glass" className="text-sm px-3.5 py-1.5 font-semibold">
        {event.time}
      </MetaPill>
      <MetaPill type="venue" variant="glass" className="text-sm px-3.5 py-1.5">
        {[event.venueName ?? venue?.name, event.city].filter(Boolean).join(' · ')}
      </MetaPill>
    </div>
  )

  const buttons = (
    <div className="flex flex-col lg:flex-row flex-wrap gap-3">
      <BuyButton
        ticketType={event.ticketType}
        ticketUrl={event.ticketUrl}
        yandexWidgetId={event.yandexWidgetId}
        className="w-full justify-center lg:w-auto"
      />
      {event.inticketsUrl && (
        <InticketsBuyButton url={event.inticketsUrl} className="w-full justify-center lg:w-auto" />
      )}
      <a
        href="#about"
        className="inline-flex items-center justify-center gap-2 border border-white/25 text-cream text-sm font-medium px-6 rounded-xl hover:bg-white/10 transition-all min-h-[48px] w-full lg:w-auto"
      >
        Подробнее ↓
      </a>
    </div>
  )

  const eventUrl = `${BASE}/events/${event.slug}`
  const shareLinks = [
    {
      label: 'ВКонтакте',
      href: `https://vk.com/share.php?url=${encodeURIComponent(eventUrl)}&title=${encodeURIComponent(event.title)}`,
      color: '#4DA3FF',
      bg: '#0077FF',
      icon: <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M15.07 2H8.93C3.33 2 2 3.33 2 8.93v6.14C2 20.67 3.33 22 8.93 22h6.14C20.67 22 22 20.67 22 15.07V8.93C22 3.33 20.67 2 15.07 2zm3.08 13.56h-1.6c-.6 0-.79-.48-1.87-1.58-.94-.93-1.35-.93-1.35 0v1.43c0 .44-.14.58-1.26.58-1.86 0-3.92-1.13-5.37-3.24C5.48 10.3 5 8.24 5 7.82c0-.25.1-.49.58-.49h1.6c.43 0 .6.2.77.67.85 2.44 2.27 4.58 2.86 4.58.22 0 .32-.1.32-.65V9.56c-.07-1.17-.68-1.27-.68-1.69 0-.21.17-.43.45-.43h2.52c.36 0 .49.19.49.62v3.33c0 .36.16.49.27.49.22 0 .4-.13.8-.54 1.24-1.39 2.13-3.52 2.13-3.52.12-.25.32-.49.75-.49h1.6c.48 0 .59.25.48.59-.2.93-2.14 3.66-2.14 3.66-.17.28-.24.4 0 .71.17.23.73.71 1.1 1.14.68.77 1.2 1.42 1.34 1.87.13.44-.1.67-.54.67z"/></svg>,
    },
    {
      label: 'Telegram',
      href: `https://t.me/share/url?url=${encodeURIComponent(eventUrl)}&text=${encodeURIComponent(event.title)}`,
      color: '#2AABEE',
      bg: '#2AABEE',
      icon: <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/></svg>,
    },
    {
      label: 'Max',
      href: `https://max.ru/:share?text=${encodeURIComponent(event.title + ' ' + eventUrl)}`,
      color: '#00C2FF',
      bg: '#00C2FF',
      icon: <svg width="13" height="13" viewBox="0 0 1000 1000" fill="none"><rect width="1000" height="1000" fill="#4CCFFF" rx="249.681"/><path fill="#fff" fillRule="evenodd" d="M508.211 878.328c-75.007 0-109.864-10.95-170.453-54.75-38.325 49.275-159.686 87.783-164.979 21.9 0-49.456-10.95-91.248-23.36-136.873-14.782-56.21-31.572-118.807-31.572-209.508 0-216.626 177.754-379.597 388.357-379.597 210.785 0 375.947 171.001 375.947 381.604.707 207.346-166.595 376.118-373.94 377.224m3.103-571.585c-102.564-5.292-182.499 65.7-200.201 177.024-14.6 92.162 11.315 204.398 33.397 210.238 10.585 2.555 37.23-18.98 53.837-35.587a189.8 189.8 0 0 0 92.71 33.032c106.273 5.112 197.08-75.794 204.215-181.95 4.154-106.382-77.67-196.486-183.958-202.574Z" clipRule="evenodd"/></svg>,
    },
  ]

  const shareRow = (
    <div>
      <p className="text-[10px] text-cream/40 uppercase tracking-[0.18em] mb-2.5">Позвать сходить вместе</p>
      <div className="flex flex-wrap gap-2">
        {shareLinks.map(({ label, href, color, bg, icon }) => (
          <a
            key={label}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-[11px] font-semibold transition-all hover:brightness-125"
            style={{ color, background: `color-mix(in srgb, ${bg} 12%, transparent)`, border: `1px solid color-mix(in srgb, ${bg} 25%, transparent)` }}
          >
            {icon}
            {label}
          </a>
        ))}
      </div>
    </div>
  )

  const artistsRow = artists.length > 0 ? (
    <div>
      <p className="text-[10px] text-muted uppercase tracking-[0.15em] mb-3">Состав концерта:</p>
      <div className="flex gap-4 overflow-x-auto scrollbar-hide touch-pan-xy pb-2">
        {artists.map((artist) => (
          <a key={artist.id} href={`/artists/${artist.slug}`} className="flex-shrink-0 flex flex-col items-center gap-2 group">
            <div className="relative w-14 h-14 rounded-full overflow-hidden bg-surface border-2 border-border group-hover:border-red transition-colors duration-200 flex-shrink-0">
              {artist.photo ? (
                <Image src={artist.photo} alt={artist.name} fill sizes="56px" className="object-cover" />
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
    <section className="overflow-hidden pb-8">
      {/* ── MOBILE ── */}
      <div className="lg:hidden">
        <div className="relative w-full aspect-[3/2] bg-surface-2 img-loading-container overflow-hidden">
          {event.image && (
            <Image
              src={event.image}
              alt={event.title}
              fill
              priority
              quality={85}
              className="object-cover object-center"
              sizes="100vw"
            />
          )}
          <div
            className="absolute bottom-0 left-0 right-0 h-12 pointer-events-none"
            style={{ background: 'linear-gradient(to top, rgba(10,10,10,1), transparent)' }}
          />
        </div>

        <div className="px-5 pt-5 pb-6 flex flex-col gap-5">
          <EventBadges event={event} />

          <h1 className="font-serif font-black text-cream uppercase leading-[1.02] text-[clamp(26px,8vw,36px)]">
            {event.title}
          </h1>

          {event.subtitle && (
            <p className="text-cream/60 text-sm lg:text-lg font-normal leading-relaxed">
              {event.subtitle}
            </p>
          )}

          {pills}

          {price > 0 && (
            <p className="font-serif font-black text-lg text-cream">
              от {formatPrice(price)}
            </p>
          )}

          {buttons}
          {artistsRow}
          {shareRow}

          {artists.length > 0 && (
            <CommissionButton artistNames={artists.map(a => a.name)} className="w-full py-2.5 px-4" />
          )}
        </div>
      </div>

      {/* ── DESKTOP ── */}
      <div className="hidden lg:flex items-center justify-between gap-8 px-6 lg:px-12 h-[460px] xl:h-[500px]">
        <div className="max-w-[560px] flex flex-col justify-center gap-5">
          <EventBadges event={event} />

          <p className="font-serif font-black text-cream uppercase leading-[1.02] text-[clamp(28px,3vw,48px)]">
            {event.title}
          </p>

          {event.subtitle && (
            <p className="text-cream/60 text-sm lg:text-lg font-normal leading-relaxed">
              {event.subtitle}
            </p>
          )}

          {pills}

          {price > 0 && (
            <p className="font-serif font-black text-lg text-cream">
              от {formatPrice(price)}
            </p>
          )}

          {buttons}
          {artistsRow}
          {shareRow}

          {artists.length > 0 && (
            <CommissionButton artistNames={artists.map(a => a.name)} className="self-start py-2.5 px-5" />
          )}
        </div>

        <div className="relative w-[46%] xl:w-[44%] h-full rounded-xl overflow-hidden bg-surface-2 img-loading-container">
          {event.image && (
            <Image
              src={event.image}
              alt={event.title}
              fill
              priority
              quality={85}
              className="object-cover object-center"
              sizes="(max-width: 1280px) 46vw, 44vw"
            />
          )}
          <div
            className="absolute inset-y-0 left-0 w-16 z-10 pointer-events-none"
            style={{ background: 'linear-gradient(to right, rgba(10,10,10,1), transparent)' }}
          />
        </div>
      </div>
    </section>
  )
}
