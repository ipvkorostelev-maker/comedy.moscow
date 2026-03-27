'use client'

import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'

interface GalleryLightboxProps {
  images: string[]
  title: string
}

export default function GalleryLightbox({ images, title }: GalleryLightboxProps) {
  const [selected, setSelected] = useState<number | null>(null)

  const close = useCallback(() => setSelected(null), [])

  const prev = useCallback(() => {
    setSelected((i) => (i === null ? null : (i - 1 + images.length) % images.length))
  }, [images.length])

  const next = useCallback(() => {
    setSelected((i) => (i === null ? null : (i + 1) % images.length))
  }, [images.length])

  useEffect(() => {
    if (selected === null) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close()
      if (e.key === 'ArrowLeft') prev()
      if (e.key === 'ArrowRight') next()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [selected, close, prev, next])

  // Prevent body scroll when open — depend only on open/closed state, not which image is selected
  const isOpen = selected !== null
  useEffect(() => {
    if (!isOpen) return
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  return (
    <>
      <div className="grid grid-cols-[2fr_1fr_1fr] grid-rows-[200px_200px] gap-2.5 rounded-2xl overflow-hidden">
        {images.slice(0, 5).map((img, i) => (
          <button
            key={i}
            className={`relative overflow-hidden group cursor-pointer ${i === 0 ? 'row-span-2' : ''}`}
            onClick={() => setSelected(i)}
            aria-label={`Открыть фото ${i + 1}`}
          >
            <Image
              src={img}
              alt={`${title} — фото ${i + 1}`}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-[1.06]"
              sizes="(max-width: 768px) 50vw, 33vw"
            />
            <div className="absolute inset-0 bg-bg/0 group-hover:bg-bg/25 transition-all duration-300" />
          </button>
        ))}
      </div>

      {selected !== null && (
        <div
          className="fixed inset-0 z-50 bg-bg/96 backdrop-blur-xl flex items-center justify-center"
          onClick={close}
        >
          {/* Close */}
          <button
            className="absolute top-4 right-4 z-10 text-cream/70 hover:text-cream text-sm px-4 py-2 bg-surface border border-border rounded-lg transition-colors cursor-pointer"
            onClick={close}
            aria-label="Закрыть галерею"
          >
            Закрыть ✕
          </button>

          {/* Prev */}
          {images.length > 1 && (
            <button
              className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 flex items-center justify-center bg-surface border border-border rounded-full text-cream hover:border-muted transition-colors cursor-pointer"
              onClick={(e) => { e.stopPropagation(); prev() }}
              aria-label="Предыдущее фото"
            >
              ←
            </button>
          )}

          {/* Image */}
          <div
            className="relative w-full max-w-4xl mx-16 aspect-video"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={images[selected]}
              alt={`${title} — фото ${selected + 1}`}
              fill
              className="object-contain"
              sizes="(max-width: 1024px) 100vw, 80vw"
              priority
            />
          </div>

          {/* Next */}
          {images.length > 1 && (
            <button
              className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 flex items-center justify-center bg-surface border border-border rounded-full text-cream hover:border-muted transition-colors cursor-pointer"
              onClick={(e) => { e.stopPropagation(); next() }}
              aria-label="Следующее фото"
            >
              →
            </button>
          )}

          {/* Dots */}
          {images.length > 1 && (
            <div className="absolute bottom-6 flex gap-2">
              {images.slice(0, 5).map((_, i) => (
                <button
                  key={i}
                  onClick={(e) => { e.stopPropagation(); setSelected(i) }}
                  className={`rounded-full transition-all duration-200 cursor-pointer ${
                    i === selected ? 'w-5 h-2 bg-cream' : 'w-2 h-2 bg-cream/30 hover:bg-cream/60'
                  }`}
                  aria-label={`Фото ${i + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </>
  )
}
