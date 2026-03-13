'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

export default function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()
  const isHome = pathname === '/'

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        scrolled || !isHome
          ? 'bg-surface/95 backdrop-blur-lg border-b border-border'
          : 'bg-gradient-to-b from-bg/90 to-transparent'
      )}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-12 h-16 flex items-center justify-between">
        <Link href="/" className="font-serif text-lg font-black text-cream">
          Смеш<em className="text-red not-italic">но</em>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {[
            { href: '/events', label: 'События' },
            { href: '/artists', label: 'Артисты' },
          ].map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={cn(
                'text-xs transition-colors',
                pathname.startsWith(href) ? 'text-cream' : 'text-cream/50 hover:text-cream'
              )}
            >
              {label}
            </Link>
          ))}
        </nav>

        <Link
          href="/events"
          className="text-xs font-bold bg-red hover:bg-red-hover text-white px-5 py-2.5 rounded-md transition-colors shadow-[0_0_20px_rgba(212,66,30,0.3)]"
        >
          Купить билет
        </Link>
      </div>
    </header>
  )
}
