'use client'

import { useState, useEffect } from 'react'
import { formatDateShort, formatPrice } from '@/lib/utils'
import type { Event } from '@/lib/types'
import EventTickets, { hasEventTickets } from './EventTickets'

export default function StickyBuyBar({ event, minPrice }: { event: Event; minPrice: number }) {
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const purchase = document.getElementById('event-primary-purchase')
    if (!purchase) return
    const observer = new IntersectionObserver(([entry]) => setVisible(!entry.isIntersecting), { threshold: 0.1 })
    observer.observe(purchase)
    return () => observer.disconnect()
  }, [])
  if (!hasEventTickets(event) || !visible) return null
  return <div className="event-sticky-buy" aria-label="Билеты на концерт">
    <div className="event-sticky-inner"><div className="event-sticky-info"><p>{event.title}</p><small>{formatDateShort(event.date)} · {event.time}</small>{minPrice > 0 && <strong>от {formatPrice(minPrice)}</strong>}</div><EventTickets event={event} /></div>
  </div>
}
