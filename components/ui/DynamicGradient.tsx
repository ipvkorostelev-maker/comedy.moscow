'use client'

import { useEffect } from 'react'

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
          resolve(`${r} ${g} ${b}`)
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

const PROPS = ['--grad-top-rgb', '--grad-bottom-rgb'] as const

export default function DynamicGradient({ imageUrl }: Props) {
  useEffect(() => {
    let cancelled = false

    extractDominantColor(imageUrl).then((rgb) => {
      if (cancelled || !rgb) return
      // Gradient: top (50% opacity) and bottom-right (22% opacity)
      document.body.style.setProperty(PROPS[0], rgb)
      document.body.style.setProperty(PROPS[1], rgb)
    })

    return () => {
      cancelled = true
      for (const prop of PROPS) {
        document.body.style.removeProperty(prop)
      }
    }
  }, [imageUrl])

  return null
}
