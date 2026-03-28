export const revalidate = 3600 // перегенерировать раз в час

import type { Metadata } from 'next'
import { getAllEvents, getAllArtists } from '@/lib/data'
import ArtistCard from '@/components/cards/ArtistCard'
import SectionHeader from '@/components/ui/SectionHeader'
import HeroSlider from '@/components/sections/HeroSlider'
import HomeEventsSection from '@/components/sections/HomeEventsSection'

export const metadata: Metadata = {
  alternates: { canonical: 'https://comedy.moscow' },
}

export default async function HomePage() {
  const [allEvents, artists] = await Promise.all([getAllEvents(), getAllArtists()])

  return (
    <>
      {/* Invisible H1 for SEO — visual title lives in the hero slider */}
      <h1 className="sr-only">Смешно — стендап-концерты в Москве и Санкт-Петербурге</h1>

      {/* 4 nearest upcoming concerts in hero */}
      <HeroSlider events={allEvents.slice(0, 4)} />

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
