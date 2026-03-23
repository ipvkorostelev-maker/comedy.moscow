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
