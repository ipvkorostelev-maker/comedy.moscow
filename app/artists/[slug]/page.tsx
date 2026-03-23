import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import { getArtistBySlug, getAllEvents } from '@/lib/data'
import EventCard from '@/components/cards/EventCard'
import { MicIcon } from '@/components/ui/icons'

export const revalidate = 60

export async function generateMetadata({
  params,
}: {
  params: { slug: string }
}): Promise<Metadata> {
  const artist = await getArtistBySlug(params.slug)
  if (!artist) return {}
  return {
    title: artist.name,
    description: artist.shortBio,
    openGraph: { images: [{ url: artist.photo }] },
  }
}

export default async function ArtistPage({ params }: { params: { slug: string } }) {
  const [artist, allEvents] = await Promise.all([
    getArtistBySlug(params.slug),
    getAllEvents(),
  ])
  if (!artist) notFound()

  const upcomingEvents = allEvents.filter((e) => artist.upcomingEventIds.includes(e.id))

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: artist.name,
    description: artist.bio,
    image: artist.photo,
    jobTitle: artist.role,
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div className="pt-24">
        <div className="max-w-5xl mx-auto px-6 lg:px-12 py-12">

          {/* ── PROFILE ── */}
          <div className="flex flex-col md:flex-row gap-10 mb-16">
            <div className="relative w-full md:w-72 h-80 md:aspect-square flex-shrink-0 rounded-2xl overflow-hidden bg-surface flex items-center justify-center">
              {artist.photo ? (
                <Image
                  src={artist.photo}
                  alt={artist.name}
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
                <div>
                  <p className="font-serif font-black text-2xl text-cream">{artist.totalShows}</p>
                  <p className="text-[11px] text-muted uppercase tracking-wider mt-0.5">Шоу</p>
                </div>
                <div>
                  <p className="font-serif font-black text-2xl text-gold">★ {artist.rating}</p>
                  <p className="text-[11px] text-muted uppercase tracking-wider mt-0.5">Рейтинг</p>
                </div>
                <div>
                  <p className="font-serif font-black text-2xl text-cream">{artist.city}</p>
                  <p className="text-[11px] text-muted uppercase tracking-wider mt-0.5">Город</p>
                </div>
              </div>
            </div>
          </div>

          {/* ── UPCOMING EVENTS ── */}
          {upcomingEvents.length > 0 && (
            <div>
              <h2 className="font-serif font-bold text-xl text-cream mb-6">
                Ближайшие выступления
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {upcomingEvents.map((event) => (
                  <EventCard key={event.id} event={event} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
