'use client'

import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Event } from '@/lib/types'
import { formatDateShort, formatPrice, minEventPrice } from '@/lib/utils'
import MetaPill from '@/components/ui/MetaPill'
import EventBadges from '@/components/ui/EventBadges'

interface HeroSliderProps {
  events: Event[]
}

const INTERVAL = 8_000

// Extracted dots component so JSX stays clean
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
    <div className="flex items-center gap-2">
      {Array.from({ length: count }).map((_, i) => (
        <button
          key={i}
          onClick={() => goTo(i)}
          className="relative h-[2px] rounded-full overflow-hidden transition-all duration-300 cursor-pointer"
          style={{ width: i === current ? 32 : 14 }}
          aria-label={`Слайд ${i + 1}`}
        >
          <span className="absolute inset-0 bg-cream/20 rounded-full" />
          {i === current && (
            <span
              className="absolute inset-y-0 left-0 bg-cream rounded-full"
              style={{ animation: `progress ${interval}ms linear forwards` }}
            />
          )}
        </button>
      ))}
    </div>
  )
}

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
      }, 900)
    },
    [current, transitioning]
  )

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const timer = setInterval(() => goTo((current + 1) % events.length), INTERVAL)
    return () => clearInterval(timer)
  }, [current, events.length, goTo])

  const event = events[current] ?? events[0]
  if (!event) return null
  const price = minEventPrice(event)

  // Shared image layers (reused in both mobile and desktop)
  const imageStack = (sizes: string) =>
    events.map((e, i) => (
      <div
        key={e.id}
        className="absolute inset-0 transition-opacity ease-in-out"
        style={{
          transitionDuration: '900ms',
          opacity: i === current ? 1 : 0,
          zIndex: i === current ? 1 : i === prev ? 2 : 0,
        }}
      >
        {/* Inner div restarts Ken Burns on each slide activation */}
        <div
          key={i === current ? `kb-${current}` : `idle-${i}`}
          className="absolute inset-0"
          style={
            i === current
              ? { animation: `kenBurns ${INTERVAL}ms ease-out forwards` }
              : undefined
          }
        >
          <Image
            src={e.image}
            alt={e.title}
            fill
            priority={i === 0}
            className="object-cover object-top"
            sizes={sizes}
          />
        </div>
      </div>
    ))

  // Staggered content — each element keyed on event.id so animations replay on slide change
  const badges = (
    <div key={`badges-${event.id}`} className="animate-hero-content" style={{ animationDelay: '0ms' }}>
      <EventBadges event={event} className="flex flex-wrap gap-2 mb-3" />
    </div>
  )

  const title = (extra?: string) => (
    <h1
      key={`title-${event.id}`}
      className={`font-serif font-black text-cream leading-[1.05] tracking-[-0.02em] text-[clamp(28px,4.5vw,64px)] mb-3 text-balance animate-hero-content ${extra ?? ''}`}
      style={{ animationDelay: '70ms' }}
    >
      {event.title}
    </h1>
  )

  const subtitle = (extra?: string) =>
    event.subtitle ? (
      <p
        key={`sub-${event.id}`}
        className={`text-cream/55 font-sans text-[clamp(13px,1.3vw,17px)] mt-1 mb-5 leading-relaxed animate-hero-content ${extra ?? ''}`}
        style={{ animationDelay: '130ms' }}
      >
        {event.subtitle}
      </p>
    ) : null

  const pills = (
    <div
      key={`pills-${event.id}`}
      className="flex flex-wrap gap-2.5 items-center mb-4 animate-hero-content"
      style={{ animationDelay: '190ms' }}
    >
      <MetaPill type="date" variant="glass" className="text-sm px-3.5 py-1.5 font-semibold">
        {formatDateShort(event.date)}
      </MetaPill>
      <MetaPill type="time" variant="glass" className="text-sm px-3.5 py-1.5 font-semibold">
        {event.time}
      </MetaPill>
      {(event.venueName ?? event.city) && (
        <MetaPill type="venue" variant="glass" className="text-sm px-3.5 py-1.5">
          {event.venueName ?? event.city}
        </MetaPill>
      )}
    </div>
  )

  // Price — small, understated. No longer the focal point.
  const priceEl = price > 0 ? (
    <p
      key={`price-${event.id}`}
      className="text-cream/40 text-xs tracking-wide mb-4 animate-hero-content"
      style={{ animationDelay: '230ms' }}
    >
      от {formatPrice(price)}
    </p>
  ) : null

  const buttons = (
    <div
      key={`btns-${event.id}`}
      className="flex flex-wrap items-center gap-4 animate-hero-content"
      style={{ animationDelay: '280ms' }}
    >
      <div className="flex gap-3">
        <Link
          href={`/events/${event.slug}`}
          className="inline-flex items-center gap-2 bg-red hover:bg-red-hover text-white text-sm font-bold px-7 py-3.5 rounded-xl transition-all shadow-red"
        >
          Купить билет →
        </Link>
        <Link
          href={`/events/${event.slug}`}
          className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/15 text-cream text-sm font-medium px-5 py-3.5 rounded-xl hover:bg-white/15 transition-all"
        >
          Подробнее
        </Link>
      </div>
      {events.length > 1 && (
        <SliderDots count={events.length} current={current} goTo={goTo} interval={INTERVAL} />
      )}
    </div>
  )

  return (
    <section className="bg-bg">
      {/* ── MOBILE ── */}
      <div className="lg:hidden mt-5">
        <div
          className="relative w-full overflow-hidden pt-16"
          style={{ height: 'calc(58vw + 64px)', minHeight: 260, maxHeight: 430 }}
        >
          <div className="absolute inset-0 overflow-hidden">{imageStack('100vw')}</div>
          {/* Deeper fade at bottom for smooth content blend */}
          <div className="absolute inset-x-0 bottom-0 h-28 z-10 bg-gradient-to-t from-bg via-bg/70 to-transparent" />
          <div className="absolute inset-x-0 top-0 h-16 z-10 bg-gradient-to-b from-bg/70 to-transparent" />
        </div>

        <div className="px-5 pt-2 pb-8">
          {badges}
          {title()}
          {subtitle('max-w-[95%]')}
          {pills}
          {priceEl}
          {buttons}
        </div>
      </div>

      {/* ── DESKTOP ── */}
      {/* Height = 60vw × (800/1200) = 40vw, capped at 800px (natural image height) */}
      <div
        className="hidden lg:block relative mt-[50px] overflow-hidden"
        style={{ height: 'min(34vw, 680px)', minHeight: '420px' }}
      >
        {/* Image panel — right */}
        <div className="absolute inset-y-0 left-[40%] right-0 overflow-hidden">
          {imageStack('60vw')}
          {/* Gradients for cinematic blend */}
          <div className="absolute inset-y-0 left-0 w-96 z-10 bg-gradient-to-r from-bg via-bg/50 to-transparent" />
          <div className="absolute inset-x-0 top-0 h-40 z-10 bg-gradient-to-b from-bg to-transparent" />
          <div className="absolute inset-x-0 bottom-0 h-40 z-10 bg-gradient-to-t from-bg to-transparent" />
        </div>

        {/* Vignette — subtle dark overlay on right edge */}
        <div className="absolute inset-y-0 right-0 w-32 z-10 bg-gradient-to-l from-bg/40 to-transparent pointer-events-none" />

        {/* Content — left column */}
        <div className="relative z-20 h-full flex flex-col justify-center px-16 lg:px-20 max-w-[52%]">
          {badges}
          {title()}
          {subtitle('max-w-[90%]')}
          {pills}
          {priceEl}
          {buttons}
        </div>
      </div>
    </section>
  )
}
