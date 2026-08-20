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
    <div className="flex items-center justify-center" role="group" aria-label="Переключение слайдов">
      {Array.from({ length: count }).map((_, i) => (
        <button
          key={i}
          onClick={() => goTo(i)}
          className="group inline-flex size-11 items-center justify-center rounded-full cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red focus-visible:ring-offset-2 focus-visible:ring-offset-black/70 lg:size-9"
          aria-label={`Слайд ${i + 1}`}
          aria-current={i === current ? 'true' : undefined}
        >
          <span className="relative h-1.5 w-1.5 overflow-hidden rounded-full bg-white/45 transition-[width,background-color] duration-200 group-hover:bg-white/75 group-aria-[current=true]:w-7 group-aria-[current=true]:bg-red/30">
            {i === current && (
              <span
                className="absolute inset-y-0 left-0 rounded-full bg-red"
                style={{ animation: `progress ${interval}ms linear forwards` }}
              />
            )}
          </span>
          <span className="sr-only">
            {i === current ? 'Текущий слайд' : `Показать слайд ${i + 1}`}
          </span>
        </button>
      ))}
    </div>
  )
}

function SliderArrow({
  direction,
  onClick,
}: {
  direction: 'previous' | 'next'
  onClick: () => void
}) {
  const isPrevious = direction === 'previous'

  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex size-10 shrink-0 cursor-pointer items-center justify-center rounded-full border border-white/15 bg-black/30 text-white/75 backdrop-blur-md transition-colors duration-200 hover:border-white/30 hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red focus-visible:ring-offset-2 focus-visible:ring-offset-black/70 active:scale-[0.96]"
      aria-label={isPrevious ? 'Предыдущий слайд' : 'Следующий слайд'}
    >
      <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none">
        <path
          d={isPrevious ? 'M15 5l-7 7 7 7' : 'M9 5l7 7-7 7'}
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  )
}

function SlideImage({ event, isPriority }: { event: Event; isPriority: boolean }) {
  if (!event.image) {
    return <div className="absolute inset-0 bg-surface-2" aria-hidden="true" />
  }

  return (
    <Image
      src={event.image}
      alt={event.title}
      fill
      priority={isPriority}
      quality={85}
      className="relative z-[1] object-contain object-center"
      sizes="(min-width: 1296px) 1200px, (min-width: 1024px) calc(100vw - 96px), (min-width: 640px) calc(100vw - 48px), calc(100vw - 24px)"
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
  const previousIndex = (current - 1 + events.length) % events.length
  const nextIndex = (current + 1) % events.length

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
      className="relative w-full bg-bg px-3 pt-3 sm:px-6 sm:pt-5 lg:px-12 lg:pt-6"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setPaused(false)
      }}
      aria-roledescription="карусель"
      aria-label="Ближайшие концерты"
    >
      <div className="relative mx-auto max-w-[1200px] overflow-hidden rounded-xl bg-surface-2 shadow-[0_20px_60px_-36px_rgba(0,0,0,0.9)] sm:rounded-2xl lg:rounded-3xl">
        {/* Mobile: the full 3:2 image remains visible; details continue below it. */}
        <div className="lg:hidden">
          <div className="relative aspect-[3/2] w-full overflow-hidden bg-black">
            {events.map((e, i) => {
              if (!visibleIndices.has(i)) return null
              return (
                <div
                  key={e.id}
                  className="absolute inset-0 transition-opacity duration-200 ease-out"
                  style={{ opacity: i === current ? 1 : 0, zIndex: i === current ? 1 : 0 }}
                  aria-hidden={i !== current}
                >
                  <SlideImage event={e} isPriority={i === current} />
                </div>
              )
            })}

            <div
              className="pointer-events-none absolute inset-0 z-[2]"
              style={{
                background:
                  'linear-gradient(180deg, rgba(5,5,6,0.16) 0%, rgba(5,5,6,0.05) 30%, rgba(5,5,6,0.82) 100%)',
              }}
            />

            <div className="absolute inset-x-0 bottom-0 z-[3] p-4 sm:p-6">
              <p className="mb-2 inline-flex min-h-6 items-center rounded-full border border-white/15 bg-black/35 px-2.5 text-[9px] font-semibold uppercase tracking-[0.18em] text-white/80 backdrop-blur-md sm:min-h-7 sm:px-3 sm:text-[10px]">
                {heroLabel}
              </p>
              <h2
                key={event.id}
                className="max-w-[88%] font-serif text-[clamp(22px,6.3vw,32px)] font-black uppercase leading-[1.03] text-white drop-shadow-[0_2px_14px_rgba(0,0,0,0.8)] sm:max-w-[82%]"
              >
                {event.title}
              </h2>
            </div>

            {events.length > 1 && (
              <div className="absolute right-1 top-1 z-[4] sm:right-3 sm:top-3">
                <SliderDots count={events.length} current={current} goTo={goTo} interval={INTERVAL} />
              </div>
            )}
          </div>

          <div className="bg-[#111114] p-4 sm:p-6">
            {event.subtitle && (
              <p className="mb-2 line-clamp-1 text-[13px] leading-relaxed text-cream/65 sm:text-sm">{event.subtitle}</p>
            )}
            <p className="mb-3 text-[13px] leading-relaxed text-cream/68 sm:text-sm">{metaParts.join(' · ')}</p>

            <div className="mb-4 flex flex-wrap items-center gap-2">
              {event.ageRestriction && (
                <span className="rounded-md border border-white/15 px-2 py-0.5 text-[10px] text-cream/65 sm:px-2.5 sm:py-1 sm:text-[11px]">
                  {event.ageRestriction}
                </span>
              )}
              {event.duration && (
                <span className="rounded-md border border-white/15 px-2 py-0.5 text-[10px] text-cream/65 sm:px-2.5 sm:py-1 sm:text-[11px]">
                  {event.duration}
                </span>
              )}
              {price > 0 && (
                <span className="ml-auto font-serif text-base font-black text-cream sm:text-lg">от {formatPrice(price)}</span>
              )}
            </div>

            <div className="grid grid-cols-[1fr_auto] gap-2.5">
              <Link
                href={`/events/${event.slug}`}
                className="inline-flex min-h-12 items-center justify-center rounded-lg bg-red px-5 text-[15px] font-bold text-white transition-colors duration-200 hover:bg-red-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#111114] active:scale-[0.98] sm:min-h-14 sm:rounded-xl sm:text-base"
                aria-label={`Купить билет на ${event.title}`}
              >
                Купить билет
              </Link>
              <Link
                href={`/events/${event.slug}`}
                className="inline-flex size-12 items-center justify-center rounded-lg border border-white/25 bg-white/[0.04] text-white transition-colors duration-200 hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#111114] active:scale-[0.96] sm:size-14 sm:rounded-xl"
                aria-label={`Подробнее о ${event.title}`}
              >
                <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M8 5l7 7-7 7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
            </div>
          </div>
        </div>

        {/* Desktop: a lower carousel viewport; the original 3:2 artwork remains fully visible. */}
        <div className="relative hidden h-[clamp(380px,38vw,520px)] w-full overflow-hidden bg-black lg:block">
          {events.map((e, i) => {
            if (!visibleIndices.has(i)) return null
            return (
              <div
                key={e.id}
                className="absolute inset-0 transition-opacity duration-200 ease-out"
                style={{ opacity: i === current ? 1 : 0, zIndex: i === current ? 1 : 0 }}
                aria-hidden={i !== current}
              >
                {e.image && (
                  <Image
                    src={e.image}
                    alt=""
                    fill
                    quality={45}
                    className="scale-110 object-cover opacity-50 blur-2xl"
                    sizes="(min-width: 1296px) 1200px, calc(100vw - 96px)"
                    aria-hidden="true"
                  />
                )}
                <SlideImage event={e} isPriority={i === current} />
              </div>
            )
          })}

          <div
            className="pointer-events-none absolute inset-0 z-[2]"
            style={{
              background:
                  'linear-gradient(90deg, rgba(5,5,6,0.93) 0%, rgba(5,5,6,0.82) 24%, rgba(5,5,6,0.46) 46%, rgba(5,5,6,0.10) 72%, rgba(5,5,6,0.18) 100%)',
            }}
          />
          <div
            className="pointer-events-none absolute inset-x-0 bottom-0 z-[2] h-1/3"
            style={{
              background: 'linear-gradient(0deg, rgba(5,5,6,0.62) 0%, transparent 100%)',
            }}
          />

          <div className="absolute inset-y-0 left-0 z-[3] flex w-[54%] items-center px-8 py-8 xl:w-[50%] xl:px-12">
            <div className="max-w-[470px]">
              <p className="mb-3 inline-flex min-h-7 items-center rounded-full border border-white/15 bg-black/25 px-3 text-[9px] font-semibold uppercase tracking-[0.2em] text-white/75 backdrop-blur-md">
                {heroLabel}
              </p>
              <h2
                key={event.id}
                className="mb-3 font-serif text-[clamp(32px,3.2vw,48px)] font-black uppercase leading-[1] text-white drop-shadow-[0_3px_20px_rgba(0,0,0,0.9)]"
              >
                {event.title}
              </h2>
              {event.subtitle && (
                <p className="mb-3 line-clamp-1 max-w-[440px] text-[13px] leading-relaxed text-white/70 xl:text-sm">
                  {event.subtitle}
                </p>
              )}
              <p className="mb-3 text-[13px] leading-relaxed text-white/76 xl:text-sm">{metaParts.join(' · ')}</p>

              <div className="mb-3 flex flex-wrap items-center gap-2">
                {event.ageRestriction && (
                  <span className="rounded-md border border-white/20 bg-black/15 px-2 py-0.5 text-[10px] text-white/70 backdrop-blur-sm">
                    {event.ageRestriction}
                  </span>
                )}
                {event.duration && (
                  <span className="rounded-md border border-white/20 bg-black/15 px-2 py-0.5 text-[10px] text-white/70 backdrop-blur-sm">
                    {event.duration}
                  </span>
                )}
              </div>

              {price > 0 && (
                <p className="mb-4 font-serif text-lg font-black text-white xl:text-xl">от {formatPrice(price)}</p>
              )}

              <div className="flex flex-wrap gap-3">
                <Link
                  href={`/events/${event.slug}`}
                  className="inline-flex min-h-11 items-center justify-center rounded-lg bg-red px-6 py-2.5 text-[13px] font-bold text-white transition-colors duration-200 hover:bg-red-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black/70 active:scale-[0.98] xl:px-7 xl:text-sm"
                  aria-label={`Купить билет на ${event.title}`}
                >
                  Купить билет
                </Link>
                <Link
                  href={`/events/${event.slug}`}
                  className="inline-flex min-h-11 items-center justify-center rounded-lg border border-white/30 bg-white/[0.06] px-6 py-2.5 text-[13px] font-medium text-white backdrop-blur-sm transition-colors duration-200 hover:bg-white/[0.12] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black/70 active:scale-[0.98] xl:text-sm"
                  aria-label={`Подробнее о ${event.title}`}
                >
                  Подробнее
                </Link>
              </div>
            </div>
          </div>

          {events.length > 1 && (
            <div className="absolute bottom-4 right-5 z-[4] flex items-center rounded-full border border-white/10 bg-black/20 px-1 backdrop-blur-md xl:bottom-5 xl:right-7">
              <SliderArrow direction="previous" onClick={() => goTo(previousIndex)} />
              <SliderDots count={events.length} current={current} goTo={goTo} interval={INTERVAL} />
              <SliderArrow direction="next" onClick={() => goTo(nextIndex)} />
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
