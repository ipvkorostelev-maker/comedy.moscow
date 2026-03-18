'use client'

import { useState, useEffect } from 'react'
import { cn, formatDateShort, formatPrice } from '@/lib/utils'
import { Event } from '@/lib/types'
import BuyButton from '@/components/ui/BuyButton'

interface StickyBuyBarProps {
  event: Event
  minPrice: number
}

export default function StickyBuyBar({ event, minPrice }: StickyBuyBarProps) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 500)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div
      className={cn(
        'fixed bottom-0 left-0 right-0 z-40 transition-transform duration-300',
        'bg-surface/95 backdrop-blur-xl border-t border-border',
        'px-6 lg:px-12 py-3.5 flex items-center justify-between gap-4',
        visible ? 'translate-y-0' : 'translate-y-full'
      )}
    >
      <div className="min-w-0">
        <p className="font-serif font-bold text-base text-cream truncate">{event.title}</p>
        <p className="text-[11px] text-muted mt-0.5">
          {formatDateShort(event.date)} · {event.time} · Осталось {event.ticketsLeft} мест
        </p>
      </div>

      <div className="flex items-center gap-4 flex-shrink-0">
        <div className="hidden sm:block font-serif font-black text-xl text-cream">
          от {formatPrice(minPrice)}{' '}
        </div>
        <BuyButton
          ticketType={event.ticketType}
          ticketUrl={event.ticketUrl}
          yandexWidgetId={event.yandexWidgetId}
          className="px-8 py-3 whitespace-nowrap"
        />
      </div>
    </div>
  )
}
