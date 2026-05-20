'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

const LINKS = [
  { href: '/events', label: 'События' },
  { href: '/artists', label: 'Артисты' },
  { href: '/corporate', label: 'Корпоратив' },
  { href: '/contacts', label: 'Контакты' },
]

export default function Nav() {
  const [menuOpen, setMenuOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => { setMenuOpen(false) }, [pathname])

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  return (
    <>
      <header
        className="sticky top-0 left-0 right-0 z-50 h-12 lg:h-14 flex items-center backdrop-blur-md"
        style={{
          background: 'rgba(10,10,10,0.78)',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
        }}
      >
        <div className="w-full max-w-[1920px] mx-auto flex items-center justify-between px-4 lg:px-8">
          {/* Brand */}
          <Link href="/" className="flex items-baseline gap-2 group flex-shrink-0" aria-label="Главная">
            <span className="font-serif font-black text-cream text-sm lg:text-[15px] uppercase tracking-[0.04em] group-hover:text-red transition-colors">
              Стендап в Москве
            </span>
            <span className="text-[9px] lg:text-[10px] text-cream/30 tracking-[0.1em] hidden sm:inline">
              comedy.moscow
            </span>
          </Link>

          {/* Desktop links */}
          <nav className="hidden md:flex items-center gap-1" aria-label="Основное меню">
            {LINKS.map(({ href, label }) => {
              const active = pathname.startsWith(href)
              return (
                <Link
                  key={href}
                  href={href}
                  aria-current={active ? 'page' : undefined}
                  className={cn(
                    'px-3.5 py-1.5 rounded-md text-[13px] font-medium transition-all duration-200',
                    active
                      ? 'text-cream bg-white/8'
                      : 'text-cream/45 hover:text-cream/80 hover:bg-white/[0.04]'
                  )}
                >
                  {label}
                </Link>
              )
            })}
          </nav>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMenuOpen(v => !v)}
            aria-label="Меню"
            aria-expanded={menuOpen}
            className="md:hidden flex items-center justify-center w-8 h-8 rounded-md transition-colors"
            style={{ background: menuOpen ? 'rgba(255,255,255,0.08)' : 'transparent' }}
          >
            <span className="relative w-4 h-3 flex flex-col justify-between">
              <span className={cn(
                'block w-full h-px bg-cream/80 rounded-full transition-all duration-300 origin-center',
                menuOpen && 'translate-y-[5px] rotate-45'
              )} />
              <span className={cn(
                'block w-full h-px bg-cream/80 rounded-full transition-all duration-300',
                menuOpen && 'opacity-0 scale-x-0'
              )} />
              <span className={cn(
                'block w-full h-px bg-cream/80 rounded-full transition-all duration-300 origin-center',
                menuOpen && '-translate-y-[5px] -rotate-45'
              )} />
            </span>
          </button>
        </div>
      </header>

      {/* Mobile menu overlay */}
      <div
        className={cn(
          'fixed inset-0 z-40 md:hidden transition-all duration-300',
          menuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        )}
        style={{ background: 'rgba(0,0,0,0.94)', backdropFilter: 'blur(20px)' }}
      >
        <nav className="flex flex-col items-center justify-center h-full gap-2" aria-label="Мобильное меню">
          {LINKS.map(({ href, label }) => {
            const active = pathname.startsWith(href)
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  'w-56 py-4 text-center text-lg font-medium rounded-xl transition-all duration-200',
                  active
                    ? 'text-cream bg-white/[0.06]'
                    : 'text-cream/45 hover:text-cream/80'
                )}
              >
                {label}
              </Link>
            )
          })}
        </nav>
      </div>
    </>
  )
}
