import type { Metadata } from 'next'
import Link from 'next/link'
import EventShare from '@/components/ui/EventShare'
import './event-detail.css'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import sanitizeHtml from 'sanitize-html'
import { NavLabelSync } from '@/components/ui/NavLabelProvider'
import { getEventBySlugAny, isEventPast, getArtistsByIds, getVenueById, getSimilarEvents, getAllEvents, getArtistOtherEvents } from '@/lib/data'
import { formatDateShort, formatDayOfWeek, formatPrice, minEventPrice, BASE } from '@/lib/utils'
import ReviewCard from '@/components/cards/ReviewCard'
import EventRail from '@/components/sections/EventRail'
import MetaPill from '@/components/ui/MetaPill'
import StickyBuyBar from '@/components/sections/StickyBuyBar'
import EventHero from '@/components/sections/EventHero'
import GalleryLightbox from '@/components/ui/GalleryLightbox'
import CommissionButton from '@/components/ui/CommissionButton'
import OtherDatesPanel from '@/components/ui/OtherDatesPanel'

function safeHtml(html: string | undefined): string {
  if (!html) return ''
  return sanitizeHtml(html, {
    allowedTags: sanitizeHtml.defaults.allowedTags.concat(['img', 'font']),
    allowedAttributes: {
      ...sanitizeHtml.defaults.allowedAttributes,
      img: ['src', 'alt', 'width', 'height'],
      font: ['color', 'style'],
      '*': ['style'],
    },
    allowedStyles: {
      '*': {
        color: [/^[#a-z0-9(),.\s%]+$/i],
        'font-size': [/^[\d.]+(px|em|rem|%)$/i],
        'font-family': [/^[\w\s,'"()-]+$/i],
        'font-weight': [/^[\w]+$/i],
        'font-style': [/^[\w]+$/i],
        'text-decoration': [/^[\w\s]+$/i],
        'text-align': [/^(left|right|center|justify)$/i],
        'line-height': [/^[\d.]+$/],
        'letter-spacing': [/^[\d.]+(px|em|rem)?$/i],
        'background-color': [/^[#a-z0-9(),.\s%]+$/i],
      },
    },
  })
}

export const revalidate = 300
export const dynamicParams = true

export async function generateStaticParams() {
  const events = await getAllEvents()
  return events.map((e) => ({ slug: e.slug }))
}
const TZ = '+03:00'

/** Strip HTML tags → plain text for JSON-LD description */
function plainText(html: string): string {
  return html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()
}

/** "2 ч 30 мин" → total minutes */
function parseDurationMinutes(duration: string): number {
  const h = duration.match(/(\d+)\s*ч/)
  const m = duration.match(/(\d+)\s*мин/)
  return (h ? +h[1] * 60 : 0) + (m ? +m[1] : 0)
}

/** "YYYY-MM-DD" + "HH:MM" + duration string → ISO Moscow datetime string */
function calcEndDate(date: string, time: string, duration: string): string | undefined {
  try {
    const mins = parseDurationMinutes(duration)
    if (!mins) return undefined
    const [hh, mm] = time.split(':').map(Number)
    const totalMins = hh * 60 + mm + mins
    const endH = Math.floor(totalMins / 60) % 24
    const endM = totalMins % 60
    const endDay = Math.floor((hh * 60 + mm + mins) / (24 * 60)) > 0
      ? new Date(new Date(date).getTime() + 86400000).toISOString().slice(0, 10)
      : date
    return `${endDay}T${String(endH).padStart(2, '0')}:${String(endM).padStart(2, '0')}:00${TZ}`
  } catch {
    return undefined
  }
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string }
}): Promise<Metadata> {
  const event = await getEventBySlugAny(params.slug)
  // notFound() в metadata выполняется до стриминга ответа и отдаёт честный 404,
  // иначе неизвестные слэги получают 200 со страницей 404 (soft-404)
  if (!event) notFound()
  const venue = getVenueById(event.venueId)
  const price = minEventPrice(event)
  const url = `${BASE}/events/${event.slug}`
  const priceText = !isEventPast(event) && price > 0 ? ` Билеты от ${formatPrice(price)}.` : ''

  const city = event.city || 'Москва'
  const cityLabel = city === 'Москва' ? 'в Москве' : `, ${city}`

  const adminDescription = event.metaDescription || ''

  const descriptionPlain = plainText(event.description)

  const title = city === 'Москва'
    ? `${event.title} — ${formatDateShort(event.date)}`
    : `${event.title} — ${city}, ${formatDateShort(event.date)}. Билеты на стендап`

  const autoDescription = city === 'Москва'
    ? (descriptionPlain ? `${descriptionPlain}.${priceText}` : `Стендап-концерт «${event.title}» ${cityLabel}, ${formatDateShort(event.date)}.${priceText}`)
    : `${descriptionPlain ? descriptionPlain + '. ' : ''}Стендап-концерт «${event.title}» ${cityLabel}, ${formatDateShort(event.date)}.${priceText}`

  const metaDescription = adminDescription || autoDescription

  const ogTitle = city === 'Москва' ? event.title : `${event.title} — ${city}`

  return {
    title,
    description: metaDescription,
    alternates: { canonical: url },
    openGraph: {
      type: 'website',
      title: ogTitle,
      description: metaDescription,
      url,
      siteName: 'Смешно',
      locale: 'ru_RU',
      images: [{ url: `${url}/opengraph-image`, width: 1200, height: 630, alt: event.title }],
    },
    twitter: {
      card: 'summary_large_image',
      title: ogTitle,
      description: metaDescription,
      images: [`${url}/opengraph-image`],
    },
  }
}

export default async function EventPage({ params }: { params: { slug: string } }) {
  const event = await getEventBySlugAny(params.slug)
  if (!event) notFound()

  const navLabel = event.city && event.city !== "Москва" ? `Стендап ${event.city}` : null

  const past = isEventPast(event)
  const [artists, similar, otherEvents] = await Promise.all([
    getArtistsByIds(event.artistIds),
    getSimilarEvents(event.id, past ? 6 : 3),
    past ? ([] as import('@/lib/types').Event[]) : getArtistOtherEvents(event.id, event.artistIds),
  ])
  const venue = getVenueById(event.venueId)
  const url = `${BASE}/events/${event.slug}`

  // ── PAST EVENT PAGE ───────────────────────────────────────────────────────
  if (past) {
    const pastJsonLd: Record<string, unknown> = {
      '@context': 'https://schema.org',
      '@type': 'Event',
      '@id': url,
      name: event.title,
      url,
      description: plainText(event.longDescription ?? event.description),
      inLanguage: 'ru',
      ...(event.image
        ? { image: [{ '@type': 'ImageObject', url: event.image, width: 1200, height: 800 }] }
        : {}),
      startDate: `${event.date}T${event.time}:00${TZ}`,
      eventStatus: 'https://schema.org/EventCompleted',
      eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
      location: {
        '@type': 'Place',
        name: event.venueName ?? venue?.name ?? event.city,
        address: {
          '@type': 'PostalAddress',
          addressLocality: event.city || 'Москва',
          addressCountry: 'RU',
          ...(venue?.address ? { streetAddress: venue.address } : {}),
        },
      },
      organizer: { '@type': 'Organization', '@id': `${BASE}/#organization`, name: 'Смешно', url: BASE },
      performer: artists.map((a) => ({ '@type': 'Person', '@id': `${BASE}/artists/${a.slug}`, name: a.name, url: `${BASE}/artists/${a.slug}` })),
    }

    if (event.rating > 0 && event.reviewsCount > 0) {
      pastJsonLd.aggregateRating = {
        '@type': 'AggregateRating',
        ratingValue: event.rating,
        reviewCount: event.reviewsCount,
        bestRating: 5,
        worstRating: 1,
      }
    }
    if (event.reviews && event.reviews.length > 0) {
      pastJsonLd.review = event.reviews.map((r) => ({
        '@type': 'Review',
        author: { '@type': 'Person', name: r.author },
        reviewRating: { '@type': 'Rating', ratingValue: r.rating, bestRating: 5, worstRating: 1 },
        reviewBody: r.text,
        datePublished: r.date,
      }))
    }

    const breadcrumbLdPast = {
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
        {navLabel && <NavLabelSync label={navLabel} />}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(pastJsonLd) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLdPast) }} />

        {/* Dimmed grayscale hero */}
        <div className="relative w-full min-h-[50vh] lg:min-h-[60vh] overflow-hidden">
          <Image
            src={event.image}
            alt={event.title}
            fill
            priority
            quality={85}
            className="object-cover grayscale opacity-25"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/60 to-bg/20" />
          <div className="relative z-10 min-h-[50vh] lg:min-h-[60vh] flex flex-col items-center justify-center text-center px-6 py-16">
            <span className="inline-flex items-center gap-2 border border-white/15 text-cream/50 text-[11px] font-bold uppercase tracking-[0.2em] px-5 py-2 rounded-full mb-6 bg-white/5 backdrop-blur-sm">
              Концерт прошёл
            </span>
            <h1 className="font-serif font-black text-cream/70 text-[clamp(22px,4vw,52px)] leading-tight max-w-3xl mb-5 uppercase">
              {event.title}
            </h1>
            <div className="flex gap-2.5 flex-wrap justify-center opacity-60">
              <MetaPill type="date" variant="glass">{formatDateShort(event.date)}</MetaPill>
              <MetaPill type="time" variant="glass">{event.time}</MetaPill>
              {(event.venueName ?? venue?.name) && (
                <MetaPill type="venue" variant="glass">
                  {[event.venueName ?? venue?.name, event.city].filter(Boolean).join(' · ')}
                </MetaPill>
              )}
            </div>
          </div>
        </div>

        {/* Notice + upcoming events */}
        <div className="px-6 lg:px-16 xl:px-20 py-10 pb-16">
          <div className="max-w-[1400px]">
            <div className="flex gap-4 items-start bg-surface-2 border border-border rounded-xl px-5 py-5 mb-10">
              <div className="shrink-0 mt-0.5 w-10 h-10 flex items-center justify-center rounded-lg bg-white/5 border border-white/10">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-cream/40">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                  <polyline points="9 16 11 18 15 14" />
                </svg>
              </div>
              <div>
                <p className="text-cream font-semibold mb-1">К сожалению, этот концерт уже состоялся</p>
                <p className="text-muted text-sm leading-relaxed">
                  Но мы регулярно организуем новые шоу — среди ближайших событий обязательно найдётся что-то интересное.
                </p>
              </div>
            </div>
            {similar.length > 0 && (
              <>
                <EventRail events={similar} title="Ближайшие концерты" flush />
              </>
            )}
            <a href="/events" className="inline-flex items-center gap-2 text-sm text-red font-semibold hover:brightness-110 transition-all">
              Смотреть все события →
            </a>
          </div>
        </div>
      </>
    )
  }

  // ── UPCOMING EVENT PAGE ───────────────────────────────────────────────────
  const price = minEventPrice(event)
  const offerUrl = event.ticketUrl ?? url
  const ticketOffers = [
    { tier: event.tickets.standard, name: 'Стандарт' },
    { tier: event.tickets.premium, name: 'Премиум' },
    { tier: event.tickets.vip, name: 'VIP' },
  ]
    .filter(({ tier }) => tier.available && tier.price > 0)
    .map(({ tier, name }) => ({
      '@type': 'Offer',
      name,
      price: tier.price,
      priceCurrency: 'RUB',
      availability: 'https://schema.org/InStock',
      url: offerUrl,
    }))

  const locationAddress: Record<string, string> = {
    '@type': 'PostalAddress',
    addressLocality: event.city || 'Москва',
    addressCountry: 'RU',
  }
  if (venue?.address) locationAddress.streetAddress = venue.address

  const rawDescription = event.longDescription ?? event.description
  const description = rawDescription.includes('<')
    ? plainText(rawDescription)
    : rawDescription

  const jsonLd: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Event',
    '@id': url,
    name: event.title,
    url,
    description,
    inLanguage: 'ru',
    ...(event.image
      ? { image: [{ '@type': 'ImageObject', url: event.image, width: 1200, height: 800 }] }
      : {}),
    startDate: `${event.date}T${event.time}:00${TZ}`,
    eventStatus: event.ticketsLeft > 0 ? 'https://schema.org/EventScheduled' : 'https://schema.org/EventSoldOut',
    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
    location: {
      '@type': 'Place',
      name: event.venueName ?? venue?.name ?? event.city,
      address: locationAddress,
    },
    organizer: {
      '@type': 'Organization',
      '@id': `${BASE}/#organization`,
      name: 'Смешно',
      url: BASE,
      email: 'river-show@mail.ru',
    },
    performer: artists.map((a) => ({
      '@type': 'Person',
      '@id': `${BASE}/artists/${a.slug}`,
      name: a.name,
      url: `${BASE}/artists/${a.slug}`,
    })),
  }

  const endDate = calcEndDate(event.date, event.time, event.duration)
  if (endDate) jsonLd.endDate = endDate

  if (ticketOffers.length > 0) jsonLd.offers = ticketOffers

  if (event.rating > 0 && event.reviewsCount > 0) {
    jsonLd.aggregateRating = {
      '@type': 'AggregateRating',
      ratingValue: event.rating,
      reviewCount: event.reviewsCount,
      bestRating: 5,
      worstRating: 1,
    }
  }

  if (event.reviews && event.reviews.length > 0) {
    jsonLd.review = event.reviews.map((r) => ({
      '@type': 'Review',
      author: { '@type': 'Person', name: r.author },
      reviewRating: { '@type': 'Rating', ratingValue: r.rating, bestRating: 5, worstRating: 1 },
      reviewBody: r.text,
      datePublished: r.date,
    }))
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
      {navLabel && <NavLabelSync label={navLabel} />}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />

      <div className="event-detail">
        <div className="event-container">
          <nav className="event-breadcrumb" aria-label="Хлебные крошки"><Link href="/events">Афиша</Link><span>/</span><span>{event.title}</span></nav>
          <EventHero event={event} artists={artists} venue={venue} price={price} />
          <nav className="event-section-nav" aria-label="Разделы концерта"><div><a href="#about">О концерте</a><a href="#venue">Место проведения</a><a href="#important">Важно знать</a></div><EventShare url={url} title={event.title} /></nav>
          <div className="event-body-grid">
            <article id="about">
              <p className="event-eyebrow event-muted">О программе</p>
              <h2>Описание концерта</h2>
              <div className="event-description" dangerouslySetInnerHTML={{ __html: safeHtml(event.longDescription || event.description) }} />
              {event.tags.length > 0 && <div className="event-tags">{event.tags.map(tag => <span key={tag}>{tag}</span>)}</div>}
              {artists.length > 0 && <div className="event-artists"><h3>{artists.length === 1 ? 'На сцене' : 'Состав концерта'}</h3>{artists.map(artist => <Link key={artist.id} className="event-artist" href={`/artists/${artist.slug}`}>
                {artist.photo ? <Image src={artist.photo} alt="" width={48} height={48} sizes="48px" /> : <span className="event-artist-initial">{artist.name[0]}</span>}
                <span><strong>{artist.name}</strong><small>Об артисте и другие концерты</small></span><span>↗</span>
              </Link>)}</div>}
            </article>
            <aside id="important" className="event-important">
              <p className="event-eyebrow event-muted">Перед концертом</p><h2>Хорошо знать</h2>
              {event.time && <div className="event-fact"><span>{event.time}</span><div><h3>Начало программы</h3><p>Приходите заранее. Время открытия дверей проверьте в описании или билете.</p></div></div>}
              {event.ageRestriction && <div className="event-fact"><span>{event.ageRestriction}</span><div><h3>Возрастное ограничение</h3><p>{event.ageRestriction === '18+' ? 'Вход для зрителей от 18 лет. Возьмите документ, удостоверяющий личность.' : 'Учитывайте возрастное ограничение при покупке билетов.'}</p></div></div>}
              {event.duration && <div className="event-fact"><span>{event.duration}</span><div><h3>Продолжительность</h3><p>Планируйте вечер с учётом времени на дорогу.</p></div></div>}
              <Link className="event-contact" href="/contacts">Есть вопросы? <strong>Свяжитесь с нами ↗</strong></Link>
              {otherEvents.length > 0 && <div className="event-other-dates"><OtherDatesPanel events={otherEvents} /></div>}
            </aside>
          </div>
          <section className="event-venue" id="venue" aria-labelledby="event-venue-title"><div><p className="event-eyebrow event-muted">Место встречи</p><h2 id="event-venue-title">{event.venueName || venue?.name || 'Площадка уточняется'}{event.city && <span> · {event.city}</span>}</h2><p>{venue?.address || 'Точный адрес проверьте в билете перед поездкой.'}</p></div>
            {(event.venueName || venue?.name) && <a className="event-outline" href={`https://yandex.ru/maps/?text=${encodeURIComponent([event.city, event.venueName || venue?.name, venue?.address].filter(Boolean).join(', '))}`} target="_blank" rel="noopener noreferrer">Найти на карте ↗</a>}
          </section>
          <section className="event-faq" aria-labelledby="event-faq-title"><h2 id="event-faq-title">Перед покупкой</h2>
            <details><summary>Где посмотреть места и точную цену?<span>+</span></summary><p>Перейдите к билетному оператору через кнопку покупки. Доступные места и итоговая стоимость отображаются перед оплатой.</p></details>
            <details><summary>Какие документы взять с собой?<span>+</span></summary><p>Возьмите билет и документ, удостоверяющий личность. Возрастное ограничение{event.ageRestriction ? ` — ${event.ageRestriction}` : ''} и дополнительные правила указаны в описании мероприятия.</p></details>
            <details><summary>Куда обратиться по вопросу возврата?<span>+</span></summary><p>Обратитесь к оператору, у которого куплен билет. Ссылки на инструкции по возврату находятся внизу сайта. Если нужна помощь, <Link href="/contacts">свяжитесь с нами</Link>.</p></details>
          </section>
          {event.gallery && event.gallery.length >= 3 && <section className="event-extra"><h2>Фото с прошлых шоу</h2><GalleryLightbox images={event.gallery} title={event.title} /></section>}
          {event.reviews && event.reviews.length > 0 && <section className="event-extra"><h2>Отзывы зрителей</h2><div className="grid grid-cols-1 md:grid-cols-3 gap-4">{event.reviews.map(review => <ReviewCard key={review.id} review={review} />)}</div></section>}
          {artists.length > 0 && <div className="event-commission"><p>Стендап на вашем мероприятии</p><CommissionButton artistNames={artists.map(a => a.name)} className="min-h-[48px] px-5 py-3" /></div>}
          {similar.length > 0 && <div className="event-extra"><EventRail events={similar} title="Похожие концерты" flush /></div>}
        </div>
        <StickyBuyBar event={event} minPrice={price} />
      </div>
    </>
  )
}
