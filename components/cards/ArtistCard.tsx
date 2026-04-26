import Image from 'next/image'
import Link from 'next/link'
import { Artist } from '@/lib/types'
import { MicIcon } from '@/components/ui/icons'

interface ArtistCardProps {
  artist: Artist
}

export default function ArtistCard({ artist }: ArtistCardProps) {
  return (
    <Link href={`/artists/${artist.slug}`} className="group block">
      <div className="relative aspect-square overflow-hidden rounded-xl bg-surface border border-border mb-3">
        {artist.photo ? (
          <Image
            src={artist.photo}
            alt={artist.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 50vw, 25vw"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-muted">
            <MicIcon className="w-12 h-12" />
          </div>
        )}

        <div className="absolute bottom-0 left-0 right-0 p-3">
          <p className="text-[9px] font-bold tracking-widest uppercase text-red mb-0.5">
            {artist.role}
          </p>
          <p className="text-sm font-bold text-cream leading-tight">{artist.name}</p>
        </div>
      </div>
    </Link>
  )
}
