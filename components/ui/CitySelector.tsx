'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import type { CityInfo } from '@/lib/data'

interface Props {
  cities: CityInfo[]
}

export default function CitySelector({ cities }: Props) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open])

  if (cities.length === 0) return null

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="px-3.5 py-1.5 rounded-md text-[13px] font-medium transition-all duration-200 text-cream/45 hover:text-cream/80 hover:bg-white/[0.04] flex items-center gap-1"
      >
        Города
        <svg
          width="10" height="6" viewBox="0 0 10 6" fill="none"
          className={`transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        >
          <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {open && (
        <div className="absolute top-full right-0 mt-1 w-56 bg-surface border border-border rounded-xl shadow-2xl overflow-hidden z-50">
          {cities.map((city) => (
            <Link
              key={city.slug}
              href={`/city/${city.slug}`}
              onClick={() => setOpen(false)}
              className="flex items-center justify-between px-4 py-2.5 text-sm text-cream/70 hover:text-cream hover:bg-white/[0.04] transition-colors"
            >
              <span>{city.name}</span>
              <span className="text-[11px] text-muted/60">{city.count}</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
