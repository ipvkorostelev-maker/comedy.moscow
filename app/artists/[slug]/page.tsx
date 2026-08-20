import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import { getArtistBySlug, getAllEvents, getAllArtists } from '@/lib/data'
import { BASE } from '@/lib/utils'
import EventCard from '@/components/cards/EventCard'
import { MicIcon } from '@/components/ui/icons'
import CommissionButton from '@/components/ui/CommissionButton'

export const dynamic = 'force-static'
export const dynamicParams = true

function plainText(html: string): string {
  return html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()
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
  const ogImage = artist.photo
    ? [{ url: artist.photo, width: 600, height: 600, alt: artist.name }]
    : [{ url: `${BASE}/opengraph-image`, width: 1200, height: 630, alt: artist.name }]
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
      images: ogImage,
    },
    twitter: {
      card: 'summary_large_image',
      title: `${artist.name} — стендап комик | Смешно`,
      description: desc,
      images: [artist.photo || `${BASE}/opengraph-image`],
    },
  }
}

export default async function ArtistPage({ params }: { params: { slug: string } }) {
  const [artist, allEvents] = await Promise.all([
    getArtistBySlug(params.slug),
    getAllEvents(),
  ])
  if (!artist) notFound()

  const upcomingEvents = allEvents.filter((e) => e.artistIds.includes(artist.id))
  const cities = artist.city
    ? artist.city
    : [...new Set(upcomingEvents.map((e) => e.city).filter(Boolean))].join(', ')
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
                {upcomingEvents.length > 0 && (
                  <div>
                    <p className="font-serif font-black text-2xl text-cream">{upcomingEvents.length}</p>
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
          {upcomingEvents.length > 0 ? (
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
          ) : (
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
