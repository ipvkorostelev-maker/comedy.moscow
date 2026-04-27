'use client'

import EventCalendar from '@/components/sections/EventCalendar'

interface Props {
  eventDates: Set<string>
  selected: string | null
}

export default function CalendarWrapper({ eventDates, selected }: Props) {
  return (
    <EventCalendar
      eventDates={eventDates}
      selected={selected}
      onSelect={(date) => {
        const path = window.location.pathname
        window.location.href = date ? `${path}?date=${date}` : path
      }}
    />
  )
}
