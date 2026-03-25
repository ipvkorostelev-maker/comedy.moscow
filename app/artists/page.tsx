import type { Metadata } from 'next'
export const dynamic = 'force-static'
import { getAllArtists } from '@/lib/data'
import ArtistCard from '@/components/cards/ArtistCard'

export const metadata: Metadata = {
  title: 'Стендап комики Москвы и России',
  description: 'Лучшие стендап комики: биографии, рейтинги, расписание выступлений. Артём Волков, Дина Сафина и другие.',
  alternates: { canonical: 'https://comedy.moscow/artists' },
  openGraph: {
    title: 'Стендап комики России | Артисты | Смешно',
    description: 'Лучшие стендап комики: биографии, рейтинги, расписание выступлений.',
    url: 'https://comedy.moscow/artists',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Стендап комики России | Смешно',
    description: 'Биографии, рейтинги и расписание выступлений.',
  },
}

export default async function ArtistsPage() {
  const artists = await getAllArtists()

  return (
    <div className="pt-8">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="py-12 border-b border-border mb-10">
          <h1 className="font-serif font-black text-4xl lg:text-5xl text-cream mb-3">Артисты</h1>
          <p className="text-muted text-sm">{artists.length} комиков</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 pb-16">
          {artists.map((artist) => (
            <ArtistCard key={artist.id} artist={artist} />
          ))}
        </div>
      </div>
    </div>
  )
}
