'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Event } from '@/lib/types'
import { formatDate, formatDateShort, formatPrice, minEventPrice } from '@/lib/utils'

interface HeroSliderProps {
  events: Event[]
  selectedDate?: string | null
}

const INTERVAL = 6_000

function SlideImage({ event, isPriority }: { event: Event; isPriority: boolean }) {
  if (!event.image) return <div className="absolute inset-0 bg-surface-2" aria-hidden="true" />

  return (
    <Image
      src={event.image}
      alt={event.title}
      fill
      priority={isPriority}
      quality={88}
      className="object-contain object-center"
      sizes="(min-width: 1024px) 60vw, calc(100vw - 24px)"
    />
  )
}

function ArrowButton({
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
      className="inline-flex size-11 shrink-0 cursor-pointer items-center justify-center rounded-full border border-white/15 bg-white/[0.035] text-white/75 transition-[background-color,border-color,color,transform] duration-200 hover:border-white/30 hover:bg-white/[0.08] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red focus-visible:ring-offset-2 focus-visible:ring-offset-[#0d0d0f] active:scale-95"
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

function SliderProgress({
  count,
  current,
  goTo,
}: {
  count: number
  current: number
  goTo: (index: number) => void
}) {
  return (
    <div className="flex items-center gap-1" role="group" aria-label="Переключение слайдов">
      {Array.from({ length: count }).map((_, index) => (
        <button
          key={index}
          type="button"
          onClick={() => goTo(index)}
          className="group inline-flex h-11 w-7 cursor-pointer items-center justify-center rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red"
          aria-label={`Показать слайд ${index + 1}`}
          aria-current={index === current ? 'true' : undefined}
        >
          <span className="relative h-1 w-4 overflow-hidden rounded-full bg-white/20 transition-colors duration-200 group-hover:bg-white/40 group-aria-[current=true]:bg-red/25">
            {index === current && (
              <span
                className="absolute inset-y-0 left-0 w-full origin-left rounded-full bg-red"
                style={{ animation: `progress ${INTERVAL}ms linear forwards` }}
              />
            )}
          </span>
        </button>
      ))}
    </div>
  )
}

function SlideControls({
  count,
  current,
  previous,
  next,
  goTo,
}: {
  count: number
  current: number
  previous: () => void
  next: () => void
  goTo: (index: number) => void
}) {
  if (count < 2) return null

  return (
    <div className="flex items-center gap-2">
      <ArrowButton direction="previous" onClick={previous} />
      <div className="flex min-w-0 items-center gap-2">
        <span className="w-10 text-center font-sans text-[11px] font-semibold tabular-nums tracking-[0.12em] text-white/55">
          {String(current + 1).padStart(2, '0')} / {String(count).padStart(2, '0')}
        </span>
        <SliderProgress count={count} current={current} goTo={goTo} />
      </div>
      <ArrowButton direction="next" onClick={next} />
    </div>
  )
}

export default function HeroSlider({ events, selectedDate }: HeroSliderProps) {
  const [current, setCurrent] = useState(0)
  const [animating, setAnimating] = useState(false)
  const [paused, setPaused] = useState(false)
  const previousIndexRef = useRef(0)

  const goTo = useCallback(
    (index: number) => {
      if (animating || index === current) return
      previousIndexRef.current = current
      setAnimating(true)
      setCurrent(index)
      window.setTimeout(() => setAnimating(false), 250)
    },
    [animating, current]
  )

  useEffect(() => {
    if (paused || events.length < 2) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const timer = window.setInterval(() => goTo((current + 1) % events.length), INTERVAL)
    return () => window.clearInterval(timer)
  }, [current, events.length, goTo, paused])

  const event = events[current] ?? events[0]
  if (!event) return null

  const price = minEventPrice(event)
  const previousIndex = (current - 1 + events.length) % events.length
  const nextIndex = (current + 1) % events.length
  const heroLabel = selectedDate
    ? `Стендап в Москве на ${formatDate(selectedDate)}`
    : 'Ближайшее шоу'
  const metaParts = [formatDateShort(event.date), event.time, event.venueName, event.city].filter(Boolean)
  const visibleIndices = new Set<number>([
    current,
    previousIndex,
    nextIndex,
    ...(animating ? [previousIndexRef.current] : []),
  ])

  const renderImages = (className: string) => (
    <div className={className}>
      {events.map((slide, index) => {
        if (!visibleIndices.has(index)) return null
        return (
          <div
            key={slide.id}
            className="absolute inset-0 transition-opacity duration-200 ease-out"
            style={{ opacity: index === current ? 1 : 0, zIndex: index === current ? 1 : 0 }}
            aria-hidden={index !== current}
          >
            <SlideImage event={slide} isPriority={index === current} />
          </div>
        )
      })}
    </div>
  )

  return (
    <section
      className="w-full bg-bg px-3 pt-3 sm:px-6 sm:pt-5 lg:px-12 lg:pt-6"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={(focusEvent) => {
        if (!focusEvent.currentTarget.contains(focusEvent.relatedTarget)) setPaused(false)
      }}
      aria-roledescription="карусель"
      aria-label="Ближайшие концерты"
    >
      <div className="mx-auto max-w-[1200px] overflow-hidden rounded-2xl border border-white/[0.07] bg-[#0d0d0f] shadow-[0_24px_80px_-44px_rgba(255,77,0,0.35)] lg:aspect-[5/2] lg:rounded-[28px]">
        {/* Mobile and tablet: image first, all readable event data below. */}
        <div className="lg:hidden">
          <div className="relative aspect-[3/2] overflow-hidden bg-black">
            {renderImages('absolute inset-0')}
            <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[2] h-20 bg-gradient-to-t from-[#0d0d0f]/75 to-transparent" />
            {events.length > 1 && (
              <div className="absolute right-3 top-3 z-[3] rounded-full border border-white/15 bg-black/55 px-3 py-1.5 text-[10px] font-semibold tabular-nums tracking-[0.14em] text-white/80 backdrop-blur-md">
                {String(current + 1).padStart(2, '0')} / {String(events.length).padStart(2, '0')}
              </div>
            )}
          </div>

          <div className="relative bg-[radial-gradient(circle_at_100%_0%,rgba(255,77,0,0.09),transparent_38%)] p-4 sm:p-6" aria-live="polite">
            <p className="mb-2 text-[9px] font-bold uppercase tracking-[0.22em] text-red sm:text-[10px]">{heroLabel}</p>
            <h2 className="mb-3 max-w-[18ch] font-serif text-[clamp(25px,7vw,38px)] font-black uppercase leading-[0.98] text-white">
              {event.title}
            </h2>
            {event.subtitle && <p className="mb-2 line-clamp-1 text-[13px] leading-relaxed text-cream/60">{event.subtitle}</p>}
            <p className="mb-3 text-[13px] leading-relaxed text-cream/72 sm:text-sm">{metaParts.join(' · ')}</p>

            <div className="mb-4 flex min-h-7 flex-wrap items-center gap-2">
              {event.ageRestriction && <span className="rounded-md border border-white/15 px-2 py-1 text-[10px] text-cream/62">{event.ageRestriction}</span>}
              {event.duration && <span className="rounded-md border border-white/15 px-2 py-1 text-[10px] text-cream/62">{event.duration}</span>}
              {price > 0 && <span className="ml-auto font-serif text-lg font-black tabular-nums text-white">от {formatPrice(price)}</span>}
            </div>

            <div className="grid grid-cols-[1fr_52px] gap-2.5">
              <Link
                href={`/events/${event.slug}`}
                className="inline-flex min-h-[52px] items-center justify-center rounded-xl bg-red px-5 text-[15px] font-bold text-white transition-[background-color,transform] duration-200 hover:bg-red-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#0d0d0f] active:scale-[0.98]"
                aria-label={`Купить билет на ${event.title}`}
              >
                Купить билет
              </Link>
              <Link
                href={`/events/${event.slug}`}
                className="inline-flex size-[52px] items-center justify-center rounded-xl border border-white/20 bg-white/[0.035] text-white transition-[background-color,border-color,transform] duration-200 hover:border-white/35 hover:bg-white/[0.08] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#0d0d0f] active:scale-95"
                aria-label={`Подробнее о ${event.title}`}
              >
                <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M8 5l7 7-7 7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
            </div>

            {events.length > 1 && (
              <div className="mt-3 flex justify-center">
                <SlideControls
                  count={events.length}
                  current={current}
                  previous={() => goTo(previousIndex)}
                  next={() => goTo(nextIndex)}
                  goTo={goTo}
                />
              </div>
            )}
          </div>
        </div>

        {/* Desktop: 2:3 split. The right panel is always exactly 3:2, matching the source artwork. */}
        <div className="hidden h-full grid-cols-[2fr_3fr] lg:grid">
          <div className="relative z-[2] flex min-w-0 flex-col bg-[radial-gradient(circle_at_100%_50%,rgba(255,77,0,0.11),transparent_42%),linear-gradient(145deg,#111114_0%,#09090b_72%)] p-[clamp(24px,2.7vw,40px)]" aria-live="polite">
            <div className="min-h-0 flex-1">
              <p className="mb-[clamp(8px,1vw,14px)] text-[9px] font-bold uppercase tracking-[0.24em] text-red xl:text-[10px]">{heroLabel}</p>
              <h2 className="mb-[clamp(9px,1vw,14px)] max-w-[15ch] font-serif text-[clamp(27px,3vw,44px)] font-black uppercase leading-[0.96] text-white">
                {event.title}
              </h2>
              {event.subtitle && <p className="mb-2 hidden line-clamp-1 text-[12px] leading-relaxed text-cream/58 xl:block">{event.subtitle}</p>}
              <p className="mb-[clamp(8px,1vw,12px)] line-clamp-2 text-[clamp(11px,1.05vw,14px)] leading-relaxed text-cream/70">{metaParts.join(' · ')}</p>

              <div className="mb-[clamp(8px,1vw,12px)] flex flex-wrap items-center gap-2">
                {event.ageRestriction && <span className="rounded-md border border-white/14 px-2 py-0.5 text-[10px] text-cream/58">{event.ageRestriction}</span>}
                {event.duration && <span className="rounded-md border border-white/14 px-2 py-0.5 text-[10px] text-cream/58">{event.duration}</span>}
              </div>

              {price > 0 && <p className="mb-[clamp(10px,1.25vw,16px)] font-serif text-[clamp(17px,1.7vw,22px)] font-black tabular-nums text-white">от {formatPrice(price)}</p>}

              <div className="flex flex-wrap gap-2.5">
                <Link
                  href={`/events/${event.slug}`}
                  className="inline-flex min-h-11 items-center justify-center rounded-lg bg-red px-[clamp(18px,2vw,28px)] text-[13px] font-bold text-white transition-[background-color,transform] duration-200 hover:bg-red-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#0d0d0f] active:scale-[0.98] xl:text-sm"
                  aria-label={`Купить билет на ${event.title}`}
                >
                  Купить билет
                </Link>
                <Link
                  href={`/events/${event.slug}`}
                  className="inline-flex min-h-11 items-center justify-center rounded-lg border border-white/20 px-[clamp(16px,1.8vw,24px)] text-[13px] font-medium text-white/78 transition-[background-color,border-color,color,transform] duration-200 hover:border-white/35 hover:bg-white/[0.055] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#0d0d0f] active:scale-[0.98] xl:text-sm"
                  aria-label={`Подробнее о ${event.title}`}
                >
                  Подробнее
                </Link>
              </div>
            </div>

            {events.length > 1 && (
              <div className="mt-2 flex items-end justify-between border-t border-white/[0.07] pt-2 xl:mt-3 xl:pt-3">
                <SlideControls
                  count={events.length}
                  current={current}
                  previous={() => goTo(previousIndex)}
                  next={() => goTo(nextIndex)}
                  goTo={goTo}
                />
              </div>
            )}
          </div>

          <div className="relative min-w-0 overflow-hidden bg-black">
            {renderImages('absolute inset-0')}
            <div className="pointer-events-none absolute inset-y-0 left-0 z-[2] w-12 bg-gradient-to-r from-black/22 to-transparent" />
          </div>
        </div>
      </div>
    </section>
  )
}
