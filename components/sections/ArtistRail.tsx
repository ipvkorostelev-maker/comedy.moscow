import Link from 'next/link'
import { Artist } from '@/lib/types'
import ArtistCard from '@/components/cards/ArtistCard'

interface ArtistRailProps {
  artists: Artist[]
}

export default function ArtistRail({ artists }: ArtistRailProps) {
  if (artists.length === 0) return null

  return (
    <section>
      <div className="flex items-end justify-between mb-4 px-6 lg:px-12">
        <h2 className="font-serif font-black text-cream uppercase text-xl lg:text-2xl">Артисты</h2>
        <Link
          href="/artists"
          className="text-sm text-muted hover:text-cream transition-colors duration-200"
        >
          Все артисты →
        </Link>
      </div>
      <div className="flex gap-4 overflow-x-auto scrollbar-hide snap-x snap-mandatory pb-2 touch-pan-xy px-6 lg:px-12">
        {artists.map((artist) => (
          <div
            key={artist.id}
            className="shrink-0 snap-start w-[38vw] sm:w-[22vw] md:w-[16vw] lg:w-[12.5%] xl:w-[11%]"
          >
            <ArtistCard artist={artist} />
          </div>
        ))}
      </div>
    </section>
  )
}
