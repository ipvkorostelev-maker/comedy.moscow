'use client'

import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Event } from '@/lib/types'
import { formatDateShort, formatPrice, minEventPrice } from '@/lib/utils'
import Badge from '@/components/ui/Badge'

interface HeroSliderProps {
  events: Event[]
}

const INTERVAL = 10_000

export default function HeroSlider({ events }: HeroSliderProps) {
  const [current, setCurrent] = useState(0)
  const [prev, setPrev] = useState<number | null>(null)
  const [transitioning, setTransitioning] = useState(false)

  const goTo = useCallback(
    (index: number) => {
      if (transitioning || index === current) return
      setPrev(current)
      setTransitioning(true)
      setCurrent(index)
      setTimeout(() => {
        setPrev(null)
        setTransitioning(false)
      }, 700)
    },
    [current, transitioning]
  )

  useEffect(() => {
    const timer = setInterval(() => {
      goTo((current + 1) % events.length)
    }, INTERVAL)
    return () => clearInterval(timer)
  }, [current, events.length, goTo])

  const event = events[current] ?? events[0]
  if (!event) return null
  const price = minEventPrice(event)

  return (
    <section className="relative h-[75vh] lg:h-[75vh] min-h-[520px] overflow-hidden">
      {/* Background images — crossfade */}
      {events.map((e, i) => (
        <div
          key={e.id}
          className="absolute inset-0 transition-opacity duration-700"
          style={{
            opacity: i === current ? 1 : i === prev ? 0 : 0,
            zIndex: i === current ? 1 : i === prev ? 2 : 0,
          }}
        >
          <Image
            src={e.image}
            alt={e.title}
            fill
            priority={i === 0}
            className="object-cover scale-[1.04]"
            sizes="100vw"
          />
        </div>
      ))}

      {/* Overlays */}
      <div className="absolute inset-0 z-10 bg-[linear-gradient(to_top,rgba(12,12,15,0.95)_0%,rgba(12,12,15,0.3)_40%,transparent_70%)]" />
      <div className="absolute inset-0 z-10 bg-[linear-gradient(to_bottom,rgba(12,12,15,0.5)_0%,transparent_18%)]" />
      {/* Bottom fade into page background */}
      <div className="absolute bottom-0 left-0 right-0 h-32 z-10 bg-gradient-to-t from-bg to-transparent" />

      {/* Content */}
      <div className="absolute inset-0 z-20 flex flex-col justify-end px-6 lg:px-16 pb-12">
        <div className="flex flex-wrap gap-2 mb-4">
          {event.featured && <Badge variant="red">🔥 Хит сезона</Badge>}
          <Badge variant="gold">★ {event.rating}</Badge>
          <Badge variant="dark">{event.ageRestriction}</Badge>
          <Badge variant="dark">{event.duration}</Badge>
          {event.ticketsLeft < 25 && (
            <Badge variant="dark">Осталось {event.ticketsLeft} мест</Badge>
          )}
        </div>

        <h1
          key={event.id}
          className="font-serif font-black text-cream leading-[0.93] tracking-[-0.02em] text-[clamp(28px,3.8vw,52px)] mb-3 animate-fade-up"
        >
          {event.title}
          {event.subtitle && <em className="text-red italic block">{event.subtitle}</em>}
        </h1>

        <div className="flex flex-wrap gap-2 items-center mb-6">
          <span className="flex items-center gap-1.5 bg-white/10 backdrop-blur-sm border border-white/15 text-cream text-xs font-medium px-3 py-1.5 rounded-full">
            📅 {formatDateShort(event.date)}
          </span>
          <span className="flex items-center gap-1.5 bg-white/10 backdrop-blur-sm border border-white/15 text-cream text-xs font-medium px-3 py-1.5 rounded-full">
            🕗 {event.time}
          </span>
          <span className="flex items-center gap-1.5 bg-white/10 backdrop-blur-sm border border-white/15 text-cream text-xs font-medium px-3 py-1.5 rounded-full">
            📍 {event.city}
          </span>
          {event.rating > 0 && (
            <span className="flex items-center gap-1 text-gold text-xs font-semibold px-1">
              ★ {event.rating}
              <span className="text-muted font-normal">({event.reviewsCount})</span>
            </span>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <div className="flex gap-3">
            <Link
              href={`/events/${event.slug}`}
              className="flex items-center gap-2.5 bg-cream text-bg text-sm font-bold px-7 py-3.5 rounded-lg hover:opacity-88 transition-opacity"
            >
              <span className="w-5 h-5 bg-bg rounded-full flex items-center justify-center text-[8px]">▶</span>
              Подробнее
            </Link>
            <Link
              href={`/events/${event.slug}`}
              className="bg-red text-white text-sm font-bold px-7 py-3.5 rounded-lg hover:opacity-85 transition-all shadow-[0_4px_28px_rgba(212,66,30,0.35)]"
            >
              Купить билет →
            </Link>
          </div>

          {/* Dots */}
          <div className="flex items-center gap-2 ml-2">
            {events.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                className="relative h-0.5 rounded-full overflow-hidden transition-all duration-300"
                style={{ width: i === current ? 28 : 16 }}
                aria-label={`Слайд ${i + 1}`}
              >
                <span className="absolute inset-0 bg-cream/25 rounded-full" />
                {i === current && (
                  <span
                    className="absolute inset-y-0 left-0 bg-cream rounded-full"
                    style={{
                      animation: `progress ${INTERVAL}ms linear forwards`,
                    }}
                  />
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Float card — desktop */}
      <div className="hidden lg:block absolute right-16 bottom-12 z-20 bg-surface/90 backdrop-blur-xl border border-border rounded-2xl p-6 min-w-[240px]">
        <p className="text-[9px] uppercase tracking-[0.16em] text-muted mb-1">Цена билета</p>
        <p className="font-serif font-black text-3xl text-cream mb-1">
          {formatPrice(price)}{' '}
          <span className="text-sm font-sans font-normal text-muted">/ чел</span>
        </p>
        {event.ticketsLeft < 25 && (
          <p className="text-[11px] text-gold font-semibold mb-5">⚡ Осталось {event.ticketsLeft} мест</p>
        )}
        <Link
          href={`/events/${event.slug}`}
          className="block w-full text-center bg-red text-white text-sm font-bold py-3 rounded-lg hover:opacity-85 transition-all shadow-[0_4px_20px_rgba(212,66,30,0.35)] mb-2.5"
        >
          Купить билет
        </Link>
        <Link
          href={`/events/${event.slug}`}
          className="block w-full text-center text-muted text-xs py-2.5 rounded-lg border border-border hover:text-cream hover:border-muted transition-all"
        >
          Подробнее
        </Link>
      </div>

      <style>{`
        @keyframes progress {
          from { width: 0% }
          to   { width: 100% }
        }
      `}</style>
    </section>
  )
}
