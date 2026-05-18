'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
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
const pillColors: Record<string, { text: string; border: string; bg: string; glow: string }> = {
  date:   { text: '#93C5FD', border: 'rgba(147,197,253,0.30)', bg: 'rgba(59,130,246,0.10)', glow: '0 0 12px rgba(59,130,246,0.12)' },
  time:   { text: '#C4B5FD', border: 'rgba(196,181,253,0.30)', bg: 'rgba(139,92,246,0.10)', glow: '0 0 12px rgba(139,92,246,0.12)' },
  venue:  { text: '#5EEAD4', border: 'rgba(94,234,212,0.30)', bg: 'rgba(20,184,166,0.10)', glow: '0 0 12px rgba(20,184,166,0.12)' },
  rating: { text: '#FFB800', border: 'rgba(255,184,0,0.35)',  bg: 'rgba(255,184,0,0.10)',  glow: '0 0 14px rgba(255,184,0,0.16)' },
}

function TagPill({ children, variant }: { children: React.ReactNode; variant: 'date' | 'time' | 'venue' | 'rating' }) {
  const c = pillColors[variant]
  return (
    <span
      className="inline-flex items-center gap-2 text-[11px] lg:text-[13px] font-semibold px-3.5 py-2 rounded-lg backdrop-blur-sm transition-all duration-300 hover:brightness-125"
      style={{
        border: `1px solid ${c.border}`,
        color: c.text,
        background: c.bg,
        boxShadow: c.glow,
      }}
    >
      {children}
    </span>
  )
}

/* ═══════════════ IMAGE SLIDE (memo'd to avoid re-renders of invisible slides) ═══════════════ */
function SlideImage({ event, isPriority, cover }: { event: Event; isPriority: boolean; cover?: boolean }) {
  return (
    <Image
      src={event.image}
      alt={event.title}
      fill
      priority={isPriority}
      quality={85}
      className={cover ? 'object-cover object-top' : 'object-contain object-top'}
      style={cover
        ? { objectFit: 'cover', objectPosition: 'top center' }
        : { objectFit: 'contain', objectPosition: 'top center' }
      }
      sizes={cover ? '55vw' : '(max-width: 1024px) 100vw, 57vw'}
    />
  )
}

/* ═══════════════ MAIN ═══════════════ */
export default function HeroSlider({ events }: HeroSliderProps) {
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

  // Only render current slide + 1 neighbor on each side (+ the slide we're animating FROM)
  const visibleIndices = new Set<number>()
  visibleIndices.add(current)
  visibleIndices.add((current - 1 + events.length) % events.length)
  visibleIndices.add((current + 1) % events.length)
  if (animating) visibleIndices.add(prevIndexRef.current)

  const pills = (
    <div className="flex flex-wrap gap-2.5 items-center mb-5">
      <TagPill variant="date">
        <span className="font-normal opacity-60 text-[10px]">Дата</span> {formatDateShort(event.date)}
      </TagPill>
      <TagPill variant="time">
        ≈ {event.duration}
      </TagPill>
      {event.rating > 0 && <TagPill variant="rating">★ {event.rating}</TagPill>}
      {event.venueName && (
        <TagPill variant="venue">
          <span className="font-normal opacity-60 text-[10px]">Площадка</span> {event.venueName}
        </TagPill>
      )}
    </div>
  )

  return (
    <section
      className="relative w-full overflow-hidden bg-[#0A0A0A] pt-0 lg:pt-14"
      style={{ minHeight: '580px' }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* ── MOBILE: photo on top, text below ── */}
      <div className="lg:hidden">
        {/* Photo */}
        <div className="relative w-full" style={{ aspectRatio: '16/9' }}>
          {events.map((e, i) => {
            if (!visibleIndices.has(i)) return null
            return (
              <div
                key={e.id}
                className="absolute inset-0 transition-opacity ease-in-out duration-700"
                style={{ opacity: i === current ? 1 : 0 }}
              >
                <SlideImage event={e} isPriority={i === current} cover />
              </div>
            )
          })}
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
            className="font-serif font-black text-cream leading-[1.1] tracking-[-0.01em] uppercase mb-4 animate-slide-in"
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
              style={{ boxShadow: '0 4px 16px rgba(255,77,0,0.18)' }}
            >
              Купить билет
            </Link>
            <Link
              href={`/events/${event.slug}`}
              className="inline-flex items-center justify-center gap-2 bg-transparent text-white text-[15px] font-medium px-7 py-3.5 rounded-lg transition-all duration-200 hover:bg-white/10"
              style={{ border: '1.5px solid rgba(255,255,255,0.25)' }}
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
      <div className="hidden lg:block" style={{ height: 'min(100vh, 680px)', minHeight: '540px' }}>
        {/* Photo — right side, absolute */}
        <div
          className="absolute top-8 bottom-8 right-8 xl:right-14 overflow-hidden rounded-xl"
          style={{ left: '45%' }}
        >
          {events.map((e, i) => {
            if (!visibleIndices.has(i)) return null
            return (
              <div
                key={e.id}
                className="absolute inset-0 transition-opacity ease-in-out duration-700"
                style={{ opacity: i === current ? 1 : 0, zIndex: i === current ? 1 : 0 }}
              >
                <SlideImage event={e} isPriority={i === current} cover />
              </div>
            )
          })}
          {/* left-edge fade into dark bg */}
          <div
            className="absolute inset-y-0 left-0 z-10 pointer-events-none"
            style={{ width: 60, background: 'linear-gradient(to right, rgba(10,10,10,0.35), transparent)' }}
          />
        </div>

        {/* Text — left column */}
        <div className="relative h-full flex flex-col justify-center z-10 pl-12 xl:pl-20 pr-6 pt-4 pb-8" style={{ maxWidth: '46%' }}>
          <p className="font-sans text-[11px] uppercase tracking-[0.28em] text-cream/45 font-medium mb-4">
            Ближайшее шоу
          </p>
          <div className="mb-3">
            <EventBadges event={event} className="flex flex-wrap gap-2" />
          </div>
          <h2
            key={event.id}
            className="font-serif font-black text-cream leading-[1.05] tracking-[-0.01em] uppercase mb-5 animate-slide-in"
            style={{ fontSize: 'clamp(36px, 3.6vw, 72px)' }}
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
              style={{ boxShadow: '0 4px 16px rgba(255,77,0,0.18)' }}
            >
              Купить билет
            </Link>
            <Link
              href={`/events/${event.slug}`}
              className="inline-flex items-center gap-2 bg-transparent text-white text-[15px] font-medium px-7 py-3.5 rounded-lg transition-all duration-200 hover:bg-white/10"
              style={{ border: '1.5px solid rgba(255,255,255,0.25)' }}
            >
              + Подробнее
            </Link>
          </div>
        </div>

        {/* Bottom fade */}
        <div
          className="absolute bottom-0 left-0 right-0 z-20 pointer-events-none"
          style={{ height: 40, background: 'linear-gradient(to top, rgba(10,10,10,1) 0%, transparent 100%)' }}
        />

        {/* Dots */}
        {events.length > 1 && (
          <div className="absolute bottom-4 left-12 xl:left-20 z-30">
            <SliderDots count={events.length} current={current} goTo={goTo} interval={INTERVAL} />
          </div>
        )}
      </div>
    </section>
  )
}
