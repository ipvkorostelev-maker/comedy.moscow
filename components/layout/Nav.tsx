'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

const LINKS = [
  { href: '/events', label: 'События' },
  { href: '/artists', label: 'Артисты' },
]

export default function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Close menu on route change
  useEffect(() => { setMenuOpen(false) }, [pathname])

  return (
    <>
      <header
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
          scrolled || menuOpen
            ? 'bg-surface/95 backdrop-blur-lg border-b border-border'
            : 'bg-gradient-to-b from-bg/90 to-transparent'
        )}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-12 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="relative w-9 h-9 flex-shrink-0">
              <Image src="/logo.png" alt="Logo" fill className="object-contain" style={{ filter: 'brightness(0) invert(1)' }} />
            </div>
            <div className="leading-none">
              <div className="font-serif font-black text-cream text-[11px] uppercase tracking-[0.08em] leading-[1.2]">
                Стендап<br />в Москве
              </div>
              <div className="text-[9px] text-cream/35 mt-0.5 tracking-wider">comedy.moscow</div>
            </div>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-8">
            {LINKS.map(({ href, label }) => (
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

          <div className="flex items-center gap-3">
            <Link
              href="/events"
              className="hidden md:block text-xs font-bold bg-red hover:bg-red-hover text-white px-5 py-2.5 rounded-md transition-colors shadow-[0_0_20px_rgba(212,66,30,0.3)]"
            >
              Купить билет
            </Link>

            {/* Burger button — mobile only */}
            <button
              onClick={() => setMenuOpen((v) => !v)}
              className="md:hidden flex flex-col justify-center items-center w-10 h-10 gap-1.5"
              aria-label="Меню"
            >
              <span className={cn('block w-6 h-0.5 bg-cream rounded-full transition-all duration-300', menuOpen && 'translate-y-2 rotate-45')} />
              <span className={cn('block w-6 h-0.5 bg-cream rounded-full transition-all duration-300', menuOpen && 'opacity-0')} />
              <span className={cn('block w-6 h-0.5 bg-cream rounded-full transition-all duration-300', menuOpen && '-translate-y-2 -rotate-45')} />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile menu overlay */}
      {menuOpen && (
        <div className="fixed inset-0 z-40 bg-bg/98 backdrop-blur-xl flex flex-col pt-24 px-8 pb-12 md:hidden">
          <nav className="flex flex-col gap-2">
            {LINKS.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={cn(
                  'font-serif font-bold text-4xl py-3 border-b border-border transition-colors',
                  pathname.startsWith(href) ? 'text-cream' : 'text-cream/50 hover:text-cream'
                )}
              >
                {label}
              </Link>
            ))}
          </nav>
          <Link
            href="/events"
            className="mt-auto w-full text-center bg-red text-white text-sm font-bold py-4 rounded-xl shadow-[0_4px_28px_rgba(212,66,30,0.4)]"
          >
            Купить билет →
          </Link>
        </div>
      )}
    </>
  )
}
