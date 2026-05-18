'use client'

import { useState, useEffect } from 'react'
import { cn, formatDateShort, formatPrice } from '@/lib/utils'
import { Event } from '@/lib/types'
import BuyButton from '@/components/ui/BuyButton'
import InticketsBuyButton from '@/components/ui/InticketsBuyButton'

interface StickyBuyBarProps {
  event: Event
  minPrice: number
}

export default function StickyBuyBar({ event, minPrice }: StickyBuyBarProps) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const onScroll = () => {
      const next = window.scrollY > 500
      setVisible((prev) => prev === next ? prev : next)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div
      className={cn(
        'fixed bottom-0 left-0 right-0 z-40 transition-transform duration-300',
        'bg-surface/95 backdrop-blur-xl border-t border-border',
        'px-6 lg:px-12 py-3.5',
        visible ? 'translate-y-0' : 'translate-y-full'
      )}
    >
      <div className="max-w-[1100px] mx-auto flex items-center justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="font-serif font-bold text-sm sm:text-base text-cream truncate">{event.title}</p>
          <p className="text-[10px] sm:text-[11px] text-muted mt-0.5">
            {formatDateShort(event.date)} · {event.time}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-end sm:items-center gap-1.5 sm:gap-4 flex-shrink-0">
          <div className="hidden sm:block font-serif font-black text-xl text-cream">
            от {formatPrice(minPrice)}{' '}
          </div>
          <BuyButton
            ticketType={event.ticketType}
            ticketUrl={event.ticketUrl}
            yandexWidgetId={event.yandexWidgetId}
            className="px-4 py-2.5 sm:px-8 sm:py-3 whitespace-nowrap text-xs sm:text-sm"
          />
          {event.inticketsUrl && (
            <InticketsBuyButton
              url={event.inticketsUrl}
              className="px-4 py-2.5 sm:px-8 sm:py-3 whitespace-nowrap text-xs sm:text-sm"
            />
          )}
        </div>
      </div>
    </div>
  )
}
