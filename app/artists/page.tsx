import type { Metadata } from 'next'
export const revalidate = 300
import { getAllArtists } from '@/lib/data'
import { BASE } from '@/lib/utils'
import ArtistsClient from '@/components/sections/ArtistsClient'

export const metadata: Metadata = {
  title: 'Стендап комики Москвы и России',
  description: 'Лучшие стендап комики: биографии, рейтинги, расписание выступлений. Артём Волков, Дина Сафина и другие.',
  alternates: { canonical: `${BASE}/artists` },
  openGraph: {
    title: 'Стендап комики России | Артисты | Смешно',
    description: 'Лучшие стендап комики: биографии, рейтинги, расписание выступлений.',
    url: `${BASE}/artists`,
    images: [{ url: `${BASE}/opengraph-image`, width: 1200, height: 630 }],
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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
              { '@type': 'ListItem', position: 1, name: 'Главная', item: BASE },
              { '@type': 'ListItem', position: 2, name: 'Артисты', item: `${BASE}/artists` },
            ],
          }),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'ItemList',
            itemListElement: artists.map((artist, i) => ({
              '@type': 'ListItem',
              position: i + 1,
              url: `${BASE}/artists/${artist.slug}`,
              name: artist.name,
            })),
          }),
        }}
      />
      <ArtistsClient artists={artists} />
    </div>
  )
}
