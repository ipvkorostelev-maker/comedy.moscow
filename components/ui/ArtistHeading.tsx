'use client'

import { useEffect, useRef } from 'react'

export default function ArtistHeading({ text }: { text: string }) {
  const spanRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const span = spanRef.current
    if (!span) return

    let appliedRatio = 1

    const fit = () => {
      span.style.maxWidth = 'none'
      span.style.fontSize = ''
      const natural = span.scrollWidth
      span.style.maxWidth = ''
      const avail = span.clientWidth || span.parentElement?.clientWidth || 0
      const ratio = natural > 0 && avail > 0 && natural > avail ? avail / natural : 1
      if (Math.abs(ratio - appliedRatio) < 0.02) return
      appliedRatio = ratio
      span.style.fontSize = ratio < 1 ? `${ratio * 100}%` : ''
    }

    fit()

    const parent = span.parentElement
    const ro = parent ? new ResizeObserver(fit) : null
    if (parent) ro?.observe(parent)
    window.addEventListener('resize', fit)
    if (document.fonts?.ready) {
      document.fonts.ready.then(() => fit()).catch(() => {})
    }
    return () => {
      ro?.disconnect()
      window.removeEventListener('resize', fit)
    }
  }, [text])

  return (
    <span ref={spanRef} className="event-artist-heading" style={{ display: 'block' }}>
      {text}
    </span>
  )
}
