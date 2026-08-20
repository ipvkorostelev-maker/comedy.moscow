'use client'

import { useRef, useEffect, useMemo } from 'react'

const DAY_SHORT = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб']
const MONTH_SHORT = ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн', 'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек']

interface Day {
  date: string   // YYYY-MM-DD
  d: number
  label: string  // «Сегодня» / «Завтра» / день недели
  monthLabel: string | null  // shown when month changes
}

function buildDays(): Day[] {
  const days: Day[] = []
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  // Start 1 day before today, show 120 days
  const start = new Date(today)
  start.setDate(start.getDate() - 1)

  let prevMonth = -1

  for (let i = 0; i < 120; i++) {
    const d = new Date(start)
    d.setDate(start.getDate() + i)

    const yyyy = d.getFullYear()
    const mm = String(d.getMonth() + 1).padStart(2, '0')
    const dd = String(d.getDate()).padStart(2, '0')
    const dateStr = `${yyyy}-${mm}-${dd}`

    const month = d.getMonth()
    const monthLabel = month !== prevMonth ? `${MONTH_SHORT[month]} ${yyyy}` : null
    prevMonth = month

    const label = i === 0 ? '' : i === 1 ? 'Сегодня' : i === 2 ? 'Завтра' : DAY_SHORT[d.getDay()]

    days.push({ date: dateStr, d: d.getDate(), label, monthLabel })
  }

  return days
}

interface Props {
  eventDates: Set<string>
  selected: string | null
  onSelect: (date: string | null) => void
}

export default function EventCalendar({ eventDates, selected, onSelect }: Props) {
  // buildDays only depends on the current date — memoize so it runs once per mount
  const days = useMemo(() => buildDays(), [])
  const scrollRef = useRef<HTMLDivElement>(null)
  const todayRef = useRef<HTMLButtonElement>(null)

  // Scroll to today on mount
  useEffect(() => {
    if (todayRef.current && scrollRef.current) {
      const el = todayRef.current
      const container = scrollRef.current
      const offset = el.offsetLeft - container.offsetWidth / 2 + el.offsetWidth / 2
      container.scrollTo({ left: offset, behavior: 'smooth' })
    }
  }, [])

  // days[1] is always today (buildDays starts 1 day before today)
  const todayStr = days[1]?.date ?? ''

  return (
    <div
      ref={scrollRef}
      className="flex items-stretch gap-1.5 overflow-x-auto scrollbar-hide snap-x touch-pan-xy px-1 py-1"
      role="listbox"
      aria-label="Даты концертов"
    >
      {days.map((day) => {
        if (day.monthLabel) {
          return (
            <div
              key={`m-${day.date}`}
              className="flex-shrink-0 snap-start flex items-center px-2 mx-1 border-r border-border"
              aria-hidden
            >
              <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-2 whitespace-nowrap">
                {day.monthLabel}
              </span>
            </div>
          )
        }

        const hasEvent = eventDates.has(day.date)
        const isToday = day.date === todayStr
        const isSelected = day.date === selected

        return (
          <button
            key={day.date}
            ref={isToday ? todayRef : undefined}
            role="option"
            aria-selected={isSelected}
            onClick={() => onSelect(isSelected ? null : day.date)}
            className={[
              'flex-shrink-0 snap-start min-w-[64px] min-h-[64px] flex flex-col items-center justify-center gap-1 rounded-xl transition-colors duration-200',
              isSelected
                ? 'bg-red text-white'
                : hasEvent
                ? 'bg-surface-2 border border-border text-cream hover:bg-surface-hover'
                : 'bg-transparent border border-transparent text-muted-2 hover:text-muted',
            ].join(' ')}
          >
            <span
              className={[
                'text-[9px] font-semibold uppercase tracking-wider leading-none',
                isSelected ? 'text-white/80' : hasEvent ? 'text-muted' : 'text-muted-2',
              ].join(' ')}
            >
              {day.label}
            </span>

            <span
              className={[
                'text-base font-bold leading-none',
                isSelected ? 'text-white' : hasEvent ? 'text-cream' : 'text-muted-2',
              ].join(' ')}
            >
              {day.d}
            </span>

            <span
              className={[
                'w-1 h-1 rounded-full',
                hasEvent
                  ? isSelected ? 'bg-white/80' : 'bg-gold'
                  : 'bg-transparent',
              ].join(' ')}
            />
          </button>
        )
      })}
    </div>
  )
}
