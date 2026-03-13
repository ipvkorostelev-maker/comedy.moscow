export const dynamic = 'force-dynamic'

import { getAllEvents, getAllArtists } from '@/lib/data'
import EventCard from '@/components/cards/EventCard'
import ArtistCard from '@/components/cards/ArtistCard'
import SectionHeader from '@/components/ui/SectionHeader'
import HeroSlider from '@/components/sections/HeroSlider'

export default async function HomePage() {
  const [allEvents, artists] = await Promise.all([getAllEvents(), getAllArtists()])

  return (
    <>
      <HeroSlider events={allEvents} />

      {/* ── FEATURED EVENTS ── */}
      <section className="max-w-7xl mx-auto px-6 lg:px-12 pt-16 pb-12">
        <SectionHeader title="Скоро на сцене" linkHref="/events" linkLabel="Все события" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {allEvents.slice(0, 3).map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      </section>

      {/* ── MORE EVENTS ── */}
      {allEvents.length > 3 && (
        <section className="max-w-7xl mx-auto px-6 lg:px-12 py-12 border-t border-border">
          <SectionHeader title="Все мероприятия" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {allEvents.slice(3).map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        </section>
      )}

      {/* ── ARTISTS ── */}
      <section className="max-w-7xl mx-auto px-6 lg:px-12 py-12 border-t border-border">
        <SectionHeader title="Комики" linkHref="/artists" linkLabel="Все артисты" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {artists.slice(0, 4).map((artist) => (
            <ArtistCard key={artist.id} artist={artist} />
          ))}
        </div>
      </section>
    </>
  )
}
