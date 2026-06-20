'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import type { CityInfo } from '@/lib/data'

interface Props {
  cities: CityInfo[]
}

export default function CitySelector({ cities }: Props) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const pathname = usePathname()
  const currentSlug = pathname.startsWith('/city/') ? pathname.split('/')[2] : null

  useEffect(() => {
    if (!open) return
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open])

  if (cities.length === 0) return null

  const active = currentSlug || (pathname === '/' || pathname === '/events' ? 'moskva' : null)
  const isCityActive = active !== null

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className={cn(
          'px-3.5 py-1.5 rounded-md text-[13px] font-medium transition-all duration-200 flex items-center gap-1.5',
          isCityActive
            ? 'text-cream bg-white/8'
            : 'text-cream/45 hover:text-cream/80 hover:bg-white/[0.04]'
        )}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="shrink-0 opacity-60">
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
          <circle cx="12" cy="10" r="3" />
        </svg>
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
          <div className="py-1">
            {cities.map((city) => {
              const isSelected = (currentSlug === city.slug) || (!currentSlug && city.slug === 'moskva' && (pathname === '/' || pathname === '/events'))
              return (
                <Link
                  key={city.slug}
                  href={city.slug === 'moskva' ? '/' : `/city/${city.slug}`}
                  onClick={() => setOpen(false)}
                  className={cn(
                    'flex items-center justify-between px-4 py-2.5 text-sm transition-colors',
                    isSelected
                      ? 'text-cream bg-white/[0.06]'
                      : 'text-cream/70 hover:text-cream hover:bg-white/[0.04]'
                  )}
                >
                  <span>{city.name}</span>
                  <span className={cn('text-[11px]', isSelected ? 'text-muted' : 'text-muted/50')}>{city.count}</span>
                </Link>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
