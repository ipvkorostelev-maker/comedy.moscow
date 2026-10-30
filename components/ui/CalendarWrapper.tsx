'use client'

import { useRouter } from 'next/navigation'
import EventCalendar from '@/components/sections/EventCalendar'

interface Props {
  eventDates: Set<string>
  selected: string | null
}

export default function CalendarWrapper({ eventDates, selected }: Props) {
  const router = useRouter()
  return (
    <EventCalendar
      eventDates={eventDates}
      selected={selected}
      onSelect={(date) => {
        const path = window.location.pathname
        router.push(date ? `${path}?date=${date}` : path, { scroll: false })
      }}
    />
  )
}
