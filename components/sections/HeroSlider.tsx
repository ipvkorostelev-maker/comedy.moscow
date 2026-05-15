'use client'

import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Event } from '@/lib/types'
import { formatDateShort, formatPrice, minEventPrice } from '@/lib/utils'
import EventBadges from '@/components/ui/EventBadges'

interface HeroSliderProps {
  events: Event[]
}

const INTERVAL = 6_000

/* ═══════════════ DOTS ═══════════════ */
function SliderDots({
  count,
  current,
  goTo,
  interval,
}: {
  count: number
  current: number
  goTo: (i: number) => void
  interval: number
}) {
  return (
    <div className="flex items-center gap-3">
      {Array.from({ length: count }).map((_, i) => (
        <button
          key={i}
          onClick={() => goTo(i)}
          className="relative rounded-full overflow-hidden transition-all duration-[400ms] ease-out cursor-pointer"
          style={{
            width: i === current ? 28 : 6,
            height: 6,
          }}
          aria-label={`Слайд ${i + 1}`}
        >
          {/* base */}
          <span className="absolute inset-0 rounded-full" style={{ background: i === current ? 'rgba(255,77,0,0.25)' : '#555' }} />
          {/* active progress bar */}
          {i === current && (
            <span
              className="absolute inset-y-0 left-0 rounded-full"
              style={{
                background: '#FF4D00',
                animation: `progress ${interval}ms linear forwards`,
              }}
            />
          )}
        </button>
      ))}
    </div>
  )
}

/* ═══════════════ TAG PILL ═══════════════ */
function TagPill({ children, accent }: { children: React.ReactNode; accent?: boolean }) {
  return (
    <span
      className="inline-flex items-center gap-1.5 text-[13px] font-medium px-3.5 py-1.5 rounded-md transition-colors"
      style={{
        border: accent ? '1px solid rgba(255,184,0,0.35)' : '1px solid rgba(255,255,255,0.15)',
        color: accent ? '#FFB800' : '#D0D0D0',
        background: accent ? 'rgba(255,184,0,0.08)' : 'transparent',
      }}
    >
      {children}
    </span>
  )
}

/* ═══════════════ MAIN ═══════════════ */
export default function HeroSlider({ events }: HeroSliderProps) {
  const [current, setCurrent] = useState(0)
  const [animating, setAnimating] = useState(false)
  const [paused, setPaused] = useState(false)

  const goTo = useCallback(
    (index: number) => {
      if (animating || index === current) return
      setAnimating(true)
      setCurrent(index)
      setTimeout(() => setAnimating(false), 650)
    },
    [current, animating]
  )

  /* Auto-advance */
  useEffect(() => {
    if (paused) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const timer = setInterval(() => goTo((current + 1) % events.length), INTERVAL)
    return () => clearInterval(timer)
  }, [current, events.length, goTo, paused])

  const event = events[current] ?? events[0]
  if (!event) return null
  const price = minEventPrice(event)

  /* ── BG stack ── */
  const bgStack = events.map((e, i) => (
    <div
      key={e.id}
      className="absolute inset-0 transition-opacity ease-in-out"
      style={{
        transitionDuration: '700ms',
        opacity: i === current ? 1 : 0,
        zIndex: i === current ? 1 : 0,
      }}
    >
      <div
        className="absolute inset-0"
        style={i === current ? { animation: `kenBurns ${INTERVAL}ms ease-out forwards` } : undefined}
      >
        <Image
          src={e.image}
          alt={e.title}
          fill
          priority={i === 0}
          quality={85}
          className="object-cover object-top"
          sizes="100vw"
        />
      </div>
    </div>
  ))

  /* ── Content ── */
  const tags = [
    ...event.tags.slice(0, 2).map((t) => t),
    ...(event.rating > 0 ? [`★ ${event.rating}`] : []),
  ]

  const pills = (
    <div className="flex flex-wrap gap-2.5 items-center mb-5">
      <TagPill>📅 {formatDateShort(event.date)}</TagPill>
      <TagPill>⏱ {event.duration}</TagPill>
      {event.rating > 0 && <TagPill accent>★ {event.rating}</TagPill>}
      {event.venueName && <TagPill>📍 {event.venueName}</TagPill>}
    </div>
  )

  return (
    <section
      className="relative w-full overflow-hidden"
      style={{ height: 'min(100vh, 700px)', minHeight: '500px' }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Background images */}
      {bgStack}

      {/* Mobile: full dark overlay so text stays readable */}
      <div
        className="absolute inset-0 z-[2] pointer-events-none lg:hidden"
        style={{ background: 'rgba(10,10,10,0.62)' }}
      />
      {/* Desktop: left-to-right gradient */}
      <div
        className="absolute inset-0 z-[2] pointer-events-none hidden lg:block"
        style={{
          background:
            'linear-gradient(to right, rgba(10,10,10,0.95) 0%, rgba(10,10,10,0.7) 40%, rgba(10,10,10,0.0) 100%)',
        }}
      />

      {/* Bottom fade */}
      <div
        className="absolute bottom-0 left-0 right-0 z-[2] pointer-events-none"
        style={{ height: 120, background: 'linear-gradient(to top, rgba(10,10,10,1) 0%, transparent 100%)' }}
      />

      {/* Content layer */}
      <div className="relative z-[3] h-full flex flex-col justify-center px-6 lg:px-20">
        <div
          key={event.id}
          className="max-w-xl animate-slide-in"
        >
          {/* Label */}
          <p className="font-sans text-[11px] lg:text-[13px] uppercase tracking-[0.25em] text-cream/45 font-medium mb-4">
            Ближайшее шоу
          </p>

          {/* Badges from existing system */}
          <div className="mb-3">
            <EventBadges event={event} className="flex flex-wrap gap-2" />
          </div>

          {/* Title */}
          <h2 className="font-serif font-black text-cream leading-[0.92] tracking-[-0.01em] text-[clamp(36px,5.5vw,80px)] mb-4 text-balance uppercase">
            {event.title}
          </h2>

          {/* Subtitle */}
          {event.subtitle && (
            <p className="text-cream/50 font-sans text-[clamp(13px,1.2vw,16px)] mt-2 mb-4 leading-relaxed max-w-lg">
              {event.subtitle}
            </p>
          )}

          {/* Tag pills */}
          {pills}

          {/* Description */}
          <p className="text-[15px] leading-[1.65] text-cream/60 max-w-[440px] mb-7 line-clamp-3">
            {event.description}
          </p>

          {/* Price */}
          {price > 0 && (
            <p className="text-cream/30 text-xs tracking-wide mb-5 font-sans">
              от {formatPrice(price)}
            </p>
          )}

          {/* Buttons */}
          <div className="flex flex-wrap gap-3.5 mb-10">
            <Link
              href={`/events/${event.slug}`}
              className="inline-flex items-center gap-2 bg-red hover:bg-red-hover text-white text-[15px] font-semibold px-8 py-3.5 rounded-lg transition-all duration-200 hover:brightness-110 hover:scale-[1.02]"
              style={{ boxShadow: '0 4px 24px rgba(255,77,0,0.30)' }}
            >
              ▶ Купить билет
            </Link>
            <Link
              href={`/events/${event.slug}`}
              className="inline-flex items-center gap-2 bg-transparent text-white text-[15px] font-medium px-7 py-3.5 rounded-lg transition-all duration-200 hover:bg-white/10"
              style={{ border: '1.5px solid rgba(255,255,255,0.35)' }}
            >
              + Подробнее
            </Link>
          </div>
        </div>
      </div>

      {/* Slider dots — bottom left */}
      {events.length > 1 && (
        <div className="absolute bottom-8 left-6 lg:left-20 z-[5]">
          <SliderDots count={events.length} current={current} goTo={goTo} interval={INTERVAL} />
        </div>
      )}
    </section>
  )
}
