import Image from 'next/image'
import Link from 'next/link'
import { Event } from '@/lib/types'
import { formatPrice, minEventPrice } from '@/lib/utils'

interface MainEventsProps {
  events: Event[]
}

export default function MainEvents({ events }: MainEventsProps) {
  if (events.length === 0) return null

  return (
    <section className="max-w-[1440px] mx-auto pt-12 lg:pt-16 px-6 lg:px-12">
      <div
        className="relative overflow-hidden rounded-2xl border border-red/15 px-5 py-7 lg:px-10 lg:py-10"
        style={{ background: 'linear-gradient(180deg, #201209 0%, #15100B 55%, #0A0A0A 100%)' }}
      >
        {/* Тёплое свечение блока */}
        <div
          className="pointer-events-none absolute -top-28 -right-16 h-[340px] w-[520px] rounded-full blur-[110px] opacity-60"
          style={{ background: 'rgba(255,77,0,0.16)' }}
          aria-hidden
        />
        <div
          className="pointer-events-none absolute -bottom-32 -left-20 h-[300px] w-[440px] rounded-full blur-[110px] opacity-40"
          style={{ background: 'rgba(255,184,0,0.10)' }}
          aria-hidden
        />

        <div className="relative mb-6 lg:mb-8 flex items-end justify-between gap-4">
          <div>
            <p className="text-[11px] uppercase tracking-[0.2em] text-red font-bold mb-2">Не пропустите</p>
            <h2 className="font-serif font-black text-cream uppercase text-2xl lg:text-3xl">Главные события</h2>
          </div>
          <Link
            href="/events"
            className="shrink-0 text-sm text-muted hover:text-cream transition-colors duration-200"
          >
            Все события →
          </Link>
        </div>

        <div className="relative grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-5">
          {events.map((event) => (
            <MainEventCard key={event.id} event={event} />
          ))}
        </div>
      </div>
    </section>
  )
}

function MainEventCard({ event }: { event: Event }) {
  const price = minEventPrice(event)
  const dayMonth = new Date(event.date)
    .toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' })
    .replace('.', '')

  return (
    <Link
      href={`/events/${event.slug}`}
      aria-label={event.title}
      className="group relative block overflow-hidden rounded-xl border border-white/10 bg-surface-elevated transition-all duration-300 hover:-translate-y-1 hover:border-red/60 hover:shadow-[0_20px_50px_-16px_rgba(0,0,0,0.9),0_10px_30px_-12px_rgba(255,77,0,0.35)]"
    >
      <div className="relative aspect-[3/4] overflow-hidden img-loading-container">
        <Image
          src={event.image}
          alt={event.title}
          fill
          className="object-cover object-center transition-transform duration-500 group-hover:scale-[1.06]"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
        {/* Градиент снизу для читаемости текста */}
        <div className="absolute inset-x-0 bottom-0 h-3/4 bg-gradient-to-t from-black/95 via-black/55 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-transparent via-transparent to-black/25" />

        {/* Дата и время — акцент */}
        <div className="absolute top-3 left-3 rounded-lg bg-red px-3 py-2 text-center leading-none shadow-red">
          <p className="text-[10px] font-bold uppercase tracking-wide text-white/90 mb-1">{dayMonth}</p>
          <p className="font-serif font-black text-white text-lg leading-none">{event.time}</p>
        </div>

        {/* Контент поверх изображения */}
        <div className="absolute inset-x-0 bottom-0 p-4 lg:p-5">
          <h3 className="font-serif font-black text-cream uppercase leading-tight line-clamp-2 text-lg lg:text-xl mb-2">
            {event.title}
          </h3>
          {(event.venueName || event.city) && (
            <p className="text-xs text-cream/60 line-clamp-1 mb-3">
              {[event.venueName, event.city].filter(Boolean).join(' · ')}
            </p>
          )}

          <div className="flex items-center justify-between gap-3">
            {price > 0 ? (
              <p className="font-serif font-black text-red text-lg whitespace-nowrap">от {formatPrice(price)}</p>
            ) : (
              <span />
            )}
            <span className="inline-flex items-center justify-center min-h-[44px] px-4 bg-red group-hover:bg-red-hover text-white text-sm font-bold rounded-lg shadow-red-sm transition-colors duration-200 whitespace-nowrap">
              Купить билеты
            </span>
          </div>
        </div>
      </div>
    </Link>
  )
}
