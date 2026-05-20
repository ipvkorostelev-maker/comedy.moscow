'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { cn } from '@/lib/utils'

// ── TYPES ──────────────────────────────────────────────────────────────────────

export interface TourShow {
  id: string | number
  city: string
  venue: string
  date: string      // formatted "DD.MM"
  href: string      // full link for buy button
  isPrivate: boolean
  isSoldOut?: boolean
  isNearest?: boolean
  posterImage: string
}

interface Props {
  artistName: string
  tourLabel?: string
  artistPhoto?: string
  shows: TourShow[]
}

// ── CONSTANTS ──────────────────────────────────────────────────────────────────

const MONTH_LABELS: Record<string, string> = {
  '01': 'Январь', '02': 'Февраль', '03': 'Март', '04': 'Апрель',
  '05': 'Май', '06': 'Июнь', '07': 'Июль', '08': 'Август',
  '09': 'Сентябрь', '10': 'Октябрь', '11': 'Ноябрь', '12': 'Декабрь',
}

// ── HELPERS ────────────────────────────────────────────────────────────────────

type ListItem =
  | { type: 'separator'; label: string; key: string }
  | { type: 'show'; show: TourShow; rowIndex: number }

function buildListItems(shows: TourShow[]): ListItem[] {
  const items: ListItem[] = []
  let prevMonth = ''
  let rowIndex = 0
  for (const show of shows) {
    const month = show.date.split('.')[1] ?? ''
    if (month !== prevMonth) {
      items.push({ type: 'separator', label: MONTH_LABELS[month] ?? month, key: month })
      prevMonth = month
    }
    items.push({ type: 'show', show, rowIndex: rowIndex++ })
  }
  return items
}

// ── COMPONENT ──────────────────────────────────────────────────────────────────

export default function ArtistTourClient({ artistName, tourLabel = 'стендап-тур', artistPhoto, shows }: Props) {
  const firstId = shows[0]?.id ?? null
  const [activeId, setActiveId] = useState<string | number | null>(firstId)
  const activeShow = shows.find((s) => s.id === activeId) ?? shows[0]
  const listItems = buildListItems(shows)
  const totalPublic = shows.filter((s) => !s.isPrivate).length

  if (shows.length === 0) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <p className="text-muted text-lg">Концерты ещё не добавлены</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-bg pt-12 lg:pt-0">

      {/* ── MOBILE HEADER ──────────────────────────────────────────── */}
      <div className="lg:hidden px-5 pt-6 pb-5 border-b border-border">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="font-serif font-black text-[2.5rem] leading-[0.95] text-cream uppercase">
              {artistName}
            </h1>
            <div className="flex items-center gap-2 mt-2.5">
              <span className="text-muted text-sm">{tourLabel}</span>
              <span className="w-1 h-1 rounded-full bg-muted-2 flex-shrink-0" />
              <span className="text-muted text-sm">{totalPublic} концерта</span>
            </div>
          </div>
          <span className="shrink-0 mt-1 px-2.5 py-1 rounded-full border border-border text-muted text-[11px] font-medium tabular-nums">
            {shows.length} городов
          </span>
        </div>
      </div>

      {/* ── LAYOUT ─────────────────────────────────────────────────── */}
      <div className="flex flex-col lg:flex-row">

        {/* ── LEFT PANEL ─────────────────────────────────────────── */}
        <div className="lg:sticky lg:top-14 lg:h-[calc(100vh-3.5rem)] w-full lg:w-[42%] shrink-0 overflow-hidden">

          {/* Mobile: active show visual card */}
          {activeShow?.posterImage && (
            <div className="lg:hidden mx-4 my-4">
              <div className="relative rounded-2xl overflow-hidden aspect-video">
                {shows.map((show) => (
                  show.posterImage ? (
                    <Image
                      key={show.id}
                      src={show.posterImage}
                      alt={`${artistName} — ${show.venue}`}
                      fill
                      className={cn(
                        'object-cover transition-opacity duration-500',
                        show.id === activeId ? 'opacity-100' : 'opacity-0'
                      )}
                      sizes="100vw"
                    />
                  ) : null
                ))}
              </div>
            </div>
          )}

          {/* Desktop: full-height sticky poster */}
          <div className="hidden lg:block absolute inset-0">
            {/* Tour photo — base layer */}
            {artistPhoto && (
              <Image
                src={artistPhoto}
                alt={artistName}
                fill
                priority
                className={cn(
                  'object-cover transition-opacity duration-500',
                  activeShow?.posterImage ? 'opacity-0' : 'opacity-100'
                )}
                sizes="42vw"
              />
            )}
            {shows.map((show) => (
              show.posterImage ? (
                <Image
                  key={show.id}
                  src={show.posterImage}
                  alt={`${artistName} — ${show.venue}`}
                  fill
                  priority={show.id === activeId}
                  className={cn(
                    'object-cover transition-opacity duration-600',
                    show.id === activeId ? 'opacity-100' : 'opacity-0'
                  )}
                  sizes="42vw"
                />
              ) : null
            ))}
            {/* Right-edge blend */}
            <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-r from-transparent to-bg" />
            {/* Bottom vignette */}
            <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-bg via-bg/40 to-transparent" />
          </div>
        </div>

        {/* ── RIGHT PANEL ────────────────────────────────────────── */}
        <div className="flex-1 lg:pt-14 min-w-0">

          {/* Desktop header */}
          <div className="hidden lg:block px-10 xl:px-14 pt-10 pb-8 border-b border-border">
            <h1 className="font-serif font-black text-5xl xl:text-[3.5rem] leading-[0.92] text-cream uppercase">
              {artistName}
            </h1>
            <div className="flex items-center gap-3 mt-3">
              <span className="text-muted">{tourLabel}</span>
              <span className="w-1 h-1 rounded-full bg-muted-2" />
              <span className="text-muted text-sm">{totalPublic} открытых концерта</span>
              <span className="w-1 h-1 rounded-full bg-muted-2" />
              <span className="text-muted text-sm">{shows.length} городов</span>
            </div>
          </div>

          {/* Tour list */}
          <ul className="flex flex-col gap-2 px-4 lg:px-10 xl:px-14 py-4 lg:py-6">
            {listItems.map((item) => {

              /* Month separator */
              if (item.type === 'separator') {
                return (
                  <li key={item.key} className="flex items-center gap-3 pt-2 pb-1 px-1">
                    <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-muted-2">
                      {item.label}
                    </span>
                    <span className="flex-1 h-px bg-border" />
                  </li>
                )
              }

              const { show } = item
              const isActive = show.id === activeId

              return (
                <li key={show.id}>
                  <button
                    type="button"
                    onClick={() => setActiveId(show.id)}
                    className={cn(
                      'group w-full text-left rounded-2xl border transition-all duration-150 overflow-hidden',
                      isActive
                        ? 'bg-[#2A0800] border-red'
                        : 'bg-surface border-border hover:border-red'
                    )}
                  >

                    {/* ── DESKTOP: single row ── */}
                    <div className="hidden lg:flex items-center gap-3 px-6 py-[18px]">
                      {/* City */}
                      <div className="flex flex-col w-40 shrink-0">
                        <span className={cn(
                          'font-medium text-[15px] leading-tight transition-colors duration-150',
                          isActive ? 'text-cream' : 'text-cream/85 group-hover:text-cream'
                        )}>
                          {show.city}
                        </span>
                        {show.isNearest && (
                          <span className="text-red text-[9px] font-bold uppercase tracking-wider mt-0.5">Ближайший</span>
                        )}
                        {show.isSoldOut && (
                          <span className="text-muted text-[9px] font-bold uppercase tracking-wider mt-0.5">Нет мест</span>
                        )}
                      </div>

                      <span className="text-border leading-none select-none shrink-0">|</span>

                      {/* Venue */}
                      <span className={cn(
                        'text-sm flex-1 min-w-0 truncate transition-colors duration-150',
                        isActive ? 'text-cream/75' : 'text-muted group-hover:text-cream/55'
                      )}>
                        {show.venue}
                      </span>

                      {/* Date */}
                      <span className={cn(
                        'text-sm font-medium tabular-nums whitespace-nowrap shrink-0 mx-4',
                        isActive ? 'text-cream' : 'text-cream/50 group-hover:text-cream/75'
                      )}>
                        {show.date}
                      </span>

                      {/* Action */}
                      {show.isPrivate ? (
                        <span className="text-muted text-[11px] text-right leading-snug w-28 shrink-0">
                          Концерт для<br />гостей отеля
                        </span>
                      ) : show.isSoldOut ? (
                        <span className="text-muted text-[11px] text-right w-28 shrink-0">Нет билетов</span>
                      ) : (
                        <Link
                          href={show.href}
                          onClick={(e) => e.stopPropagation()}
                          className={cn(
                            'shrink-0 px-5 py-2.5 rounded-xl text-[11px] font-bold tracking-widest uppercase transition-all duration-150 whitespace-nowrap',
                            isActive
                              ? 'bg-red text-white hover:bg-red-hover shadow-red-sm'
                              : 'bg-[#252525] border border-[#3A3A3F] text-cream/60 group-hover:bg-red group-hover:border-red group-hover:text-white'
                          )}
                        >
                          Купить билет
                        </Link>
                      )}
                    </div>

                    {/* ── MOBILE: stacked ── */}
                    <div className="lg:hidden">
                      {/* Info row */}
                      <div className="flex items-center gap-2.5 px-4 pt-4 pb-3">
                        <span className={cn(
                          'text-sm font-medium tabular-nums whitespace-nowrap shrink-0',
                          isActive ? 'text-cream' : 'text-cream/60'
                        )}>
                          {show.date}
                        </span>
                        <span className="text-border leading-none select-none shrink-0">|</span>
                        <span className={cn(
                          'font-medium text-[15px] shrink-0',
                          isActive ? 'text-cream' : 'text-cream/90'
                        )}>
                          {show.city}
                        </span>
                        <span className={cn(
                          'ml-auto text-sm text-right truncate max-w-[45%]',
                          isActive ? 'text-cream/65' : 'text-muted'
                        )}>
                          {show.venue}
                        </span>
                      </div>

                      {/* Button row */}
                      <div className="px-3 pb-3">
                        {show.isPrivate ? (
                          <div className="py-2.5 text-muted text-[11px] text-center">
                            Концерт для гостей отеля
                          </div>
                        ) : show.isSoldOut ? (
                          <div className="w-full py-3 rounded-xl bg-[#252525] border border-[#3A3A3F] text-muted text-[11px] font-bold tracking-widest uppercase text-center">
                            Нет билетов
                          </div>
                        ) : (
                          <Link
                            href={show.href}
                            onClick={(e) => e.stopPropagation()}
                            className={cn(
                              'block w-full py-3 rounded-xl text-[11px] font-bold tracking-widest uppercase text-center transition-all duration-150',
                              isActive
                                ? 'bg-red text-white shadow-red-sm'
                                : 'bg-[#252525] border border-[#3A3A3F] text-cream/60'
                            )}
                          >
                            Купить билет
                          </Link>
                        )}
                      </div>
                    </div>

                  </button>
                </li>
              )
            })}
          </ul>

          <div className="h-8" />
        </div>
      </div>
    </div>
  )
}
