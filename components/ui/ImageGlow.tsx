'use client'

import { useEffect, useState } from 'react'

interface Props {
  imageUrl: string
}

export default function ImageGlow({ imageUrl }: Props) {
  const [rgb, setRgb] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    fetch(`/api/color?url=${encodeURIComponent(imageUrl)}`)
      .then((r) => r.json())
      .then((json) => {
        if (!cancelled && json.rgb) setRgb(json.rgb)
      })
      .catch(() => {})
    return () => { cancelled = true }
  }, [imageUrl])

  if (!rgb) return null

  return (
    <div
      className="absolute inset-0 pointer-events-none z-0"
      style={{
        background: `radial-gradient(ellipse 100% 100% at 50% 50%, rgb(${rgb} / 0.50) 0%, transparent 65%)`,
      }}
    />
  )
}
