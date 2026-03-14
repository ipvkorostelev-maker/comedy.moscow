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
    <section className="relative min-h-[560px] lg:h-[50vh] bg-bg overflow-hidden pt-16">

      {/* Image — full bleed on mobile, right panel on desktop */}
      <div className="absolute inset-0 lg:left-[45%] lg:right-0 lg:inset-y-0">
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
              className="object-cover object-center"
              sizes="(max-width: 1024px) 100vw, 55vw"
            />
          </div>
        ))}

        {/* Desktop: gradient fade on left edge */}
        <div className="hidden lg:block absolute inset-y-0 left-0 w-64 z-10 bg-gradient-to-r from-bg to-transparent" />
        {/* Desktop: subtle top/bottom fades */}
        <div className="hidden lg:block absolute inset-x-0 top-0 h-24 z-10 bg-gradient-to-b from-bg to-transparent" />
        <div className="hidden lg:block absolute inset-x-0 bottom-0 h-24 z-10 bg-gradient-to-t from-bg to-transparent" />

        {/* Mobile: bottom-heavy overlay */}
        <div className="lg:hidden absolute inset-0 z-10 bg-[linear-gradient(to_top,rgba(12,12,15,0.97)_0%,rgba(12,12,15,0.4)_45%,rgba(12,12,15,0.2)_70%)]" />
        <div className="lg:hidden absolute inset-0 z-10 bg-[linear-gradient(to_bottom,rgba(12,12,15,0.5)_0%,transparent_20%)]" />
      </div>

      {/* Content — left side on desktop, bottom on mobile */}
      <div className="relative z-20 h-full flex flex-col justify-end lg:justify-center px-6 lg:px-16 pb-12 lg:pb-0 lg:max-w-[52%]">

        {/* Badges */}
        <div className="flex flex-wrap gap-2 mb-4">
          {event.featured && <Badge variant="red">🔥 Хит сезона</Badge>}
          {event.rating > 0 && <Badge variant="gold">★ {event.rating}</Badge>}
          <Badge variant="dark">{event.ageRestriction}</Badge>
          {event.duration && <Badge variant="dark">{event.duration}</Badge>}
          {event.ticketsLeft < 25 && (
            <Badge variant="dark">Осталось {event.ticketsLeft} мест</Badge>
          )}
        </div>

        {/* Title */}
        <h1
          key={event.id}
          className="font-serif font-black text-cream leading-[0.93] tracking-[-0.02em] text-[clamp(28px,3.8vw,56px)] mb-2 animate-fade-up"
        >
          {event.title}
        </h1>
        {event.subtitle && (
          <p className="text-red italic font-serif text-[clamp(13px,1.6vw,22px)] mt-3 mb-4 max-w-[50%]">
            {event.subtitle}
          </p>
        )}

        {/* Date / time / city pills */}
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
        </div>

        {/* Price (desktop only) */}
        {price > 0 && (
          <p className="hidden lg:block text-muted text-xs uppercase tracking-widest mb-1">Цена от</p>
        )}
        {price > 0 && (
          <p className="hidden lg:block font-serif font-black text-4xl text-cream mb-6">
            {formatPrice(price)}
          </p>
        )}

        {/* Buttons + dots */}
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex gap-3">
            <Link
              href={`/events/${event.slug}`}
              className="bg-red text-white text-sm font-bold px-7 py-3.5 rounded-lg hover:opacity-85 transition-all shadow-[0_4px_28px_rgba(212,66,30,0.35)]"
            >
              Купить билет →
            </Link>
            <Link
              href={`/events/${event.slug}`}
              className="flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/15 text-cream text-sm font-medium px-6 py-3.5 rounded-lg hover:bg-white/15 transition-all"
            >
              Подробнее
            </Link>
          </div>

          {/* Dots */}
          {events.length > 1 && (
            <div className="flex items-center gap-2 ml-1">
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
                      style={{ animation: `progress ${INTERVAL}ms linear forwards` }}
                    />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
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
