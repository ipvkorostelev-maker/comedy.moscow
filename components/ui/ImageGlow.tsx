'use client'

import { useEffect, useState } from 'react'

interface Props {
  imageUrl: string
}

function extractDominantColor(imageUrl: string): Promise<string | null> {
  return new Promise((resolve) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'

    img.onload = () => {
      try {
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')
        if (!ctx) { resolve(null); return }

        const scale = Math.min(100 / img.width, 100 / img.height, 1)
        canvas.width = Math.round(img.width * scale)
        canvas.height = Math.round(img.height * scale)

        ctx.drawImage(img, 0, 0, canvas.width, canvas.height)

        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
        const pixels = imageData.data

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
    img.src = imageUrl
  })
}

export default function ImageGlow({ imageUrl }: Props) {
  const [rgb, setRgb] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    extractDominantColor(imageUrl).then((color) => {
      if (!cancelled && color) setRgb(color)
    })
    return () => { cancelled = true }
  }, [imageUrl])

  if (!rgb) return null

  return (
    <div
      className="absolute inset-0 pointer-events-none"
      style={{
        background: `radial-gradient(ellipse 70% 85% at 65% 50%, rgb(${rgb} / 0.30) 0%, transparent 65%)`,
      }}
    />
  )
}
