import Image from 'next/image'
import Link from 'next/link'
import { EnrichedTour } from '@/lib/womanstandup'
import SectionHeader from '@/components/ui/SectionHeader'

interface ToursCarouselProps {
  tours: EnrichedTour[]
}

export default function ToursCarousel({ tours }: ToursCarouselProps) {
  if (tours.length === 0) return null

  return (
    <div>
      <SectionHeader title="Гастроли" />

      {/* ── Mobile: horizontal scroll ── */}
      <div className="flex md:hidden gap-4 overflow-x-auto pb-2" style={{ scrollbarWidth: 'none' }}>
        {tours.map((tour) => (
          <TourCard key={tour.id} tour={tour} />
        ))}
      </div>

      {/* ── Desktop: grid ── */}
      <div className="hidden md:grid grid-cols-3 lg:grid-cols-4 gap-4">
        {tours.map((tour) => (
          <TourCard key={tour.id} tour={tour} />
        ))}
      </div>
    </div>
  )
}

function TourCard({ tour }: { tour: EnrichedTour }) {
  return (
    <Link
      href={`/tour/${tour.slug}`}
      className="group block min-w-[240px] md:min-w-0 rounded-xl overflow-hidden bg-surface border border-border transition-all duration-300 hover:border-white/15 hover:shadow-card-hover"
    >
      <div className="relative aspect-[3/4] overflow-hidden">
        {tour.photo ? (
          <Image
            src={tour.photo}
            alt={tour.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 240px, (max-width: 1024px) 33vw, 25vw"
          />
        ) : (
          <div className="absolute inset-0 bg-zinc-900" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
      </div>

      <div className="p-4">
        <p className="font-serif text-[10px] font-bold tracking-widest uppercase text-red mb-1">
          {tour.artistName}
        </p>
        <p className="text-sm font-bold text-cream leading-tight mb-2 group-hover:text-red transition-colors">
          {tour.title}
        </p>
        <div className="flex flex-wrap gap-x-3 gap-y-0.5 text-xs text-muted">
          <span>{tour.totalConcerts} концертов</span>
          {tour.cities.length > 0 && (
            <span>{tour.cities.slice(0, 3).join(', ')}{tour.cities.length > 3 ? '...' : ''}</span>
          )}
        </div>
      </div>
    </Link>
  )
}
