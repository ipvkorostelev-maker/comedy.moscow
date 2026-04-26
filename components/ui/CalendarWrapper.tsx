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
        const url = date ? `/?date=${date}` : '/'
        window.location.href = url
      }}
    />
  )
}
