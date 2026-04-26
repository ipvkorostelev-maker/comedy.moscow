'use client'

import { useEffect, useState } from 'react'

interface Props {
  imageUrl: string
}

function extractColor(dataUrl: string): Promise<string | null> {
  return new Promise((resolve) => {
    const img = new Image()
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')
        if (!ctx) { resolve(null); return }

        const scale = Math.min(80 / img.width, 80 / img.height, 1)
        canvas.width = Math.round(img.width * scale)
        canvas.height = Math.round(img.height * scale)

        ctx.drawImage(img, 0, 0, canvas.width, canvas.height)

        const pixels = ctx.getImageData(0, 0, canvas.width, canvas.height).data
        let r = 0, g = 0, b = 0, count = 0
        for (let i = 0; i < pixels.length; i += 4) {
          r += pixels[i]
          g += pixels[i + 1]
          b += pixels[i + 2]
          count++
        }

        if (count > 0) {
          r = Math.round(r / count)
          g = Math.round(g / count)
          b = Math.round(b / count)
          resolve(`${r}, ${g}, ${b}`)
        } else {
          resolve(null)
        }
      } catch {
        resolve(null)
      }
    }
    img.onerror = () => resolve(null)
    img.src = dataUrl
  })
}

export default function ImageGlow({ imageUrl }: Props) {
  const [rgb, setRgb] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    fetch(`/api/color?url=${encodeURIComponent(imageUrl)}`)
      .then((r) => r.json())
      .then((json) => {
        if (cancelled || !json.dataUrl) return
        return extractColor(json.dataUrl)
      })
      .then((color) => {
        if (!cancelled && color) setRgb(color)
      })
      .catch(() => {})

    return () => { cancelled = true }
  }, [imageUrl])

  if (!rgb) return null

  return (
    <div
      className="absolute inset-0 pointer-events-none z-0"
      style={{
        background: `radial-gradient(ellipse 100% 100% at 50% 50%, rgb(${rgb} / 0.45) 0%, transparent 65%)`,
      }}
    />
  )
}
