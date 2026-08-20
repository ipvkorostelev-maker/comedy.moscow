import Image from 'next/image'
import Link from 'next/link'
import { Artist } from '@/lib/types'
import { MicIcon } from '@/components/ui/icons'

interface ArtistCardProps {
  artist: Artist
}

export default function ArtistCard({ artist }: ArtistCardProps) {
  return (
    <Link
      href={`/artists/${artist.slug}`}
      aria-label={artist.name}
      className="group flex flex-col h-full w-full shadow-none transition-[transform,box-shadow] duration-200 hover:shadow-[0_18px_40px_-12px_rgba(0,0,0,0.75),0_8px_24px_-8px_rgba(255,77,0,0.10)]"
    >
      <div className="relative aspect-[3/4] overflow-hidden rounded-lg img-loading-container mb-3">
        {artist.photo ? (
          <>
            <Image
              src={artist.photo}
              alt={artist.name}
              fill
              className="object-cover transition-transform duration-200 group-hover:scale-[1.03]"
              sizes="(max-width: 768px) 40vw, 200px"
            />
            <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/80 via-black/40 to-transparent pointer-events-none" />
          </>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-surface-2 text-muted">
            <MicIcon className="w-12 h-12" />
          </div>
        )}
      </div>
      <p className="font-bold text-sm text-cream group-hover:text-red transition-colors duration-200 leading-tight">
        {artist.name}
      </p>
      <p className="text-[11px] text-muted mt-0.5">{artist.role}</p>
    </Link>
  )
}
