'use client'

import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Event } from '@/lib/types'
import { formatDateShort, formatPrice, minEventPrice, stripHtml } from '@/lib/utils'
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
          style={{ width: i === current ? 28 : 6, height: 6 }}
          aria-label={`Слайд ${i + 1}`}
        >
          <span className="absolute inset-0 rounded-full" style={{ background: i === current ? 'rgba(255,77,0,0.25)' : '#555' }} />
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

/* ═══════════════ TAG PILL ═══════════════ */
function TagPill({ children, accent }: { children: React.ReactNode; accent?: boolean }) {
  return (
    <span
      className="inline-flex items-center gap-1.5 text-[13px] font-medium px-3.5 py-1.5 rounded-md"
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

  useEffect(() => {
    if (paused) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const timer = setInterval(() => goTo((current + 1) % events.length), INTERVAL)
    return () => clearInterval(timer)
  }, [current, events.length, goTo, paused])

  const event = events[current] ?? events[0]
  if (!event) return null
  const price = minEventPrice(event)

  const pills = (
    <div className="flex flex-wrap gap-2 items-center mb-5">
      <TagPill>📅 {formatDateShort(event.date)}</TagPill>
      <TagPill>⏱ {event.duration}</TagPill>
      {event.rating > 0 && <TagPill accent>★ {event.rating}</TagPill>}
      {event.venueName && <TagPill>📍 {event.venueName}</TagPill>}
    </div>
  )

  return (
    <section
      className="relative w-full overflow-hidden bg-[#0A0A0A]"
      style={{ minHeight: '580px' }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* ── MOBILE: photo on top, text below ── */}
      <div className="lg:hidden">
        {/* Photo */}
        <div className="relative w-full" style={{ aspectRatio: '16/9' }}>
          {events.map((e, i) => (
            <div
              key={e.id}
              className="absolute inset-0 transition-opacity ease-in-out duration-700"
              style={{ opacity: i === current ? 1 : 0 }}
            >
              <Image
                src={e.image}
                alt={e.title}
                fill
                priority={i === 0}
                quality={85}
                className="object-contain object-top"
                style={{ objectFit: 'contain', objectPosition: 'top center' }}
                sizes="100vw"
              />
            </div>
          ))}
          <div
            className="absolute bottom-0 left-0 right-0 pointer-events-none"
            style={{ height: 64, background: 'linear-gradient(to top, #0A0A0A, transparent)' }}
          />
        </div>

        {/* Text */}
        <div className="px-5 pt-4 pb-4">
          <p className="font-sans text-[10px] uppercase tracking-[0.25em] text-cream/40 font-medium mb-3">
            Ближайшее шоу
          </p>
          <div className="mb-2">
            <EventBadges event={event} className="flex flex-wrap gap-2" />
          </div>
          <h2
            key={event.id}
            className="font-serif font-black text-cream leading-[0.92] tracking-[-0.01em] uppercase mb-4 animate-slide-in"
            style={{ fontSize: 'clamp(34px, 9vw, 52px)' }}
          >
            {event.title}
          </h2>
          {event.subtitle && (
            <p className="text-cream/50 font-sans text-sm mb-3 leading-relaxed">{event.subtitle}</p>
          )}
          {pills}
          <div className="flex flex-col gap-3 mb-3">
            <Link
              href={`/events/${event.slug}`}
              className="inline-flex items-center justify-center gap-2 bg-red text-white text-[15px] font-semibold px-8 py-3.5 rounded-lg transition-all duration-200"
              style={{ boxShadow: '0 4px 24px rgba(255,77,0,0.30)' }}
            >
              🎟 Купить билет
            </Link>
            <Link
              href={`/events/${event.slug}`}
              className="inline-flex items-center justify-center gap-2 bg-transparent text-white text-[15px] font-medium px-7 py-3.5 rounded-lg transition-all duration-200 hover:bg-white/10"
              style={{ border: '1.5px solid rgba(255,255,255,0.35)' }}
            >
              + Подробнее
            </Link>
          </div>
        </div>

        {events.length > 1 && (
          <div className="px-5 pb-6">
            <SliderDots count={events.length} current={current} goTo={goTo} interval={INTERVAL} />
          </div>
        )}
      </div>

      {/* ── DESKTOP: text left + photo right ── */}
      <div className="hidden lg:block" style={{ height: 'min(100vh, 760px)', minHeight: '580px' }}>
        {/* Photo — right side, absolute */}
        <div
          className="absolute top-8 bottom-8 right-8 xl:right-14 overflow-hidden rounded-xl"
          style={{ left: '43%' }}
        >
          {events.map((e, i) => (
            <div
              key={e.id}
              className="absolute inset-0 transition-opacity ease-in-out duration-700"
              style={{ opacity: i === current ? 1 : 0, zIndex: i === current ? 1 : 0 }}
            >
              <Image
                src={e.image}
                alt={e.title}
                fill
                priority={i === 0}
                quality={85}
                className="object-contain object-top"
                style={{ objectFit: 'contain', objectPosition: 'top center' }}
                sizes="57vw"
              />
            </div>
          ))}
          {/* left-edge fade into dark bg */}
          <div
            className="absolute inset-y-0 left-0 z-10 pointer-events-none"
            style={{ width: 80, background: 'linear-gradient(to right, rgba(10,10,10,0.55), transparent)' }}
          />
        </div>

        {/* Text — left column */}
        <div className="relative h-full flex flex-col justify-center z-10 px-12 xl:px-20" style={{ maxWidth: '48%' }}>
          <p className="font-sans text-[11px] uppercase tracking-[0.28em] text-cream/45 font-medium mb-4">
            Ближайшее шоу
          </p>
          <div className="mb-3">
            <EventBadges event={event} className="flex flex-wrap gap-2" />
          </div>
          <h2
            key={event.id}
            className="font-serif font-black text-cream leading-[1.05] tracking-[-0.01em] uppercase mb-5 animate-slide-in"
            style={{ fontSize: 'clamp(36px, 4.6vw, 72px)' }}
          >
            {event.title}
          </h2>
          {event.subtitle && (
            <p className="text-cream/50 font-sans text-[clamp(13px,1.1vw,16px)] mb-4 leading-relaxed">
              {event.subtitle}
            </p>
          )}
          {pills}
          {price > 0 && (
            <p className="text-cream/30 text-xs tracking-wide mb-4 font-sans">
              от {formatPrice(price)}
            </p>
          )}
          <div className="flex flex-wrap gap-3 mb-4">
            <Link
              href={`/events/${event.slug}`}
              className="inline-flex items-center gap-2 bg-red hover:bg-red-hover text-white text-[15px] font-semibold px-8 py-3.5 rounded-lg transition-all duration-200 hover:brightness-110 hover:scale-[1.02]"
              style={{ boxShadow: '0 4px 24px rgba(255,77,0,0.30)' }}
            >
              🎟 Купить билет
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

        {/* Bottom fade */}
        <div
          className="absolute bottom-0 left-0 right-0 z-20 pointer-events-none"
          style={{ height: 80, background: 'linear-gradient(to top, rgba(10,10,10,1) 0%, transparent 100%)' }}
        />

        {/* Dots */}
        {events.length > 1 && (
          <div className="absolute bottom-6 left-12 xl:left-20 z-30">
            <SliderDots count={events.length} current={current} goTo={goTo} interval={INTERVAL} />
          </div>
        )}
      </div>
    </section>
  )
}
