'use client'

import { useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'

export default function InticketsInit() {
  const pathname = usePathname()
  const initCalled = useRef(false)

  useEffect(() => {
    const reinit = () => {
      const w = window as any
      if (typeof w.intickets?.init === 'function') {
        w.intickets.init()
      } else if (typeof w.InticketWidget?.init === 'function') {
        w.InticketWidget.init()
      } else if (typeof w.ab?.init === 'function') {
        w.ab.init()
      }
    }

    const timeout = setTimeout(reinit, 100)
    return () => clearTimeout(timeout)
  }, [pathname])

  return null
}
