import Image from 'next/image'
import Link from 'next/link'
import { EnrichedTour } from '@/lib/womanstandup'

interface ToursCarouselProps {
  tours: EnrichedTour[]
}

export default function ToursCarousel({ tours }: ToursCarouselProps) {
  if (tours.length === 0) return null

  return (
    <section>
      <div className="mb-5 px-6 lg:px-12">
        <h2 className="font-serif font-black text-cream uppercase text-2xl lg:text-3xl">Гастроли</h2>
        <p className="text-sm text-muted mt-1">Стендап-комики едут в ваш город</p>
      </div>

      {/* Mobile */}
      <div className="flex md:hidden gap-4 overflow-x-auto scrollbar-hide snap-x snap-mandatory touch-pan-xy px-6 pb-2 scroll-pl-6">
        {tours.map((tour) => (
          <TourCard key={tour.id} tour={tour} />
        ))}
      </div>

      {/* Desktop */}
      <div className="hidden md:grid md:grid-cols-3 xl:grid-cols-4 gap-5 px-6 lg:px-12">
        {tours.map((tour) => (
          <TourCard key={tour.id} tour={tour} />
        ))}
      </div>
    </section>
  )
}

function TourCard({ tour }: { tour: EnrichedTour }) {
  const cityLine = tour.cities.slice(0, 3).join(' · ')

  return (
    <Link
      href={`/tour/${tour.slug}`}
      aria-label={tour.title}
      className="group flex flex-col h-full w-[62vw] max-w-[280px] md:w-full md:max-w-none shrink-0 snap-start transition-transform duration-200 hover:-translate-y-0.5"
    >
      {/* Вертикальный постер — изображение целиком, без подписей поверх */}
      <div className="relative aspect-[3/4] overflow-hidden rounded-lg img-loading-container mb-3 bg-surface-2">
        {tour.photo ? (
          <Image
            src={tour.photo}
            alt={tour.title}
            fill
            className="object-cover object-center transition-transform duration-200 group-hover:scale-[1.03]"
            sizes="(max-width: 768px) 62vw, (max-width: 1280px) 33vw, 25vw"
          />
        ) : (
          <div className="img-placeholder" />
        )}
      </div>

      {/* Текст под изображением */}
      <div className="flex flex-col">
        <p className="text-[11px] uppercase tracking-widest text-red font-bold mb-1">
          {tour.artistName}
        </p>
        <p className="font-serif font-black text-lg text-cream uppercase leading-tight mb-1.5 line-clamp-2 group-hover:text-red transition-colors duration-200">
          {tour.title}
        </p>
        <p className="text-xs text-muted mb-1">
          {tour.totalConcerts} концертов · {tour.cities.length} городов
        </p>
        {cityLine && <p className="text-xs text-muted line-clamp-1 mb-2">{cityLine}</p>}
        <p className="text-sm text-cream/80 group-hover:text-red transition-colors duration-200">
          Смотреть тур →
        </p>
      </div>
    </Link>
  )
}
