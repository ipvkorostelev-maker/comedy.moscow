'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { cn, formatDateShort } from '@/lib/utils'

interface SearchResult {
  slug: string
  title: string
  image: string
  date: string
  time: string
  venueName?: string
  city: string
  artistNames: string[]
}

type SearchState = 'idle' | 'loading' | 'results' | 'empty'

interface SearchModalProps {
  open: boolean
  onClose: () => void
}

export default function SearchModal({ open, onClose }: SearchModalProps) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [state, setState] = useState<SearchState>('idle')
  const inputRef = useRef<HTMLInputElement>(null)
  const debounceRef = useRef<ReturnType<typeof setTimeout>>()

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 100)
    } else {
      setQuery('')
      setResults([])
      setState('idle')
    }
  }, [open])

  useEffect(() => {
    if (!open) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [open, onClose])

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current)

    if (query.length < 2) {
      setResults([])
      setState('idle')
      return
    }

    setState('loading')

    debounceRef.current = setTimeout(async () => {
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`)
        if (!res.ok) throw new Error('Search failed')
        const data: SearchResult[] = await res.json()
        setResults(data)
        setState(data.length > 0 ? 'results' : 'empty')
      } catch {
        setResults([])
        setState('idle')
      }
    }, 300)

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  }, [query])

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-[60] flex flex-col items-center"
      style={{ background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(12px)' }}
    >
      <button
        onClick={onClose}
        className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center rounded-full bg-white/10 text-cream/60 hover:text-cream hover:bg-white/20 transition-colors"
        aria-label="Закрыть"
      >
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <path d="M5 5L15 15M15 5L5 15" />
        </svg>
      </button>

      <div className="w-full max-w-xl mt-24 px-4">
        <div className="relative">
          <svg
            className="absolute left-4 top-1/2 -translate-y-1/2 text-cream/30"
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <circle cx="9" cy="9" r="6" />
            <path d="M13.5 13.5L18 18" />
          </svg>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Поиск концертов, артистов, площадок..."
            className="w-full h-14 pl-12 pr-4 bg-surface border border-border rounded-card text-cream placeholder:text-cream/30 focus:outline-none focus:border-red/50 transition-colors text-base font-sans"
          />
        </div>
      </div>

      <div className="w-full max-w-xl mt-6 px-4">
        <div className="max-h-[60vh] overflow-y-auto space-y-2">
          {state === 'loading' && (
            <div className="flex justify-center py-8">
              <div className="w-6 h-6 border-2 border-cream/20 border-t-red rounded-full animate-spin" />
            </div>
          )}

          {state === 'idle' && (
            <p className="text-center text-cream/30 text-sm py-8">
              Начните вводить для поиска
            </p>
          )}

          {state === 'empty' && (
            <p className="text-center text-cream/30 text-sm py-8">
              Ничего не найдено
            </p>
          )}

          {state === 'results' &&
            results.map((event) => (
              <Link
                key={event.slug}
                href={`/events/${event.slug}`}
                onClick={onClose}
                className="flex items-center gap-3 p-3 rounded-card bg-surface border border-border hover:border-red/30 transition-colors group"
              >
                <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-surface-2">
                  <Image
                    src={event.image}
                    alt={event.title}
                    fill
                    className="object-cover"
                    sizes="64px"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="font-serif text-cream group-hover:text-red transition-colors text-sm truncate">
                    {event.title}
                  </h3>
                  {event.artistNames.length > 0 && (
                    <p className="text-muted text-xs truncate mt-0.5">
                      {event.artistNames.join(' · ')}
                    </p>
                  )}
                  <p className="text-muted text-xs mt-0.5 truncate">
                    {formatDateShort(event.date)}
                    {event.venueName ? `, ${event.venueName}` : ''}, {event.city}
                  </p>
                </div>
              </Link>
            ))}
        </div>
      </div>
    </div>
  )
}
