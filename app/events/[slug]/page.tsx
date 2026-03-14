import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import { getEventBySlug, getArtistsByIds, getVenueById, getSimilarEvents } from '@/lib/data'
import { formatDate, formatDayOfWeek, formatPrice, minEventPrice } from '@/lib/utils'
import Badge from '@/components/ui/Badge'
import ArtistCard from '@/components/cards/ArtistCard'
import TicketCard from '@/components/cards/TicketCard'
import ReviewCard from '@/components/cards/ReviewCard'
import EventCard from '@/components/cards/EventCard'
import StickyBuyBar from '@/components/sections/StickyBuyBar'

const TICKET_PERKS = {
  standard: ['Место в центральном секторе', 'Электронный билет на почту', 'Возврат за 48 часов'],
  premium: [
    'Первые 5 рядов у сцены',
    'Встреча с комиками после шоу',
    'Электронный билет на почту',
    'Возврат за 72 часа',
  ],
  vip: [
    'VIP-зона с обслуживанием',
    'Ужин перед шоу',
    'Фото с комиками',
    'Подарочный мерч',
    'Бесплатный возврат',
  ],
}

export const dynamic = 'force-dynamic'

export async function generateMetadata({
  params,
}: {
  params: { slug: string }
}): Promise<Metadata> {
  const event = await getEventBySlug(params.slug)
  if (!event) return {}
  return {
    title: event.title,
    description: event.description,
    openGraph: {
      title: event.title,
      description: event.description,
      images: [{ url: event.image }],
    },
  }
}

export default async function EventPage({ params }: { params: { slug: string } }) {
  const event = await getEventBySlug(params.slug)
  if (!event) notFound()

  const [artists, similar] = await Promise.all([
    getArtistsByIds(event.artistIds),
    getSimilarEvents(event.id),
  ])
  const venue = getVenueById(event.venueId)
  const price = minEventPrice(event)

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: event.title,
    startDate: `${event.date}T${event.time}:00`,
    location: {
      '@type': 'Place',
      name: venue?.name,
      address: { '@type': 'PostalAddress', streetAddress: venue?.address, addressLocality: event.city },
    },
    offers: { '@type': 'Offer', price, priceCurrency: 'RUB' },
    description: event.description,
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* ── HERO ── */}
      <div className="relative min-h-[560px] lg:h-[80vh] bg-bg overflow-hidden">

        {/* Image — full bleed on mobile, right panel on desktop */}
        <div className="absolute inset-0 lg:left-[45%] lg:right-0 lg:inset-y-0">
          <Image
            src={event.image}
            alt={event.title}
            fill
            priority
            className="object-cover object-center"
            sizes="(max-width: 1024px) 100vw, 55vw"
          />
          {/* Desktop gradients */}
          <div className="hidden lg:block absolute inset-y-0 left-0 w-64 z-10 bg-gradient-to-r from-bg to-transparent" />
          <div className="hidden lg:block absolute inset-x-0 top-0 h-24 z-10 bg-gradient-to-b from-bg to-transparent" />
          <div className="hidden lg:block absolute inset-x-0 bottom-0 h-24 z-10 bg-gradient-to-t from-bg to-transparent" />
          {/* Mobile overlays */}
          <div className="lg:hidden absolute inset-0 z-10 bg-[linear-gradient(to_top,rgba(12,12,15,0.97)_0%,rgba(12,12,15,0.4)_45%,rgba(12,12,15,0.2)_70%)]" />
          <div className="lg:hidden absolute inset-0 z-10 bg-[linear-gradient(to_bottom,rgba(12,12,15,0.5)_0%,transparent_20%)]" />
        </div>

        {/* Content */}
        <div className="relative z-20 h-full flex flex-col justify-end lg:justify-center px-6 lg:px-16 pb-12 lg:pb-0 lg:max-w-[52%]">
          <div className="flex flex-wrap gap-2 mb-4">
            {event.featured && <Badge variant="red">🔥 Хит сезона</Badge>}
            {event.rating > 0 && <Badge variant="gold">★ {event.rating}</Badge>}
            <Badge variant="dark">{event.ageRestriction}</Badge>
            {event.duration && <Badge variant="dark">{event.duration}</Badge>}
            {event.ticketsLeft < 25 && (
              <Badge variant="dark">Осталось {event.ticketsLeft} мест</Badge>
            )}
          </div>

          <h1 className="font-serif font-black text-cream leading-[0.93] tracking-[-0.02em] text-[clamp(26px,3.5vw,52px)] mb-2">
            {event.title}
          </h1>
          {event.subtitle && (
            <p className="text-cream/60 text-[clamp(13px,1.4vw,18px)] font-sans font-normal mt-3 mb-4">
              {event.subtitle}
            </p>
          )}

          <div className="flex flex-wrap gap-2 items-center mb-6">
            <span className="flex items-center gap-1.5 bg-white/10 backdrop-blur-sm border border-white/15 text-cream text-xs font-medium px-3 py-1.5 rounded-full">
              📅 {formatDate(event.date)}
            </span>
            <span className="flex items-center gap-1.5 bg-white/10 backdrop-blur-sm border border-white/15 text-cream text-xs font-medium px-3 py-1.5 rounded-full">
              🕗 {event.time}
            </span>
            <span className="flex items-center gap-1.5 bg-white/10 backdrop-blur-sm border border-white/15 text-cream text-xs font-medium px-3 py-1.5 rounded-full">
              📍 {venue?.name ?? event.city}
            </span>
          </div>

          {price > 0 && (
            <>
              <p className="hidden lg:block text-muted text-xs uppercase tracking-widest mb-1">Цена от</p>
              <p className="hidden lg:block font-serif font-black text-4xl text-cream mb-6">
                {formatPrice(price)}
                <span className="text-base font-sans font-normal text-muted ml-2">/ чел</span>
              </p>
            </>
          )}

          <div className="flex flex-wrap gap-3">
            <button className="bg-red text-white text-sm font-bold px-7 py-3.5 rounded-lg hover:opacity-85 transition-all shadow-[0_4px_28px_rgba(212,66,30,0.35)]">
              Купить билет →
            </button>
            <button className="flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/15 text-cream text-sm font-medium px-6 py-3.5 rounded-lg hover:bg-white/15 transition-all">
              Подробнее ↓
            </button>
          </div>
        </div>
      </div>

      {/* ── MAIN CONTENT ── */}
      <div className="max-w-[1100px] mx-auto px-6 lg:px-12 py-14">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-12 mb-16">

          {/* LEFT COL */}
          <div>
            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-8">
              {event.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-xs text-muted bg-surface border border-border px-3.5 py-1.5 rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* About */}
            <h2 className="font-serif font-bold text-xl text-cream mb-4">О шоу</h2>
            {event.longDescription?.split('\n\n').map((para, i) => (
              <p key={i} className="text-sm text-cream/65 leading-[1.75] mb-5">
                {para}
              </p>
            ))}

            {/* Lineup */}
            {artists.length > 0 && (
              <div className="mt-10">
                <h2 className="font-serif font-bold text-xl text-cream mb-5">Комики вечера</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {artists.map((artist) => (
                    <ArtistCard key={artist.id} artist={artist} />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* SIDEBAR */}
          <div>
            <div className="bg-surface border border-border rounded-2xl p-6 sticky top-24">
              {[
                {
                  label: 'Дата',
                  value: formatDate(event.date),
                  sub: formatDayOfWeek(event.date),
                },
                { label: 'Начало', value: event.time },
                { label: 'Место', value: venue?.name ?? '—', sub: venue?.address },
                { label: 'Длительность', value: event.duration },
                { label: 'Возраст', value: event.ageRestriction },
                {
                  label: 'Мест осталось',
                  value: `${event.ticketsLeft} мест ⚡`,
                  accent: 'red' as const,
                },
                {
                  label: 'Рейтинг',
                  value: `★ ${event.rating} / 5`,
                  accent: 'gold' as const,
                },
              ].map(({ label, value, sub, accent }) => (
                <div
                  key={label}
                  className="flex justify-between items-start py-3.5 border-b border-border last:border-0"
                >
                  <span className="text-[11px] text-muted uppercase tracking-[0.1em]">{label}</span>
                  <span
                    className={`text-sm font-semibold text-right max-w-[160px] capitalize ${
                      accent === 'red'
                        ? 'text-red'
                        : accent === 'gold'
                        ? 'text-gold'
                        : 'text-cream'
                    }`}
                  >
                    {value}
                    {sub && (
                      <span className="block text-[11px] text-muted font-normal mt-0.5 normal-case">
                        {sub}
                      </span>
                    )}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── TICKETS ── */}
        <div className="mb-16">
          <h2 className="font-serif font-bold text-xl text-cream mb-6">Билеты</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <TicketCard type="standard" tier={event.tickets.standard} perks={TICKET_PERKS.standard} />
            <TicketCard
              type="premium"
              tier={event.tickets.premium}
              featured
              perks={TICKET_PERKS.premium}
            />
            <TicketCard type="vip" tier={event.tickets.vip} perks={TICKET_PERKS.vip} />
          </div>
        </div>

        {/* ── GALLERY ── */}
        {event.gallery && event.gallery.length >= 3 && (
          <div className="mb-16">
            <h2 className="font-serif font-bold text-xl text-cream mb-5">Фото с прошлых шоу</h2>
            <div className="grid grid-cols-[2fr_1fr_1fr] grid-rows-[200px_200px] gap-2.5 rounded-2xl overflow-hidden">
              {event.gallery.slice(0, 5).map((img, i) => (
                <div
                  key={i}
                  className={`relative overflow-hidden group cursor-pointer ${
                    i === 0 ? 'row-span-2' : ''
                  }`}
                >
                  <Image
                    src={img}
                    alt={`Фото ${i + 1}`}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-[1.06]"
                    sizes="33vw"
                  />
                  <div className="absolute inset-0 bg-bg/0 group-hover:bg-bg/30 transition-all flex items-center justify-center">
                    <span className="text-3xl opacity-0 group-hover:opacity-100 transition-opacity">
                      ▶
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── REVIEWS ── */}
        {event.reviews && event.reviews.length > 0 && (
          <div className="mb-16">
            <h2 className="font-serif font-bold text-xl text-cream mb-5">Отзывы зрителей</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {event.reviews.map((review) => (
                <ReviewCard key={review.id} review={review} />
              ))}
            </div>
          </div>
        )}

        {/* ── SIMILAR EVENTS ── */}
        {similar.length > 0 && (
          <div className="mb-16">
            <h2 className="font-serif font-bold text-xl text-cream mb-5">Похожие шоу</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {similar.map((ev) => (
                <EventCard key={ev.id} event={ev} />
              ))}
            </div>
          </div>
        )}
      </div>

      <StickyBuyBar event={event} minPrice={price} />
    </>
  )
}
