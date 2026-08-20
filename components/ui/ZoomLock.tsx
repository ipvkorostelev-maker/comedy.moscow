'use client'

import { useEffect } from 'react'

/**
 * Блокирует pinch-zoom и мультитач-жесты на мобильных.
 * iOS Safari игнорирует viewport user-scalable=no, поэтому перехватываем
 * gesturestart/touchmove с двумя пальцами на уровне DOM.
 */
export default function ZoomLock() {
  useEffect(() => {
    const preventGesture = (e: Event) => e.preventDefault()
    const preventMultiTouch = (e: TouchEvent) => {
      if (e.touches.length > 1) e.preventDefault()
    }

    document.addEventListener('gesturestart', preventGesture, { passive: false })
    document.addEventListener('touchmove', preventMultiTouch, { passive: false })

    return () => {
      document.removeEventListener('gesturestart', preventGesture)
      document.removeEventListener('touchmove', preventMultiTouch)
    }
  }, [])

  return null
}
