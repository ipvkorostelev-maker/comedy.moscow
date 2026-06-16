'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { useNavLabel } from '@/components/ui/NavLabelProvider'
import SearchModal from '@/components/ui/SearchModal'

const LINKS = [
  { href: '/events', label: 'События' },
  { href: '/#tours', label: 'Гастроли', hash: true },
  { href: '/artists', label: 'Артисты' },
  { href: '/corporate', label: 'Корпоратив' },
  { href: '/contacts', label: 'Контакты' },
]

export default function Nav() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const pathname = usePathname()
  const { label } = useNavLabel()

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
              {pathname.startsWith('/tour') || pathname.startsWith('/artist-tour')
                      ? 'Стендап туры'
                      : label ?? 'Стендап в Москве'}
            </span>
            <span className="text-[9px] lg:text-[10px] text-cream/30 tracking-[0.1em] hidden sm:inline">
              comedy.moscow
            </span>
          </Link>

          {/* Desktop: nav links + search */}
          <div className="hidden md:flex items-center gap-1">
            <nav className="flex items-center gap-1" aria-label="Основное меню">
              {LINKS.map(({ href, label, hash }) => {
                const active = hash ? pathname === '/' : pathname.startsWith(href)
                const cls = cn(
                  'px-3.5 py-1.5 rounded-md text-[13px] font-medium transition-all duration-200',
                  active
                    ? 'text-cream bg-white/8'
                    : 'text-cream/45 hover:text-cream/80 hover:bg-white/[0.04]'
                )
                if (hash) return <a key={href} href={href} className={cls}>{label}</a>
                return (
                  <Link
                    key={href}
                    href={href}
                    aria-current={active ? 'page' : undefined}
                    className={cls}
                  >
                    {label}
                  </Link>
                )
              })}
            </nav>
            <button
              onClick={() => setSearchOpen(true)}
              aria-label="Поиск"
              className="w-8 h-8 flex items-center justify-center rounded-md text-cream/50 hover:text-cream transition-colors"
            >
              <svg width="18" height="18" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="9" cy="9" r="6" />
                <path d="M13.5 13.5L18 18" />
              </svg>
            </button>
          </div>

          {/* Mobile: search + hamburger */}
          <div className="flex md:hidden items-center gap-1">
            <button
              onClick={() => setSearchOpen(true)}
              aria-label="Поиск"
              className="w-8 h-8 flex items-center justify-center rounded-md text-cream/50 hover:text-cream transition-colors"
            >
              <svg width="18" height="18" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="9" cy="9" r="6" />
                <path d="M13.5 13.5L18 18" />
              </svg>
            </button>
            <button
              onClick={() => setMenuOpen(v => !v)}
              aria-label="Меню"
              aria-expanded={menuOpen}
              className="flex items-center justify-center w-8 h-8 rounded-md transition-colors"
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
          {LINKS.map(({ href, label, hash }) => {
            const active = hash ? pathname === '/' : pathname.startsWith(href)
            const cls = cn(
              'w-56 py-4 text-center text-lg font-medium rounded-xl transition-all duration-200',
              active
                ? 'text-cream bg-white/[0.06]'
                : 'text-cream/45 hover:text-cream/80'
            )
            if (hash) {
              return (
                <a
                  key={href}
                  href={href}
                  onClick={() => setMenuOpen(false)}
                  className={cls}
                >
                  {label}
                </a>
              )
            }
            return (
              <Link
                key={href}
                href={href}
                className={cls}
              >
                {label}
              </Link>
            )
          })}
        </nav>
      </div>

      <SearchModal open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  )
}
