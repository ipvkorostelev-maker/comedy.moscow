'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function CookieBanner() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (!sessionStorage.getItem('cookie_consent')) {
      setVisible(true)
    }
  }, [])

  function accept() {
    sessionStorage.setItem('cookie_consent', '1')
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[100] px-4 pb-4 md:px-6 md:pb-6">
      <div className="max-w-2xl mx-auto md:mx-0 bg-surface border border-border rounded-2xl px-5 py-4 shadow-[0_8px_40px_rgba(0,0,0,0.5)] flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <p className="text-[12px] text-muted leading-relaxed flex-1">
          Мы используем файлы cookie. Продолжая использовать сайт, вы соглашаетесь с{' '}
          <Link href="/privacy" className="text-cream/60 hover:text-cream underline underline-offset-2 transition-colors">
            политикой конфиденциальности
          </Link>
          .
        </p>
        <button
          onClick={accept}
          className="flex-shrink-0 bg-red hover:bg-red-hover text-white text-[12px] font-bold px-5 py-2.5 rounded-lg transition-colors shadow-red whitespace-nowrap"
        >
          Принять
        </button>
      </div>
    </div>
  )
}
