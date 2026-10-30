'use client'

import { useEffect, useMemo, useRef, useState, useTransition } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import type { Event } from '@/lib/types'
import { eventTimes, formatDateShort, formatPrice, minEventPrice, cn } from '@/lib/utils'

function moscowDate() {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Moscow', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date())
}
function addDays(date: string, count: number) {
  const day = new Date(`${date}T12:00:00+03:00`)
  day.setUTCDate(day.getUTCDate() + count)
  return day.toISOString().slice(0, 10)
}

export default function HomeSchedule({ events, today }: { events: Event[]; today: string }) {
  const dateInput = useRef<HTMLInputElement>(null)
  const params = useSearchParams()
  const router = useRouter()
  const [pending, startTransition] = useTransition()
  const [query, setQuery] = useState(params.get('q') ?? '')
  const [limit, setLimit] = useState(8)
  const [currentDay, setCurrentDay] = useState(today)
  const dateParam = params.get('date') ?? ''
  const selected = /^\d{4}-\d{2}-\d{2}$/.test(dateParam) && !Number.isNaN(Date.parse(dateParam)) ? dateParam : ''
  const weekend = !selected && params.get('period') === 'weekend'
  useEffect(() => { setCurrentDay(moscowDate()) }, [])
  useEffect(() => { setQuery(params.get('q') ?? ''); setLimit(8) }, [params])
  const tomorrow = addDays(currentDay, 1)
  const weekday = new Date(`${currentDay}T12:00:00+03:00`).getUTCDay()
  const saturday = addDays(currentDay, weekday === 0 ? 0 : (6 - weekday + 7) % 7)
  const sunday = weekday === 0 ? currentDay : addDays(saturday, 1)
  const dates = useMemo(() => [...new Set(events.map(e => e.date))].sort(), [events])
  const filtered = events.filter(e => {
    const text = [e.title, e.venueName, ...(e.artistNames ?? [])].join(' ').toLocaleLowerCase('ru')
    return (!selected || e.date === selected) && (!weekend || (e.date >= saturday && e.date <= sunday)) && text.includes(query.trim().toLocaleLowerCase('ru'))
  })
  function navigate(date: string, period = '', search = query) {
    const next = new URLSearchParams()
    if (date) next.set('date', date)
    if (period) next.set('period', period)
    if (search.trim()) next.set('q', search.trim())
    setLimit(8)
    startTransition(() => router.push(next.size ? `/?${next}` : '/', { scroll: false }))
  }
  const chip = (active: boolean) => cn('min-h-[44px] rounded-full px-4 text-sm font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-red', active ? 'bg-cream text-bg' : 'bg-white/[0.05] text-cream/75 hover:bg-white/10 border border-white/10')
  return (
    <section id="schedule" aria-label="Афиша концертов" className="scroll-mt-20">
      <div className="rounded-2xl border border-white/10 bg-[#151515] p-4 sm:p-6">
        <form onSubmit={e => { e.preventDefault(); navigate(selected, weekend ? 'weekend' : '') }} role="search" className="relative">
          <label htmlFor="concert-search" className="sr-only">Поиск по артисту, концерту или площадке</label>
          <svg aria-hidden="true" className="absolute left-4 top-4 text-muted" width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="8.5" cy="8.5" r="5.5"/><path d="m13 13 5 5"/></svg>
          <input id="concert-search" type="search" value={query} onChange={e => { setQuery(e.target.value); setLimit(8) }} placeholder="Артист, концерт или площадка" className="w-full h-[52px] pl-12 pr-20 rounded-xl bg-bg border border-white/15 text-cream text-sm sm:text-base placeholder:text-muted focus:outline-none focus:border-red" />
          <button type="submit" className="absolute right-1 top-1 min-h-[44px] px-3 text-sm font-semibold text-red rounded-lg hover:bg-white/5">Найти</button>
        </form>
        <div className="mt-4 flex flex-wrap gap-2 items-center" aria-label="Фильтры по дате">
          <button className={chip(!selected && !weekend)} aria-pressed={!selected && !weekend} onClick={() => navigate('')}>Все даты</button>
          <button className={chip(selected === currentDay)} aria-pressed={selected === currentDay} onClick={() => navigate(currentDay)}>Сегодня</button>
          <button className={chip(selected === tomorrow)} aria-pressed={selected === tomorrow} onClick={() => navigate(tomorrow)}>Завтра</button>
          <button className={chip(weekend)} aria-pressed={weekend} onClick={() => navigate('', 'weekend')}>Выходные</button>
          <form onSubmit={e => { e.preventDefault(); navigate(dateInput.current?.value ?? '') }} className="flex min-h-[44px] flex-wrap items-center gap-2 text-sm text-cream/75">
            <label htmlFor="concert-date">Выбрать дату</label>
            <input id="concert-date" ref={dateInput} key={selected} aria-label="Выбрать дату концерта" type="date" min={currentDay} defaultValue={selected} required className="min-h-[44px] w-[145px] rounded-lg border border-white/15 bg-bg px-2 text-cream [color-scheme:dark] focus:outline-red" />
            <button type="submit" aria-label="Применить дату" className="min-h-[44px] min-w-[44px] rounded-lg bg-white/10 text-cream hover:bg-white/20">→</button>
          </form>
        </div>
      </div>
      <div className="mt-8 mb-5 flex flex-wrap items-baseline justify-between gap-3">
        <h2 className="font-serif uppercase text-xl sm:text-2xl text-cream">{selected ? `Афиша на ${formatDateShort(selected)}` : weekend ? 'В эти выходные' : 'Ближайшие концерты'}</h2>
        <p role="status" className="text-sm text-muted">{pending ? 'Обновляем афишу…' : `Найдено концертов: ${filtered.length}`}</p>
      </div>
      {filtered.length ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-5 gap-y-5 sm:gap-y-9" aria-busy={pending}>
            {filtered.slice(0, limit).map((event, i) => <HomeEventCard key={event.id} event={event} priority={i < 4} />)}
          </div>
          {filtered.length > limit && <div className="mt-8 text-center"><button onClick={() => setLimit(n => n + 8)} className="min-h-[48px] border border-white/20 rounded-xl px-8 text-sm font-semibold text-cream hover:bg-white/10">Показать ещё <span className="text-muted">· осталось {filtered.length - limit}</span></button></div>}
        </>
      ) : (
        <div className="py-12 px-5 rounded-xl border border-white/10 text-center">
          <h3 className="text-xl font-semibold text-cream">Концертов не найдено</h3>
          <p className="mt-2 text-sm text-muted">Попробуйте другую дату или измените запрос.</p>
          <button onClick={() => { setQuery(''); navigate('', '', '') }} className="mt-5 min-h-[44px] px-5 rounded-lg bg-red text-white font-semibold text-sm">Показать всю афишу</button>
          {dates.length > 0 && <div className="mt-6"><p className="mb-3 text-sm text-muted">Ближайшие даты с концертами</p><div className="flex flex-wrap justify-center gap-2">{dates.filter(d => d >= currentDay).slice(0, 3).map(d => <button key={d} className={chip(false)} onClick={() => { setQuery(''); navigate(d, '', '') }}>{formatDateShort(d)}</button>)}</div></div>}
        </div>
      )}
    </section>
  )
}

export function HomeEventCard({ event, priority = false }: { event: Event; priority?: boolean }) {
  const price = minEventPrice(event)
  return (
    <Link href={`/events/${event.slug}`} className="group flex gap-4 sm:flex-col sm:gap-0 border-b border-white/10 pb-5 sm:border-0 sm:pb-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-red rounded-lg">
      <div className="relative shrink-0 w-[112px] h-[92px] sm:w-full sm:h-auto sm:aspect-[3/2] overflow-hidden rounded-lg bg-surface">
        {event.image && <Image src={event.image} alt={event.title} fill priority={priority} sizes="(max-width: 639px) 112px, (max-width: 1023px) 50vw, 25vw" className="object-cover transition-transform duration-300 group-hover:scale-[1.03]" />}
      </div>
      <div className="min-w-0 flex flex-col sm:pt-4">
        <p className="text-xs sm:text-sm text-cream/75 mb-1.5">{formatDateShort(event.date)} <span className="text-red">· {eventTimes(event).join(' / ')}</span></p>
        <h3 className="text-sm sm:text-lg leading-snug font-semibold text-cream group-hover:text-red transition-colors">{event.title}</h3>
        <p className="mt-1.5 text-xs sm:text-sm text-muted">{event.venueName || event.city}</p>
        <div className="mt-2 sm:mt-3 flex flex-wrap justify-between items-center gap-2">{price > 0 && <span className="text-sm sm:text-base font-semibold text-cream">от {formatPrice(price)}</span>}<span className="hidden sm:inline text-xs font-medium text-red">Выбрать билеты ↗</span></div>
      </div>
    </Link>
  )
}
