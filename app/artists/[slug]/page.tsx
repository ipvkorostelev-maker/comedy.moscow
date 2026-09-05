import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { getArtistBySlug, getAllEvents, getAllArtists } from '@/lib/data'
import { getArtistTourShows } from '@/lib/womanstandup'
import { BASE, pluralForm } from '@/lib/utils'
import EventCard from '@/components/cards/EventCard'
import { MicIcon } from '@/components/ui/icons'
import CommissionButton from '@/components/ui/CommissionButton'

export const dynamic = 'force-static'
export const dynamicParams = true

function plainText(html: string): string {
  return html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()
}

function formatShowDate(dateISO: string): string {
  return new Date(`${dateISO}T12:00:00`).toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
  })
}

export async function generateStaticParams() {
  const artists = await getAllArtists()
  return artists.map((a) => ({ slug: a.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string }
}): Promise<Metadata> {
  const artist = await getArtistBySlug(params.slug)
  // notFound() в metadata выполняется до стриминга ответа и отдаёт честный 404
  if (!artist) notFound()
  const url = `${BASE}/artists/${artist.slug}`
  const desc = plainText(artist.shortBio || artist.bio || '') ||
    `Стендап-комик ${artist.name}. Расписание выступлений, афиша концертов и билеты на шоу с участием ${artist.name}.`
  const ogImage = `${url}/opengraph-image`
  return {
    title: `${artist.name} — стендап комик`,
    description: desc,
    alternates: { canonical: url },
    openGraph: {
      title: `${artist.name} — стендап комик`,
      description: desc,
      url,
      siteName: 'Смешно',
      locale: 'ru_RU',
      images: [{ url: ogImage, width: 1200, height: 630, alt: artist.name }],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${artist.name} — стендап комик | Смешно`,
      description: desc,
      images: [ogImage],
    },
  }
}

export default async function ArtistPage({ params }: { params: { slug: string } }) {
  const artist = await getArtistBySlug(params.slug)
  if (!artist) notFound()

  const [allEvents, artistTours] = await Promise.all([
    getAllEvents(),
    getArtistTourShows(artist.id),
  ])

  const upcomingEvents = allEvents.filter((e) => e.artistIds.includes(artist.id))
  const tourShows = artistTours.flatMap((t) => t.shows)
  const totalUpcoming = upcomingEvents.length + tourShows.length

  const eventCities = [...new Set(upcomingEvents.map((e) => e.city).filter(Boolean))]
  const tourCities = [...new Set(tourShows.map((s) => s.city).filter(Boolean))]
  const allCities = [...new Set([...eventCities, ...tourCities])]
  const cities = artist.city
    ? artist.city
    : allCities.length > 3
      ? `${allCities.slice(0, 2).join(', ')} и ещё ${allCities.length - 2} ${['город', 'города', 'городов'][pluralForm(allCities.length - 2)]}`
      : allCities.join(', ')
  const url = `${BASE}/artists/${artist.slug}`

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    '@id': url,
    name: artist.name,
    url,
    description: plainText(artist.bio || artist.shortBio || ''),
    ...(artist.photo
      ? { image: { '@type': 'ImageObject', url: artist.photo, width: 600, height: 600 } }
      : {}),
    jobTitle: artist.role,
    ...(artist.city ? { homeLocation: { '@type': 'City', name: artist.city.split(',')[0]!.trim() } } : {}),
  }

  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Главная', item: BASE },
      { '@type': 'ListItem', position: 2, name: 'Артисты', item: `${BASE}/artists` },
      { '@type': 'ListItem', position: 3, name: artist.name, item: url },
    ],
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />

      <div className="pt-24">
        <div className="max-w-5xl mx-auto px-6 lg:px-12 py-12">

          {/* ── PROFILE ── */}
          <div className="flex flex-col md:flex-row gap-10 mb-16">
            <div className="relative w-full md:w-72 h-80 md:aspect-square flex-shrink-0 rounded-2xl overflow-hidden bg-surface flex items-center justify-center">
              {artist.photo ? (
                <Image
                  src={artist.photo}
                  alt={`${artist.name} — стендап комик`}
                  fill
                  priority
                  className="object-cover"
                  sizes="300px"
                />
              ) : (
                <MicIcon className="w-16 h-16 text-muted" />
              )}
            </div>

            <div className="flex flex-col justify-center">
              <p className="text-[10px] font-bold uppercase tracking-widest text-red mb-3">
                {artist.role}
              </p>
              <h1 className="font-serif font-black text-4xl lg:text-5xl text-cream mb-4 leading-tight">
                {artist.name}
              </h1>
              <p className="text-cream/70 text-sm leading-relaxed mb-8 max-w-lg">{artist.bio}</p>

              <div className="flex gap-8">
                {totalUpcoming > 0 && (
                  <div>
                    <p className="font-serif font-black text-2xl text-cream">{totalUpcoming}</p>
                    <p className="text-[11px] text-muted uppercase tracking-wider mt-0.5">Выступления</p>
                  </div>
                )}
                {cities && (
                  <div>
                    <p className="font-serif font-black text-2xl text-cream">{cities}</p>
                    <p className="text-[11px] text-muted uppercase tracking-wider mt-0.5">Город</p>
                  </div>
                )}
              </div>

              <div className="mt-6">
                <CommissionButton
                  artistNames={[artist.name]}
                  className="px-5 py-2.5"
                />
              </div>
            </div>
          </div>

          {/* ── UPCOMING EVENTS ── */}
          {upcomingEvents.length > 0 && (
            <div>
              <h2 className="font-serif font-bold text-xl text-cream mb-6">
                Ближайшие выступления
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {upcomingEvents.map((event) => (
                  <EventCard key={event.id} event={event} />
                ))}
              </div>
            </div>
          )}

          {/* ── TOURS ── */}
          {artistTours.length > 0 && (
            <div className={upcomingEvents.length > 0 ? 'mt-12' : ''}>
              <h2 className="font-serif font-bold text-xl text-cream mb-6">
                Гастроли
              </h2>
              {artistTours.map((tour) => (
                <div
                  key={tour.id}
                  className="border border-border rounded-2xl bg-surface-2 mb-5 overflow-hidden"
                >
                  <div className="flex items-center justify-between gap-3 px-6 py-4 border-b border-border">
                    <h3 className="font-serif font-bold text-cream">{tour.title}</h3>
                    <Link
                      href={`/tour/${tour.slug}`}
                      className="text-sm text-red font-semibold hover:brightness-110 transition-all shrink-0"
                    >
                      Страница тура →
                    </Link>
                  </div>
                  <ul>
                    {tour.shows.map((show, i) => (
                      <li
                        key={show.id}
                        className={`flex flex-wrap items-center gap-x-4 gap-y-2 px-6 py-3.5 ${i > 0 ? 'border-t border-white/5' : ''}`}
                      >
                        <span className="text-sm text-cream/70 w-32 shrink-0">
                          {formatShowDate(show.dateISO)}
                        </span>
                        <div className="flex-1 min-w-[160px]">
                          <p className="font-medium text-[15px] text-cream leading-tight">
                            {show.city}
                          </p>
                          {show.venue && (
                            <p className="text-xs text-muted truncate mt-0.5">{show.venue}</p>
                          )}
                        </div>
                        {show.href.startsWith('http') ? (
                          <a
                            href={show.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="shrink-0 px-6 py-2.5 rounded-full text-[11px] font-bold tracking-widest uppercase text-white bg-red hover:brightness-110 shadow-red-sm transition-all duration-150"
                          >
                            Купить билет
                          </a>
                        ) : (
                          <Link
                            href={show.href}
                            className="shrink-0 px-6 py-2.5 rounded-full text-[11px] font-bold tracking-widest uppercase text-white bg-red hover:brightness-110 shadow-red-sm transition-all duration-150"
                          >
                            Купить билет
                          </Link>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}

          {totalUpcoming === 0 && (
            <div className="border border-border rounded-2xl bg-surface-2 px-6 py-10 text-center">
              <p className="text-cream font-semibold mb-1">Нет запланированных выступлений</p>
              <p className="text-muted text-sm mb-6">
                Анонсы концертов с участием {artist.name} скоро появятся.
              </p>
              <a
                href="/events"
                className="inline-flex items-center gap-2 text-sm text-red font-semibold hover:brightness-110 transition-all"
              >
                Смотреть все события →
              </a>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
