'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Event } from '@/lib/types'
import { formatDate, formatDateShort, formatPrice, minEventPrice } from '@/lib/utils'

interface HeroSliderProps {
  events: Event[]
  selectedDate?: string | null
}

const INTERVAL = 6_000

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
          className="relative rounded-full overflow-hidden transition-all duration-200 ease-out cursor-pointer"
          style={{ width: i === current ? 28 : 6, height: 6 }}
          aria-label={`Слайд ${i + 1}`}
        >
          <span
            className="absolute inset-0 rounded-full"
            style={{ background: i === current ? 'rgba(255,77,0,0.25)' : 'rgba(255,255,255,0.30)' }}
          />
          {i === current && (
            <span
              className="absolute inset-y-0 left-0 rounded-full"
              style={{ background: '#FF4D00', animation: `progress ${interval}ms linear forwards` }}
            />
          )}
        </button>
      ))}
    </div>
  )
}

function SlideImage({ event, isPriority }: { event: Event; isPriority: boolean }) {
  return (
    <Image
      src={event.image}
      alt={event.title}
      fill
      priority={isPriority}
      quality={85}
      className="object-cover object-center"
      sizes="100vw"
    />
  )
}

export default function HeroSlider({ events, selectedDate }: HeroSliderProps) {
  const [current, setCurrent] = useState(0)
  const [animating, setAnimating] = useState(false)
  const [paused, setPaused] = useState(false)
  const prevIndexRef = useRef(0)

  const goTo = useCallback(
    (index: number) => {
      if (animating || index === current) return
      prevIndexRef.current = current
      setAnimating(true)
      setCurrent(index)
      setTimeout(() => setAnimating(false), 250)
    },
    [current, animating]
  )

  useEffect(() => {
    if (paused) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const timer = setInterval(() => goTo((current + 1) % events.length), INTERVAL)
    return () => clearInterval(timer)
  }, [current, events.length, goTo, paused])

  const event = events[current] ?? events[0]
  if (!event) return null
  const price = minEventPrice(event)

  const heroLabel = selectedDate
    ? `Стендап в Москве на ${formatDate(selectedDate)}`
    : 'Ближайшее шоу'

  const visibleIndices = new Set<number>()
  visibleIndices.add(current)
  visibleIndices.add((current - 1 + events.length) % events.length)
  visibleIndices.add((current + 1) % events.length)
  if (animating) visibleIndices.add(prevIndexRef.current)

  const metaParts = [formatDateShort(event.date), event.time, event.venueName, event.city].filter(Boolean)

  return (
    <section
      className="relative w-full overflow-hidden bg-bg"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* ── MOBILE: image on top (no crop), content below ── */}
      <div className="lg:hidden">
        <div className="relative w-full aspect-[3/2] overflow-hidden bg-surface-2">
          {events.map((e, i) => {
            if (!visibleIndices.has(i)) return null
            return (
              <div
                key={e.id}
                className="absolute inset-0 transition-opacity duration-200 ease-in-out"
                style={{ opacity: i === current ? 1 : 0 }}
              >
                <SlideImage event={e} isPriority={i === current} />
              </div>
            )
          })}
          <div
            className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-bg to-transparent pointer-events-none"
          />
        </div>

        <div className="px-5 pt-5 pb-4">
          <p className="text-[11px] uppercase tracking-[0.25em] text-cream/50 font-medium mb-3">
            {heroLabel}
          </p>
          <h2
            key={event.id}
            className="font-serif font-black text-cream uppercase leading-[1.05] mb-3"
            style={{ fontSize: 'clamp(28px, 8vw, 40px)' }}
          >
            {event.title}
          </h2>
          <p className="text-cream/60 text-sm mb-4">
            {metaParts.join(' · ')}
          </p>
          {price > 0 && (
            <p className="font-serif font-black text-lg text-cream mb-4">
              от {formatPrice(price)}
            </p>
          )}
          <div className="flex flex-col gap-3">
            <Link
              href={`/events/${event.slug}`}
              className="inline-flex items-center justify-center h-14 bg-red hover:bg-red-hover text-white text-base font-bold px-8 rounded-lg transition-colors duration-200"
              aria-label={`Купить билет на ${event.title}`}
            >
              Купить билет
            </Link>
            <Link
              href={`/events/${event.slug}`}
              className="inline-flex items-center justify-center h-12 bg-transparent hover:bg-white/10 text-white text-sm font-medium px-7 rounded-lg border border-white/25 transition-colors duration-200"
              aria-label={`Подробнее о ${event.title}`}
            >
              Подробнее
            </Link>
          </div>
        </div>

        {events.length > 1 && (
          <div className="flex justify-center pb-6">
            <SliderDots count={events.length} current={current} goTo={goTo} interval={INTERVAL} />
          </div>
        )}
      </div>

      {/* ── DESKTOP: content left, image right (no overlap) ── */}
      <div className="hidden lg:block relative h-[500px] xl:h-[540px] bg-bg">
        {/* Image — right side, not covered by text */}
        <div className="absolute inset-y-0 right-0 w-[55%] xl:w-[52%] overflow-hidden bg-surface-2">
          {events.map((e, i) => {
            if (!visibleIndices.has(i)) return null
            return (
              <div
                key={e.id}
                className="absolute inset-0 transition-opacity duration-200 ease-in-out"
                style={{ opacity: i === current ? 1 : 0, zIndex: i === current ? 1 : 0 }}
              >
                <SlideImage event={e} isPriority={i === current} />
              </div>
            )
          })}
          {/* Soft blend into page background on the left edge of the image */}
          <div
            className="absolute inset-y-0 left-0 w-24 z-[2] pointer-events-none"
            style={{
              background: 'linear-gradient(to right, rgba(10,10,10,1) 0%, rgba(10,10,10,0.6) 45%, transparent 100%)',
            }}
          />
          {/* Bottom fade for depth */}
          <div
            className="absolute inset-x-0 bottom-0 h-16 z-[2] pointer-events-none"
            style={{
              background: 'linear-gradient(to top, rgba(10,10,10,0.8) 0%, transparent 100%)',
            }}
          />
        </div>

        {/* Content — left column, never covers the image */}
        <div className="relative z-[3] h-full max-w-[1600px] mx-auto px-6 lg:px-12 flex items-center">
          <div className="max-w-[540px] py-8">
            <p className="text-[11px] uppercase tracking-[0.25em] text-cream/50 font-medium mb-4">
              {heroLabel}
            </p>
            <h2
              key={event.id}
              className="font-serif font-black text-cream uppercase leading-[1.02] mb-5"
              style={{ fontSize: 'clamp(34px, 3.4vw, 60px)' }}
            >
              {event.title}
            </h2>
            {event.subtitle && (
              <p className="text-cream/55 text-sm lg:text-base mb-4 line-clamp-2">{event.subtitle}</p>
            )}
            <p className="text-cream/60 text-sm mb-4">
              {metaParts.join(' · ')}
            </p>
            <div className="flex flex-wrap items-center gap-2 mb-5">
              {event.ageRestriction && (
                <span className="text-[11px] text-cream/60 px-2 py-1 rounded border border-white/15">
                  {event.ageRestriction}
                </span>
              )}
              {event.duration && (
                <span className="text-[11px] text-cream/60 px-2 py-1 rounded border border-white/15">
                  {event.duration}
                </span>
              )}
            </div>
            {price > 0 && (
              <p className="font-serif font-black text-lg xl:text-xl text-cream mb-6">
                от {formatPrice(price)}
              </p>
            )}
            <div className="flex flex-wrap gap-3">
              <Link
                href={`/events/${event.slug}`}
                className="inline-flex items-center justify-center min-h-[48px] bg-red hover:bg-red-hover text-white font-bold px-8 py-3.5 rounded-lg transition-colors duration-200"
                aria-label={`Купить билет на ${event.title}`}
              >
                Купить билет
              </Link>
              <Link
                href={`/events/${event.slug}`}
                className="inline-flex items-center justify-center min-h-[48px] bg-transparent hover:bg-white/10 text-white font-medium px-7 py-3.5 rounded-lg border border-white/25 transition-colors duration-200"
                aria-label={`Подробнее о ${event.title}`}
              >
                Подробнее
              </Link>
            </div>
          </div>
        </div>

        {events.length > 1 && (
          <div className="absolute bottom-6 left-6 lg:left-12 z-[4]">
            <SliderDots count={events.length} current={current} goTo={goTo} interval={INTERVAL} />
          </div>
        )}
      </div>
    </section>
  )
}
