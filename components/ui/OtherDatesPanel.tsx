'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Event } from '@/lib/types'
import { formatDateShort } from '@/lib/utils'

interface OtherDatesPanelProps {
  events: Event[]
}

export default function OtherDatesPanel({ events }: OtherDatesPanelProps) {
  const [open, setOpen] = useState(false)

  if (events.length === 0) return null

  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-2 text-[11px] text-muted uppercase tracking-[0.1em] hover:text-cream/80 transition-colors group"
      >
        <svg
          width="10"
          height="10"
          viewBox="0 0 10 10"
          fill="none"
          className={`shrink-0 transition-transform ${open ? 'rotate-90' : ''}`}
        >
          <path
            d="M3.5 1.5L7 5L3.5 8.5"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <span className="group-hover:text-cream/70 transition-colors">
          Другие даты ({events.length})
        </span>
      </button>

      {open && (
        <div className="mt-3 space-y-0.5">
          {events.map((e) => (
            <Link
              key={e.id}
              href={`/events/${e.slug}`}
              className="flex items-center justify-between py-2 px-2 -mx-2 rounded-lg hover:bg-white/5 transition-colors group/item"
            >
              <span className="text-[13px] text-cream/80 group-hover/item:text-cream transition-colors font-medium">
                {formatDateShort(e.date)}
              </span>
              <span className="text-[11px] text-muted text-right max-w-[120px] truncate">
                {e.venueName ? `${e.venueName}, ${e.city || 'Москва'}` : e.city || 'Москва'}
              </span>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
