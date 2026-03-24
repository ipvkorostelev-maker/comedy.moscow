import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getEventBySlug, getArtistsByIds, getVenueById, getSimilarEvents } from '@/lib/data'
import { formatDate, formatDayOfWeek, formatPrice, minEventPrice } from '@/lib/utils'
import Badge from '@/components/ui/Badge'
import BuyButton from '@/components/ui/BuyButton'
import ReviewCard from '@/components/cards/ReviewCard'
import EventCard from '@/components/cards/EventCard'
import StickyBuyBar from '@/components/sections/StickyBuyBar'
import EventHero from '@/components/sections/EventHero'
import GalleryLightbox from '@/components/ui/GalleryLightbox'

export const revalidate = 60

const BASE = 'https://comedy.moscow'

/** Parse "2 ч 30 мин" → ISO end datetime */
function calcEndDate(date: string, time: string, duration: string): string | undefined {
  try {
    const [h, m] = time.split(':').map(Number)
    const dt = new Date(`${date}T${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:00`)
    const hMatch = duration.match(/(\d+)\s*ч/)
    const mMatch = duration.match(/(\d+)\s*мин/)
    const mins = (hMatch ? +hMatch[1] * 60 : 0) + (mMatch ? +mMatch[1] : 0)
    if (mins > 0) {
      dt.setMinutes(dt.getMinutes() + mins)
      return dt.toISOString().replace('.000Z', '+03:00')
    }
  } catch {}
  return undefined
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string }
}): Promise<Metadata> {
  const event = await getEventBySlug(params.slug)
  if (!event) return {}
  const venue = getVenueById(event.venueId)
  const price = minEventPrice(event)
  const url = `${BASE}/events/${event.slug}`
  const priceText = price > 0 ? ` Билеты от ${formatPrice(price)}.` : ''

  return {
    title: `${event.title}${venue ? ` — ${venue.name}` : ''}`,
    description: `${event.description}${priceText}`,
    alternates: { canonical: url },
    openGraph: {
      type: 'website',
      title: event.title,
      description: event.description,
      url,
      siteName: 'Смешно',
      locale: 'ru_RU',
      images: [{ url: event.image, width: 1200, height: 800, alt: event.title }],
    },
    twitter: {
      card: 'summary_large_image',
      title: event.title,
      description: event.description,
      images: [event.image],
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
  const url = `${BASE}/events/${event.slug}`

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Event',
    '@id': url,
    name: event.title,
    url,
    description: event.longDescription ?? event.description,
    image: [event.image],
    startDate: `${event.date}T${event.time}:00+03:00`,
    ...(event.duration ? { endDate: calcEndDate(event.date, event.time, event.duration) } : {}),
    eventStatus: 'https://schema.org/EventScheduled',
    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
    location: {
      '@type': 'Place',
      name: event.venueName ?? venue?.name,
      address: {
        '@type': 'PostalAddress',
        streetAddress: venue?.address,
        addressLocality: event.city,
        addressCountry: 'RU',
      },
    },
    organizer: {
      '@type': 'Organization',
      '@id': `${BASE}/#organization`,
      name: 'Смешно',
      url: BASE,
    },
    performer: artists.map((a) => ({
      '@type': 'Person',
      '@id': `${BASE}/artists/${a.slug}`,
      name: a.name,
      url: `${BASE}/artists/${a.slug}`,
    })),
    offers: [
      ...(event.tickets.standard.available
        ? [{
            '@type': 'Offer',
            name: 'Стандарт',
            price: event.tickets.standard.price,
            priceCurrency: 'RUB',
            availability: 'https://schema.org/InStock',
            ...(event.ticketUrl ? { url: event.ticketUrl } : {}),
          }]
        : []),
      ...(event.tickets.premium.available
        ? [{
            '@type': 'Offer',
            name: 'Премиум',
            price: event.tickets.premium.price,
            priceCurrency: 'RUB',
            availability: 'https://schema.org/InStock',
            ...(event.ticketUrl ? { url: event.ticketUrl } : {}),
          }]
        : []),
      ...(event.tickets.vip.available
        ? [{
            '@type': 'Offer',
            name: 'VIP',
            price: event.tickets.vip.price,
            priceCurrency: 'RUB',
            availability: 'https://schema.org/InStock',
            ...(event.ticketUrl ? { url: event.ticketUrl } : {}),
          }]
        : []),
    ],
    ...(event.rating > 0
      ? {
          aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue: event.rating,
            reviewCount: event.reviewsCount,
            bestRating: 5,
          },
        }
      : {}),
    ...(event.reviews && event.reviews.length > 0
      ? {
          review: event.reviews.map((r) => ({
            '@type': 'Review',
            author: { '@type': 'Person', name: r.author },
            reviewRating: { '@type': 'Rating', ratingValue: r.rating, bestRating: 5 },
            reviewBody: r.text,
            datePublished: r.date,
          })),
        }
      : {}),
  }

  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Главная', item: BASE },
      { '@type': 'ListItem', position: 2, name: 'События', item: `${BASE}/events` },
      { '@type': 'ListItem', position: 3, name: event.title, item: url },
    ],
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />

      {/* ── HERO ── */}
      <EventHero event={event} artists={artists} venue={venue} price={price} />

      {/* ── MAIN CONTENT ── */}
      <div className="max-w-[1100px] mx-auto px-6 lg:px-12 pt-4 lg:pt-14 pb-14">
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
            <h2 id="about" className="font-serif font-bold text-xl text-cream mb-4">О шоу</h2>
            {event.longDescription && (
              <div
                className="text-sm text-cream/65 leading-[1.75] prose-invert [&_div]:mb-3 [&_p]:mb-3 [&_br]:hidden [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:mb-3 [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:mb-3"
                dangerouslySetInnerHTML={{ __html: event.longDescription }}
              />
            )}
          </div>

          {/* SIDEBAR */}
          <div>
            <div className="bg-surface-2 border border-border rounded-2xl overflow-hidden sticky top-24">
              {/* Buy CTA */}
              <div className="p-5 border-b border-border">
                {price > 0 && (
                  <div className="mb-4">
                    <p className="text-muted text-[10px] uppercase tracking-[0.15em] mb-1">Цена от</p>
                    <p className="font-serif font-black text-cream text-3xl leading-none">{formatPrice(price)}</p>
                  </div>
                )}
                <BuyButton
                  ticketType={event.ticketType}
                  ticketUrl={event.ticketUrl}
                  yandexWidgetId={event.yandexWidgetId}
                  className="w-full justify-center"
                  label="Купить билет →"
                />
              </div>
              {/* Invite */}
              <div className="p-5 border-b border-border">
                <p className="text-[10px] text-muted uppercase tracking-[0.15em] mb-3">Позвать сходить вместе</p>
                <div className="flex gap-2">
                  <a
                    href={`https://vk.com/share.php?url=https://comedy.moscow/events/${event.slug}&title=${encodeURIComponent(event.title)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg bg-[#0077FF]/10 hover:bg-[#0077FF]/20 border border-[#0077FF]/25 text-[#4DA3FF] text-[11px] font-semibold transition-colors"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M15.07 2H8.93C3.33 2 2 3.33 2 8.93v6.14C2 20.67 3.33 22 8.93 22h6.14C20.67 22 22 20.67 22 15.07V8.93C22 3.33 20.67 2 15.07 2zm3.08 13.56h-1.6c-.6 0-.79-.48-1.87-1.58-.94-.93-1.35-.93-1.35 0v1.43c0 .44-.14.58-1.26.58-1.86 0-3.92-1.13-5.37-3.24C5.48 10.3 5 8.24 5 7.82c0-.25.1-.49.58-.49h1.6c.43 0 .6.2.77.67.85 2.44 2.27 4.58 2.86 4.58.22 0 .32-.1.32-.65V9.56c-.07-1.17-.68-1.27-.68-1.69 0-.21.17-.43.45-.43h2.52c.36 0 .49.19.49.62v3.33c0 .36.16.49.27.49.22 0 .4-.13.8-.54 1.24-1.39 2.13-3.52 2.13-3.52.12-.25.32-.49.75-.49h1.6c.48 0 .59.25.48.59-.2.93-2.14 3.66-2.14 3.66-.17.28-.24.4 0 .71.17.23.73.71 1.1 1.14.68.77 1.2 1.42 1.34 1.87.13.44-.1.67-.54.67z"/></svg>
                    ВКонтакте
                  </a>
                  <a
                    href={`https://t.me/share/url?url=https://comedy.moscow/events/${event.slug}&text=${encodeURIComponent(event.title)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg bg-[#2AABEE]/10 hover:bg-[#2AABEE]/20 border border-[#2AABEE]/25 text-[#2AABEE] text-[11px] font-semibold transition-colors"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/></svg>
                    Telegram
                  </a>
                  <a
                    href={`https://max.ru/:share?text=${encodeURIComponent(event.title + ' https://comedy.moscow/events/' + event.slug)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg bg-[#00C2FF]/10 hover:bg-[#00C2FF]/20 border border-[#00C2FF]/25 text-[#00C2FF] text-[11px] font-semibold transition-colors"
                  >
                    <svg width="14" height="14" viewBox="0 0 1000 1000" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="1000" height="1000" fill="#4CCFFF" rx="249.681"/><path fill="#fff" fillRule="evenodd" d="M508.211 878.328c-75.007 0-109.864-10.95-170.453-54.75-38.325 49.275-159.686 87.783-164.979 21.9 0-49.456-10.95-91.248-23.36-136.873-14.782-56.21-31.572-118.807-31.572-209.508 0-216.626 177.754-379.597 388.357-379.597 210.785 0 375.947 171.001 375.947 381.604.707 207.346-166.595 376.118-373.94 377.224m3.103-571.585c-102.564-5.292-182.499 65.7-200.201 177.024-14.6 92.162 11.315 204.398 33.397 210.238 10.585 2.555 37.23-18.98 53.837-35.587a189.8 189.8 0 0 0 92.71 33.032c106.273 5.112 197.08-75.794 204.215-181.95 4.154-106.382-77.67-196.486-183.958-202.574Z" clipRule="evenodd"/></svg>
                    Max
                  </a>
                </div>
              </div>

              {/* Details */}
              <div className="p-5">
                {[
                  { label: 'Дата', value: formatDate(event.date), sub: formatDayOfWeek(event.date) },
                  { label: 'Начало', value: event.time },
                  { label: 'Место', value: event.venueName ?? venue?.name ?? '—', sub: venue?.address },
                  { label: 'Длительность', value: event.duration },
                  { label: 'Возраст', value: event.ageRestriction },
                  ...(event.rating > 0 ? [{ label: 'Рейтинг', value: `★ ${event.rating} / 5`, accent: 'gold' as const }] : []),
                ].filter(row => row.value && row.value !== '—').map(({ label, value, sub, accent }) => (
                  <div key={label} className="flex justify-between items-start py-3 border-b border-border last:border-0">
                    <span className="text-[11px] text-muted uppercase tracking-[0.1em] pt-0.5">{label}</span>
                    <span className={`text-sm font-semibold text-right max-w-[170px] ${accent === 'gold' ? 'text-gold' : 'text-cream'}`}>
                      {value}
                      {sub && <span className="block text-[11px] text-muted font-normal mt-0.5 normal-case">{sub}</span>}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── GALLERY ── */}
        {event.gallery && event.gallery.length >= 3 && (
          <div className="mb-16">
            <h2 className="font-serif font-bold text-xl text-cream mb-5">Фото с прошлых шоу</h2>
            <GalleryLightbox images={event.gallery} title={event.title} />
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
            <div className="flex gap-4 overflow-x-auto pb-2 -mx-6 px-6 md:mx-0 md:px-0 md:grid md:grid-cols-4 snap-x snap-mandatory md:snap-none">
              {similar.map((ev) => (
                <div key={ev.id} className="flex-shrink-0 w-[260px] md:w-auto snap-start">
                  <EventCard event={ev} />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <StickyBuyBar event={event} minPrice={price} />
    </>
  )
}
