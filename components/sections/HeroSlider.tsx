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

  const images = (
    <>
      {events.map((e, i) => (
        <div
          key={e.id}
          className="absolute inset-0 transition-opacity duration-700"
          style={{
            opacity: i === current ? 1 : i === prev ? 0 : 0,
            zIndex: i === current ? 1 : i === prev ? 2 : 0,
          }}
        >
          <div
            key={i === current ? `kb-${current}` : `kb-idle-${i}`}
            className="absolute inset-0"
            style={i === current ? { animation: `kenBurns ${INTERVAL}ms ease-out forwards` } : undefined}
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
        </div>
      ))}
    </>
  )

  const content = (
    <>
      {/* Badges */}
      <div className="flex flex-wrap gap-2 mb-3">
        {event.featured && <Badge variant="red">🔥 Хит сезона</Badge>}
        {event.rating > 0 && <Badge variant="gold">★ {event.rating}</Badge>}
        <Badge variant="dark">{event.ageRestriction}</Badge>
        {event.duration && <Badge variant="dark">{event.duration}</Badge>}
      </div>

      {/* Title */}
      <h1
        key={event.id}
        className="font-serif font-black text-cream leading-[0.93] tracking-[-0.02em] text-[clamp(24px,3.8vw,56px)] mb-2 animate-fade-up"
      >
        {event.title}
      </h1>
      {event.subtitle && (
        <p className="text-red italic font-serif text-[clamp(12px,1.6vw,22px)] mt-2 mb-3 max-w-[90%] lg:max-w-[50%]">
          {event.subtitle}
        </p>
      )}

      {/* Date / time / city pills */}
      <div className="flex flex-wrap gap-2 items-center mb-5">
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
    </>
  )

  return (
    <section className="bg-bg">
      {/* ── MOBILE: stacked layout ── */}
      <div className="lg:hidden">
        {/* Image */}
        <div className="relative w-full overflow-hidden pt-16" style={{ height: 'calc(56vw + 64px)', minHeight: 240, maxHeight: 380 }}>
          <div className="absolute inset-0 overflow-hidden">
            {images}
          </div>
          {/* bottom fade into bg */}
          <div className="absolute inset-x-0 bottom-0 h-12 z-10 bg-gradient-to-t from-bg to-transparent" />
          {/* top nav fade */}
          <div className="absolute inset-x-0 top-0 h-16 z-10 bg-gradient-to-b from-bg/70 to-transparent" />
        </div>
        {/* Content below image */}
        <div className="px-5 pt-4 pb-8">
          {content}
        </div>
      </div>

      {/* ── DESKTOP: split layout ── */}
      <div className="hidden lg:block relative h-[50vh] overflow-hidden pt-16">
        {/* Image panel — right side */}
        <div className="absolute inset-y-0 left-[45%] right-0 overflow-hidden">
          {images}
          <div className="absolute inset-y-0 left-0 w-64 z-10 bg-gradient-to-r from-bg to-transparent" />
          <div className="absolute inset-x-0 top-0 h-24 z-10 bg-gradient-to-b from-bg to-transparent" />
          <div className="absolute inset-x-0 bottom-0 h-24 z-10 bg-gradient-to-t from-bg to-transparent" />
        </div>

        {/* Content — left */}
        <div className="relative z-20 h-full flex flex-col justify-center px-16 max-w-[52%]">
          {content}
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
