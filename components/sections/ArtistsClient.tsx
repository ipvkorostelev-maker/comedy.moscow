'use client'

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import ArtistCard from '@/components/cards/ArtistCard'
import type { Artist } from '@/lib/types'

interface Props {
  artists: Artist[]
}

export default function ArtistsClient({ artists }: Props) {
  const [query, setQuery] = useState('')

  const filtered = useMemo(() => {
    if (!query.trim()) return artists
    const q = query.toLowerCase().trim()
    return artists.filter((a) => a.name.toLowerCase().includes(q))
  }, [artists, query])

  return (
    <>
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="py-12 border-b border-border mb-8">
          <h1 className="font-serif font-black text-4xl lg:text-5xl text-cream mb-3">Артисты</h1>
          <p className="text-muted text-sm">{artists.length} комиков</p>
        </div>

        <div className="relative max-w-md mb-8">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
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

        <AnimatePresence mode="popLayout">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-5 pb-16">
            {filtered.map((artist, i) => (
              <motion.div
                key={artist.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3, delay: (i % 10) * 0.03 }}
                layout
              >
                <ArtistCard artist={artist} />
              </motion.div>
            ))}
          </div>
        </AnimatePresence>

        {filtered.length === 0 && (
          <div className="py-16 text-center">
            <p className="text-muted text-sm">Ничего не найдено</p>
            <button onClick={() => setQuery('')} className="mt-3 text-xs text-red hover:opacity-80 transition-opacity">
              Сбросить поиск
            </button>
          </div>
        )}
      </div>
    </>
  )
}
