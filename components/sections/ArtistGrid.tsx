'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import ArtistCard from '@/components/cards/ArtistCard'
import type { Artist } from '@/lib/types'

const LIMIT = 12

export default function ArtistGrid() {
  const [artists, setArtists] = useState<Artist[]>([])
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [hasMore, setHasMore] = useState(false)
  const [total, setTotal] = useState(0)
  const offsetRef = useRef(0)
  const abortRef = useRef<AbortController | null>(null)
  const debounceRef = useRef<ReturnType<typeof setTimeout>>()

  const fetchArtists = useCallback(async (q: string, append: boolean) => {
    if (abortRef.current) abortRef.current.abort()
    const controller = new AbortController()
    abortRef.current = controller

    const off = append ? offsetRef.current : 0
    if (!append) setLoading(true)
    else setLoadingMore(true)

    try {
      const params = new URLSearchParams({ q, offset: String(off), limit: String(LIMIT) })
      const res = await fetch(`/api/artists?${params}`, { signal: controller.signal })
      if (!res.ok) throw new Error('fetch error')
      const data = await res.json()
      if (controller.signal.aborted) return

      if (append) {
        setArtists((prev) => [...prev, ...data.artists])
      } else {
        setArtists(data.artists)
      }
      setTotal(data.total)
      setHasMore(data.hasMore)
      offsetRef.current = off + data.artists.length
    } catch (err: any) {
      if (err.name === 'AbortError') return
    } finally {
      setLoading(false)
      setLoadingMore(false)
    }
  }, [])

  useEffect(() => {
    fetchArtists('', false)
  }, [fetchArtists])

  const handleSearch = useCallback((value: string) => {
    setQuery(value)
    clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      offsetRef.current = 0
      fetchArtists(value, false)
    }, 300)
  }, [fetchArtists])

  const loadMore = useCallback(() => {
    fetchArtists(query, true)
  }, [query, fetchArtists])

  return (
    <section className="py-20 lg:py-28 px-6 border-t border-border">
      <div className="max-w-7xl mx-auto">
        <div className="max-w-4xl mb-10">
          <p className="text-[11px] text-muted uppercase tracking-[0.2em] mb-3">Артисты</p>
          <h2 className="font-serif font-black text-cream text-3xl lg:text-5xl uppercase leading-tight mb-6">
            Наши комики
          </h2>

          {/* Search */}
          <div className="relative max-w-md">
            <input
              type="text"
              value={query}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Поиск по имени..."
              className="w-full bg-surface border border-border rounded-xl px-4 py-3 pl-10 text-sm text-cream placeholder:text-muted-2 outline-none focus:border-muted-2 transition-colors"
            />
            <svg
              width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
              strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted"
            >
              <circle cx="11" cy="11" r="8"/>
              <path d="m21 21-4.3-4.3"/>
            </svg>
          </div>

          {!loading && (
            <p className="text-xs text-muted mt-3">
              {total} {total === 1 ? 'комик' : total % 10 === 1 && total % 100 !== 11 ? 'комик' : total % 10 >= 2 && total % 10 <= 4 && (total % 100 < 10 || total % 100 >= 20) ? 'комика' : 'комиков'}
            </p>
          )}
        </div>

        {/* Loading skeleton */}
        {loading && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="aspect-square rounded-xl bg-surface border border-border animate-pulse" />
            ))}
          </div>
        )}

        {/* Empty state */}
        {!loading && artists.length === 0 && (
          <div className="py-16 text-center">
            <p className="text-muted text-sm">Ничего не найдено</p>
            {query && (
              <button
                onClick={() => { setQuery(''); handleSearch('') }}
                className="mt-3 text-xs text-red hover:opacity-80 transition-opacity"
              >
                Сбросить поиск
              </button>
            )}
          </div>
        )}

        {/* Grid */}
        <AnimatePresence mode="popLayout">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {artists.map((artist, i) => (
              <motion.div
                key={artist.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.35, delay: (i % LIMIT) * 0.04 }}
                layout
              >
                <ArtistCard artist={artist} />
              </motion.div>
            ))}
          </div>
        </AnimatePresence>

        {/* Load more */}
        {hasMore && (
          <div className="mt-10 text-center">
            <button
              onClick={loadMore}
              disabled={loadingMore}
              className="inline-flex items-center gap-2 bg-surface border border-border hover:border-muted-2 text-cream font-medium px-8 py-3.5 rounded-xl transition-all text-sm disabled:opacity-50"
            >
              {loadingMore ? (
                <>
                  <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" className="opacity-25"/>
                    <path d="M4 12a8 8 0 018-8" stroke="currentColor" strokeWidth="3" strokeLinecap="round" className="opacity-75"/>
                  </svg>
                  Загрузка...
                </>
              ) : (
                'Показать ещё'
              )}
            </button>
          </div>
        )}
      </div>
    </section>
  )
}
