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
      {/* Mobile */}
      <div className="lg:hidden">
        <div className="relative w-full aspect-[4/5] min-h-[480px]">
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
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                'linear-gradient(to top, rgba(10,10,10,1) 0%, rgba(10,10,10,0.7) 30%, rgba(10,10,10,0.4) 45%, transparent 60%)',
            }}
          />

          <div className="absolute bottom-0 left-0 right-0 px-5 pb-6">
            <p className="text-[11px] uppercase tracking-[0.25em] text-cream/50 font-medium mb-3">
              {heroLabel}
            </p>
            <h2
              key={event.id}
              className="font-serif font-black text-cream uppercase leading-[1.02] mb-3"
              style={{ fontSize: 'clamp(30px, 8.5vw, 44px)' }}
            >
              {event.title}
            </h2>
            <p className="text-cream/60 text-sm mb-4 line-clamp-1">
              {metaParts.slice(0, 3).join(' · ')}
            </p>
            {price > 0 && (
              <p className="font-serif font-black text-lg text-cream mb-4">
                от {formatPrice(price)}
              </p>
            )}
            <div className="flex flex-col gap-3">
              <Link
                href={`/events/${event.slug}`}
                className="inline-flex items-center justify-center h-12 flex-1 bg-red hover:bg-red-hover text-white font-bold px-8 rounded-lg transition-colors duration-200"
                aria-label={`Купить билет на ${event.title}`}
              >
                Купить билет
              </Link>
              <Link
                href={`/events/${event.slug}`}
                className="inline-flex items-center justify-center h-12 flex-1 bg-transparent hover:bg-white/10 text-white font-medium px-7 rounded-lg border border-white/25 transition-colors duration-200"
                aria-label={`Подробнее о ${event.title}`}
              >
                Подробнее
              </Link>
            </div>
          </div>
        </div>

        {events.length > 1 && (
          <div className="flex justify-center pt-4 pb-6">
            <SliderDots count={events.length} current={current} goTo={goTo} interval={INTERVAL} />
          </div>
        )}
      </div>

      {/* Desktop */}
      <div className="hidden lg:block relative h-[560px] xl:h-[620px]">
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

        <div
          className="absolute inset-0 z-[2] pointer-events-none"
          style={{
            background:
              'linear-gradient(to right, rgba(10,10,10,0.92) 0%, rgba(10,10,10,0.75) 35%, rgba(10,10,10,0.2) 55%, transparent 70%), linear-gradient(to top, rgba(10,10,10,0.85) 0%, transparent 40%)',
          }}
        />

        <div className="relative z-[3] h-full max-w-[1600px] mx-auto px-6 lg:px-12 flex items-center">
          <div className="max-w-[640px] py-8">
            <p className="text-[11px] uppercase tracking-[0.25em] text-cream/50 font-medium mb-4">
              {heroLabel}
            </p>
            <h2
              key={event.id}
              className="font-serif font-black text-cream uppercase leading-[1.02] mb-5"
              style={{ fontSize: 'clamp(34px, 4.2vw, 72px)' }}
            >
              {event.title}
            </h2>
            {event.subtitle && (
              <p className="text-cream/55 text-sm lg:text-base mb-5 line-clamp-2">{event.subtitle}</p>
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
