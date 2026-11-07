'use client'

import { useEffect, useId, useRef, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import type { Event } from '@/lib/types'
import { eventTimes, formatDateShort, formatPrice, minEventPrice } from '@/lib/utils'

export default function BigConcertsSlider({ events }: { events: Event[] }) {
  const id = useId()
  const rail = useRef<HTMLUListElement>(null)
  const [position, setPosition] = useState({ first: 0, last: 0, start: true, end: true })

  useEffect(() => {
    const element = rail.current
    if (!element) return
    const update = () => {
      const cards = Array.from(element.children) as HTMLElement[]
      const left = element.scrollLeft
      const right = left + element.clientWidth
      const first = cards.findIndex(card => card.offsetLeft + card.offsetWidth > left + 8)
      const visible = cards.filter(card => card.offsetLeft < right - 8 && card.offsetLeft + card.offsetWidth > left + 8)
      setPosition({
        first: Math.max(0, first),
        last: Math.max(0, cards.indexOf(visible[visible.length - 1])),
        start: left <= 2,
        end: left >= element.scrollWidth - element.clientWidth - 2,
      })
    }
    update()
    const observer = new ResizeObserver(update)
    observer.observe(element)
    element.addEventListener('scroll', update, { passive: true })
    return () => {
      observer.disconnect()
      element.removeEventListener('scroll', update)
    }
  }, [events])

  const move = (direction: number) => {
    const element = rail.current
    if (!element) return
    const cards = Array.from(element.children) as HTMLElement[]
    const index = direction > 0 ? position.first + 1 : position.first - 1
    const target = cards[Math.max(0, Math.min(cards.length - 1, index))]
    element.scrollTo({
      left: target.offsetLeft,
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth',
    })
  }

  if (!events.length) return null

  return (
    <section aria-labelledby={`${id}-title`} aria-roledescription="карусель" className="mb-12 lg:mb-16">
      <div className="mb-6 flex items-end justify-between gap-5 lg:mb-8">
        <div className="max-w-[620px]">
          <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-red">Особый повод для вечера</p>
          <h2 id={`${id}-title`} className="font-serif text-[26px] font-black uppercase leading-[1.12] text-cream sm:text-3xl lg:text-[40px]">Большие сольные концерты</h2>
        </div>
        <div className="hidden shrink-0 gap-2 sm:flex">
          {[-1, 1].map(direction => (
            <button key={direction} type="button" aria-label={direction < 0 ? 'Предыдущий концерт' : 'Следующий концерт'} aria-controls={`${id}-rail`}
              disabled={direction < 0 ? position.start : position.end} onClick={() => move(direction)}
              className="flex h-12 w-12 items-center justify-center rounded-full border border-white/20 text-cream transition-colors hover:border-red hover:bg-red focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-red disabled:cursor-default disabled:opacity-25 disabled:hover:border-white/20 disabled:hover:bg-transparent">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true" className={direction < 0 ? 'rotate-180' : ''}><path d="M4 12h15M13 5l7 7-7 7" /></svg>
            </button>
          ))}
        </div>
      </div>

      <ul ref={rail} id={`${id}-rail`} aria-label="Большие сольные концерты" tabIndex={0}
        onKeyDown={e => {
          if (e.target !== e.currentTarget || !['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(e.key)) return
          e.preventDefault()
          if (e.key === 'Home' || e.key === 'End') {
            rail.current?.scrollTo({ left: e.key === 'Home' ? 0 : rail.current.scrollWidth, behavior: 'instant' })
          } else move(e.key === 'ArrowRight' ? 1 : -1)
        }}
        className="relative flex snap-x snap-mandatory gap-4 overflow-x-auto overscroll-x-contain pb-3 pt-1 scrollbar-hide sm:gap-5 lg:gap-6 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-red">
        {events.map((event, index) => {
          const price = minEventPrice(event)
          return (
            <li key={event.id} className="w-[88%] shrink-0 snap-start sm:w-[calc((100%-20px)/2)] lg:w-[calc((100%-48px)/3)]">
              <Link href={`/events/${event.slug}`} className="group flex h-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-surface transition-colors hover:border-red/60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red">
                <div className="relative aspect-[3/2] overflow-hidden bg-white/[0.03]">
                  {event.image && <Image src={event.image} alt={event.title} fill priority={index === 0} sizes="(max-width: 639px) 85vw, (max-width: 1023px) 45vw, 430px" className="object-cover transition-transform duration-500 motion-safe:group-hover:scale-[1.03]" />}
                </div>
                <div className="flex flex-1 flex-col p-4 sm:p-5">
                  <p className="mb-3 text-xs font-medium text-red">{formatDateShort(event.date)} <span className="px-1 text-muted" aria-hidden="true">/</span> {eventTimes(event).join(' · ')}</p>
                  <h3 className="mb-2 text-xl font-semibold leading-tight text-cream transition-colors group-hover:text-red sm:text-[22px]">{event.title}</h3>
                  <p className="mb-5 text-sm leading-relaxed text-muted">{[event.venueName, event.city].filter(Boolean).join(' · ')}</p>
                  <div className="mt-auto flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-4">
                    {price > 0 && <p className="text-base font-semibold text-cream">от {formatPrice(price)}</p>}
                    <span style={event.soldOut ? { background: "#595959" } : undefined} className="inline-flex min-h-[44px] items-center gap-3 rounded-lg bg-red px-4 text-sm font-semibold text-white transition-colors group-hover:bg-red-hover">{event.soldOut ? "Билеты закончились" : "Билеты"} <span aria-hidden="true">↗</span></span>
                  </div>
                </div>
              </Link>
              <span className="sr-only">Концерт {index + 1} из {events.length}</span>
            </li>
          )
        })}
      </ul>
      {events.length > 1 && <div className="mt-4 flex items-center gap-4 text-xs text-muted">
        <span className="shrink-0 tabular-nums" aria-live="polite" aria-atomic="true">{String(position.first + 1).padStart(2, '0')} <span className="px-1 text-white/30">/</span> {String(events.length).padStart(2, '0')}</span>
        <div className="h-px flex-1 bg-white/10" aria-hidden="true"><div className="h-full bg-red transition-[width] duration-200 motion-reduce:transition-none" style={{ width: `${((position.last + 1) / events.length) * 100}%` }} /></div>
        <span className="shrink-0 sm:hidden">Листайте →</span>
      </div>}
    </section>
  )
}
