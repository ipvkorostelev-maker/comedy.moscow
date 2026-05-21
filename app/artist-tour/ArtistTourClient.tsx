'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { cn, pluralForm } from '@/lib/utils'

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

function formatDateLong(date: string): string {
  const [day, month] = date.split('.')
  if (!day || !month) return date
  const MONTHS_GENITIVE: Record<string, string> = {
    '01': 'января', '02': 'февраля', '03': 'марта', '04': 'апреля',
    '05': 'мая', '06': 'июня', '07': 'июля', '08': 'августа',
    '09': 'сентября', '10': 'октября', '11': 'ноября', '12': 'декабря',
  }
  return `${parseInt(day, 10)} ${MONTHS_GENITIVE[month] ?? month}`
}

// ── COMPONENT ──────────────────────────────────────────────────────────────────

export default function ArtistTourClient({ artistName, tourLabel = 'стендап-тур', artistPhoto, shows }: Props) {
  const firstId = shows[0]?.id ?? null
  const [activeId, setActiveId] = useState<string | number | null>(firstId)
  const activeShow = shows.find((s) => s.id === activeId) ?? shows[0]
  const [loadedImages, setLoadedImages] = useState<Set<string | number>>(new Set())
  const [artistPhotoLoaded, setArtistPhotoLoaded] = useState(false)
  const listItems = buildListItems(shows)
  const totalPublic = shows.filter((s) => !s.isPrivate).length

  // Склонение числительных
  const concertForm = pluralForm(totalPublic)
  const cityForm = pluralForm(shows.length)

  const concertsShort = concertForm === 0
    ? `${totalPublic} концерт`
    : concertForm === 1
      ? `${totalPublic} концерта`
      : `${totalPublic} концертов`

  const concertsFull = concertForm === 0
    ? `${totalPublic} открытый концерт`
    : concertForm === 1
      ? `${totalPublic} открытых концерта`
      : `${totalPublic} открытых концертов`

  const citiesLabel = cityForm === 0
    ? `${shows.length} город`
    : cityForm === 1
      ? `${shows.length} города`
      : `${shows.length} городов`

  if (shows.length === 0) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <p className="text-muted text-lg">Концерты ещё не добавлены</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen lg:pt-0">
      <style>{`
        @keyframes glowPulse {
          0%, 100% { opacity: 0.65; }
          50% { opacity: 1; }
        }
      `}</style>


      {/* ── LAYOUT ─────────────────────────────────────────────────── */}
      <div className="flex flex-col lg:flex-row">

        {/* ── LEFT PANEL ─────────────────────────────────────────── */}
        <div className="lg:sticky lg:top-14 lg:h-[calc(100vh-3.5rem)] w-full lg:w-[42%] shrink-0 relative z-10">

          {/* Mobile: photo card */}
          <div className="lg:hidden px-4 pb-4">
            {(artistPhoto || activeShow?.posterImage) ? (
              <>
                <div
                  className="relative w-full overflow-hidden"
                  style={{
                    borderRadius: 40, aspectRatio: '3/4',
                    marginTop: 30,
                    boxShadow: '0 0 40px rgba(255,77,0,0.15), 0 0 80px rgba(255,77,0,0.06), 0 0 0 1px rgba(255,77,0,0.10)',
                  }}
                >
                  {artistPhoto ? (
                    <>
                      <Image
                        src={artistPhoto}
                        alt={artistName}
                        fill
                        className="object-cover"
                        sizes="calc(100vw - 32px)"
                        priority
                        onLoad={() => setArtistPhotoLoaded(true)}
                      />
                      <div className={cn(
                        'absolute inset-0 bg-zinc-900 transition-opacity duration-700',
                        artistPhotoLoaded ? 'opacity-0 pointer-events-none' : 'opacity-100'
                      )} />
                    </>
                  ) : (
                    shows.map((show) => (
                      show.posterImage ? (
                        <div key={show.id} className="absolute inset-0">
                          <Image
                            src={show.posterImage}
                            alt={`${artistName} — ${show.venue}`}
                            fill
                            className={cn('object-cover transition-opacity duration-500', show.id === activeId ? 'opacity-100' : 'opacity-0')}
                            sizes="calc(100vw - 32px)"
                            onLoad={() => setLoadedImages((prev) => new Set(prev).add(show.id))}
                          />
                          <div className={cn(
                            'absolute inset-0 bg-zinc-900 transition-opacity duration-700',
                            show.id === activeId && !loadedImages.has(show.id)
                              ? 'opacity-100'
                              : 'opacity-0 pointer-events-none'
                          )} />
                        </div>
                      ) : null
                    ))
                  )}
                </div>
                <div className="px-1 pt-4 pb-1">
                  <h1 className="font-serif font-black text-cream uppercase" style={{ fontSize: 'clamp(1.9rem, 8vw, 2.8rem)', lineHeight: 0.95, letterSpacing: '-0.01em' }}>
                    {artistName}
                  </h1>
                  <div className="flex items-center gap-2 mt-2.5 flex-wrap">
                    <span className="text-sm text-muted">{tourLabel}</span>
                    <span className="w-1 h-1 rounded-full bg-muted-2 flex-shrink-0" />
                    <span className="text-sm text-muted">{concertsShort}</span>
                    <span className="ml-auto text-[10px] font-medium tabular-nums px-2.5 py-1 rounded-full border border-border text-muted">
                      {citiesLabel}
                    </span>
                  </div>
                </div>
              </>
            ) : (
              <div className="pt-2 pb-4 border-b border-border">
                <h1 className="font-serif font-black text-[2.5rem] leading-[0.95] text-cream uppercase">{artistName}</h1>
                <div className="flex items-center gap-2 mt-2.5">
                  <span className="text-muted text-sm">{tourLabel}</span>
                  <span className="w-1 h-1 rounded-full bg-muted-2 flex-shrink-0" />
                  <span className="text-muted text-sm">{concertsShort}</span>
                </div>
              </div>
            )}
          </div>

          {/* Desktop: full-height sticky poster */}
          <div className="hidden lg:block relative h-full">
            {/* Subtle orange glow behind image */}
            <div
              className="absolute left-1/2 -translate-x-1/2 pointer-events-none"
              style={{
                top: '51px',
                bottom: '0',
                width: 'calc(100% - 32px)',
                borderRadius: '28px',
                boxShadow: '0 0 80px rgba(255,77,0,0.22), 0 0 140px rgba(255,77,0,0.10), 0 0 0 1px rgba(255,77,0,0.12)',
                animation: 'glowPulse 4s ease-in-out infinite',
              }}
            />

            {/* Soft orange glow beneath image */}
            <div
              className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[80%] h-40 pointer-events-none"
              style={{
                background: 'radial-gradient(ellipse at center, rgba(255,77,0,0.35) 0%, rgba(255,77,0,0.15) 50%, transparent 70%)',
                filter: 'blur(48px)',
              }}
            />

            {/* Image wrapper with rounded corners */}
            <div
              className="absolute overflow-hidden"
              style={{
                top: '51px',
                bottom: '0',
                left: '16px',
                right: '16px',
                borderRadius: '24px',
              }}
            >
              {artistPhoto ? (
                <>
                  <Image
                    src={artistPhoto}
                    alt={artistName}
                    fill
                    priority
                    className="object-contain"
                    sizes="42vw"
                    onLoad={() => setArtistPhotoLoaded(true)}
                  />
                  <div className={cn(
                    'absolute inset-0 bg-zinc-900 transition-opacity duration-700',
                    artistPhotoLoaded ? 'opacity-0 pointer-events-none' : 'opacity-100'
                  )} />
                </>
              ) : (
                shows.map((show) => (
                  show.posterImage ? (
                    <div key={show.id} className="absolute inset-0">
                      <Image
                        src={show.posterImage}
                        alt={`${artistName} — ${show.venue}`}
                        fill
                        priority={show.id === activeId}
                        className={cn(
                          'object-contain transition-opacity duration-500',
                          show.id === activeId ? 'opacity-100' : 'opacity-0'
                        )}
                        sizes="42vw"
                        onLoad={() => setLoadedImages((prev) => new Set(prev).add(show.id))}
                      />
                      <div className={cn(
                        'absolute inset-0 bg-zinc-900 transition-opacity duration-700',
                        show.id === activeId && !loadedImages.has(show.id)
                          ? 'opacity-100'
                          : 'opacity-0 pointer-events-none'
                      )} />
                    </div>
                  ) : null
                ))
              )}
            </div>

            {/* Plaque overlay with active show data */}
            {activeShow && (
              <div
                className="absolute px-6 pb-6 pt-10 flex flex-col justify-end"
                style={{
                  left: 16,
                  right: 16,
                  bottom: 0,
                  zIndex: 20,
                  borderBottomLeftRadius: 24,
                  borderBottomRightRadius: 24,
                  background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.5) 60%, transparent 100%)',
                }}
              >
                <p className="font-medium text-2xl text-cream leading-tight">{activeShow.city}</p>
                <p className="text-muted text-sm mt-1">{activeShow.venue}</p>
                <p className="text-cream/70 text-sm mt-1">{formatDateLong(activeShow.date)}</p>

                <div className="mt-4">
                  {activeShow.isPrivate ? (
                    <span className="text-muted text-xs">Для гостей отеля</span>
                  ) : activeShow.isSoldOut ? (
                    <span className="text-muted text-xs">Нет билетов</span>
                  ) : (
                    <Link
                      href={activeShow.href}
                      className="inline-block px-6 py-2.5 rounded-full text-[11px] font-bold tracking-widest uppercase bg-red text-white hover:bg-red-hover shadow-red-sm transition-all duration-150"
                    >
                      Купить билет
                    </Link>
                  )}
                </div>
              </div>
            )}
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
              <span className="text-muted text-sm">{concertsFull}</span>
              <span className="w-1 h-1 rounded-full bg-muted-2" />
              <span className="text-muted text-sm">{citiesLabel}</span>
            </div>
          </div>

          {/* Tour list */}
          <ul className="flex flex-col">
            {listItems.map((item) => {

              /* Month separator */
              if (item.type === 'separator') {
                return (
                  <li key={item.key} className="flex items-center gap-3 pt-3 pb-1.5 px-6 lg:px-10 xl:px-14">
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
                <li key={show.id} className="border-b border-white/5">
                  <button
                    type="button"
                    onClick={() => setActiveId(show.id)}
                    className={cn(
                      'group w-full text-left transition-all duration-150 border-l-[3px]',
                      isActive
                        ? 'bg-red/5 border-l-red'
                        : 'bg-transparent border-l-transparent hover:bg-white/[0.02]'
                    )}
                  >

                    {/* ── DESKTOP: single row ── */}
                    <div className="hidden lg:flex items-center gap-3 px-6 lg:px-10 xl:px-14 py-4">
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
                            'shrink-0 px-6 py-2.5 rounded-full text-[11px] font-bold tracking-widest uppercase transition-all duration-150 whitespace-nowrap',
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
                      <div className="flex items-center gap-2.5 px-5 pt-4 pb-3">
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
                      <div className="px-4 pb-4">
                        {show.isPrivate ? (
                          <div className="py-2.5 text-muted text-[11px] text-center">
                            Концерт для гостей отеля
                          </div>
                        ) : show.isSoldOut ? (
                          <div className="w-full py-3 rounded-full bg-[#252525] border border-[#3A3A3F] text-muted text-[11px] font-bold tracking-widest uppercase text-center">
                            Нет билетов
                          </div>
                        ) : (
                          <Link
                            href={show.href}
                            onClick={(e) => e.stopPropagation()}
                            className={cn(
                              'block w-full py-3 rounded-full text-[11px] font-bold tracking-widest uppercase text-center transition-all duration-150',
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
