'use client'

import { useRef, useEffect } from 'react'

const DAY_SHORT = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб']
const MONTH_SHORT = ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн', 'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек']

interface Day {
  date: string   // YYYY-MM-DD
  d: number
  dayName: string
  monthLabel: string | null  // shown when month changes
}

function buildDays(eventDates: Set<string>): Day[] {
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

    days.push({
      date: dateStr,
      d: d.getDate(),
      dayName: DAY_SHORT[d.getDay()],
      monthLabel,
    })
  }

  return days
}

interface Props {
  eventDates: Set<string>
  selected: string | null
  onSelect: (date: string | null) => void
}

export default function EventCalendar({ eventDates, selected, onSelect }: Props) {
  const days = buildDays(eventDates)
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

  const today = new Date()
  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`

  return (
    <div className="relative">
      {/* Fade edges */}
      <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-16 z-10 bg-gradient-to-r from-bg to-transparent" />
      <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-16 z-10 bg-gradient-to-l from-bg to-transparent" />

      <div
        ref={scrollRef}
        className="flex gap-1 overflow-x-auto scrollbar-hide px-8 pb-1"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {days.map((day) => {
          const hasEvent = eventDates.has(day.date)
          const isToday = day.date === todayStr
          const isSelected = day.date === selected

          return (
            <div key={day.date} className="flex-shrink-0">
              {/* Month label */}
              {day.monthLabel && (
                <div className="text-[10px] font-semibold uppercase tracking-widest text-muted px-1 mb-2 mt-1">
                  {day.monthLabel}
                </div>
              )}

              <button
                ref={isToday ? todayRef : undefined}
                onClick={() => onSelect(isSelected ? null : day.date)}
                className="relative flex flex-col items-center gap-1 w-11 py-3 rounded-xl transition-all duration-200"
                style={{
                  background: isSelected
                    ? 'rgba(212,66,30,1)'
                    : hasEvent
                    ? 'rgba(255,255,255,0.05)'
                    : 'transparent',
                  border: isToday && !isSelected
                    ? '1px solid rgba(255,255,255,0.15)'
                    : '1px solid transparent',
                  boxShadow: isSelected
                    ? '0 4px 20px rgba(212,66,30,0.4)'
                    : hasEvent
                    ? '0 0 0 1px rgba(255,255,255,0.08)'
                    : 'none',
                }}
              >
                {/* Day name */}
                <span
                  className="text-[9px] font-semibold uppercase tracking-wider leading-none"
                  style={{
                    color: isSelected ? 'rgba(255,255,255,0.8)' : hasEvent ? '#9A9AAF' : '#3A3A48',
                  }}
                >
                  {day.dayName}
                </span>

                {/* Day number */}
                <span
                  className="text-base font-bold leading-none"
                  style={{
                    color: isSelected
                      ? '#fff'
                      : hasEvent
                      ? '#F0EDE8'
                      : '#3A3A48',
                  }}
                >
                  {day.d}
                </span>

                {/* Event dot */}
                {hasEvent && (
                  <span
                    className="w-1 h-1 rounded-full"
                    style={{
                      background: isSelected ? 'rgba(255,255,255,0.7)' : '#F5C842',
                    }}
                  />
                )}
                {!hasEvent && <span className="w-1 h-1" />}
              </button>
            </div>
          )
        })}
      </div>
    </div>
  )
}
