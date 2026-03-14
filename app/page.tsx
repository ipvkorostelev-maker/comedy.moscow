export const dynamic = 'force-dynamic'

import { getAllEvents, getAllArtists } from '@/lib/data'
import ArtistCard from '@/components/cards/ArtistCard'
import SectionHeader from '@/components/ui/SectionHeader'
import HeroSlider from '@/components/sections/HeroSlider'
import HomeEventsSection from '@/components/sections/HomeEventsSection'

export default async function HomePage() {
  const [allEvents, artists] = await Promise.all([getAllEvents(), getAllArtists()])

  return (
    <>
      <HeroSlider events={allEvents} />

      <HomeEventsSection events={allEvents} />

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
