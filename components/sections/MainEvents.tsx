import Image from 'next/image'
import Link from 'next/link'
import { Event } from '@/lib/types'
import { cn, eventTimes, formatDateShort, formatPrice, minEventPrice } from '@/lib/utils'

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
  const dayShort = new Date(event.date).toLocaleDateString('ru-RU', { weekday: 'short' })
  const times = eventTimes(event)

  return (
    <Link
      href={`/events/${event.slug}`}
      aria-label={event.title}
      className="group flex flex-col h-full overflow-hidden rounded-xl border border-white/10 bg-surface-elevated transition-all duration-300 hover:-translate-y-1 hover:border-red/60 hover:shadow-[0_20px_50px_-16px_rgba(0,0,0,0.9),0_10px_30px_-12px_rgba(255,77,0,0.35)]"
    >
      {/* Изображение 3:2 — как в «Расписании» */}
      <div className="relative aspect-[3/2] overflow-hidden img-loading-container">
        <Image
          src={event.image}
          alt={event.title}
          fill
          className="object-cover object-center transition-transform duration-500 group-hover:scale-[1.04]"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
      </div>

      {/* Текст под изображением */}
      <div className="flex flex-col flex-1 p-4 lg:p-5">
        <p className="text-[11px] uppercase tracking-wide text-muted mb-1.5">
          {dayShort} · {formatDateShort(event.date)}
        </p>
        <h3 className="font-oswald font-black text-lg lg:text-xl leading-tight text-cream uppercase line-clamp-2 group-hover:text-red transition-colors duration-200 mb-2">
          {event.title}
        </h3>

        <div className="flex items-center gap-2 mb-2.5">
          <span className="inline-flex items-center whitespace-nowrap rounded-md bg-red px-2.5 py-1.5 font-oswald font-black text-cream leading-none shadow-red-sm">
            {times.map((t, i) => (
              <span key={t} className={cn(i > 0 && 'opacity-80', 'text-sm')}>
                {i > 0 && <span className="opacity-60 mx-1">·</span>}
                {t}
              </span>
            ))}
          </span>
          {(event.venueName || event.city) && (
            <p className="text-xs text-muted line-clamp-1">
              {[event.venueName, event.city].filter(Boolean).join(' · ')}
            </p>
          )}
        </div>

        <div className="mt-auto flex items-center justify-between gap-3 pt-1">
          {price > 0 ? (
            <p className="font-oswald font-black text-red text-lg whitespace-nowrap">от {formatPrice(price)}</p>
          ) : (
            <span />
          )}
          <span className="inline-flex items-center justify-center min-h-[44px] px-4 bg-red group-hover:bg-red-hover text-white text-sm font-bold rounded-lg shadow-red-sm transition-colors duration-200 whitespace-nowrap">
            Купить билеты
          </span>
        </div>
      </div>
    </Link>
  )
}
