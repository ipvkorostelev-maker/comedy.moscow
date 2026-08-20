'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { useNavLabel } from '@/components/ui/NavLabelProvider'
import SearchModal from '@/components/ui/SearchModal'
import CitySelector from '@/components/ui/CitySelector'
import type { CityInfo } from '@/lib/data'

const LINKS = [
  { href: '/', label: 'Главная', exact: true },
  { href: '/events', label: 'События' },
  { href: '/#tours', label: 'Гастроли', hash: true },
  { href: '/artists', label: 'Артисты' },
  { href: '/corporate', label: 'Корпоратив' },
  { href: '/contacts', label: 'Контакты' },
]

interface NavProps {
  cities: CityInfo[]
}

export default function Nav({ cities }: NavProps) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()
  const { label } = useNavLabel()

  useEffect(() => { setMenuOpen(false) }, [pathname])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  const isCityPage = pathname.startsWith('/city/')
  const logoHref = isCityPage ? pathname : '/'
  const brandLabel =
    pathname.startsWith('/tour') || pathname.startsWith('/artist-tour')
      ? 'Стендап туры'
      : label ?? 'Стендап в Москве'

  const linkCls = (active: boolean) =>
    cn(
      'px-3.5 h-9 inline-flex items-center rounded-md text-[13px] font-medium transition-colors duration-200',
      active
        ? 'text-cream bg-white/[0.07]'
        : 'text-cream/50 hover:text-cream hover:bg-white/[0.05]'
    )

  return (
    <>
      <header
        className="sticky top-0 left-0 right-0 z-50 h-14 lg:h-[60px] flex items-center backdrop-blur-md transition-colors duration-300"
        style={{
          background: scrolled ? 'rgba(10,10,10,0.97)' : 'rgba(10,10,10,0.9)',
          borderBottom: '1px solid rgba(255,255,255,0.08)',
        }}
      >
        <div className="w-full max-w-[1600px] mx-auto flex items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Brand */}
          <Link
            href={logoHref}
            className="flex items-baseline gap-2 group flex-shrink-0 min-w-0"
            aria-label="Главная"
          >
            <span className="font-serif font-black text-cream text-sm lg:text-[15px] uppercase tracking-[0.04em] group-hover:text-red transition-colors whitespace-nowrap">
              {brandLabel}
            </span>
            <span className="text-[9px] lg:text-[10px] text-cream/30 tracking-[0.1em] hidden sm:inline whitespace-nowrap">
              comedy.moscow
            </span>
          </Link>

          {/* Desktop: nav links + city selector + search */}
          <div className="hidden md:flex items-center gap-0.5">
            <nav className="flex items-center" aria-label="Основное меню">
              {LINKS.map(({ href, label, hash, exact }) => {
                const active = exact ? pathname === href : hash ? pathname === '/' : pathname.startsWith(href)
                if (hash) return <a key={href} href={href} className={linkCls(active)}>{label}</a>
                return (
                  <Link key={href} href={href} className={linkCls(active)}>
                    {label}
                  </Link>
                )
              })}
            </nav>
            <div className="w-px h-5 bg-white/10 mx-2" />
            <CitySelector cities={cities} />
            <button
              onClick={() => setSearchOpen(true)}
              aria-label="Поиск"
              className="ml-1 h-10 w-10 inline-flex items-center justify-center rounded-md text-cream/50 hover:text-cream hover:bg-white/[0.05] transition-colors"
            >
              <svg width="18" height="18" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="9" cy="9" r="6" />
                <path d="M13.5 13.5L18 18" />
              </svg>
            </button>
          </div>

          {/* Mobile: logo already left; city + menu */}
          <div className="flex md:hidden items-center gap-1.5">
            <CitySelector cities={cities} compact />
            <button
              onClick={() => setMenuOpen(v => !v)}
              aria-label={menuOpen ? 'Закрыть меню' : 'Открыть меню'}
              aria-expanded={menuOpen}
              className="flex items-center justify-center w-11 h-11 rounded-md transition-colors"
              style={{ background: menuOpen ? 'rgba(255,255,255,0.08)' : 'transparent' }}
            >
              <span className="relative w-[18px] h-3 flex flex-col justify-between">
                <span className={cn(
                  'block w-full h-[2px] bg-cream/90 rounded-full transition-all duration-300 origin-center',
                  menuOpen && 'translate-y-[5px] rotate-45'
                )} />
                <span className={cn(
                  'block w-full h-[2px] bg-cream/90 rounded-full transition-all duration-300',
                  menuOpen && 'opacity-0 scale-x-0'
                )} />
                <span className={cn(
                  'block w-full h-[2px] bg-cream/90 rounded-full transition-all duration-300',
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
          'fixed inset-0 z-40 md:hidden transition-opacity duration-300',
          menuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        )}
        style={{ background: 'rgba(10,10,10,0.97)', backdropFilter: 'blur(20px)' }}
        aria-hidden={!menuOpen}
      >
        <nav className="flex flex-col items-center gap-2 overflow-y-auto pt-24 pb-16 px-4 h-full" aria-label="Мобильное меню">
          <button
            onClick={() => { setMenuOpen(false); setSearchOpen(true) }}
            className="w-64 py-3.5 flex items-center justify-center gap-2 text-[15px] font-medium rounded-xl bg-white/[0.06] text-cream transition-colors hover:bg-white/[0.1] mb-2"
          >
            <svg width="16" height="16" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="9" cy="9" r="6" />
              <path d="M13.5 13.5L18 18" />
            </svg>
            Поиск
          </button>

          {LINKS.map(({ href, label, hash, exact }) => {
            const active = exact ? pathname === href : hash ? pathname === '/' : pathname.startsWith(href)
            const cls = cn(
              'w-64 py-3.5 text-center text-base font-medium rounded-xl transition-colors duration-200',
              active ? 'text-cream bg-white/[0.06]' : 'text-cream/60 hover:text-cream/90 hover:bg-white/[0.04]'
            )
            if (hash) {
              return (
                <a key={href} href={href} onClick={() => setMenuOpen(false)} className={cls}>
                  {label}
                </a>
              )
            }
            return (
              <Link key={href} href={href} onClick={() => setMenuOpen(false)} className={cls}>
                {label}
              </Link>
            )
          })}

          {cities.length > 0 && (
            <>
              <div className="w-64 h-px bg-white/10 my-4" />
              <p className="text-[10px] text-muted uppercase tracking-[0.15em] mb-2">Города</p>
              <div className="w-64 grid grid-cols-2 gap-1.5">
                {cities.map((city) => {
                  const isSelected = (pathname === `/city/${city.slug}`) || (!pathname.startsWith('/city/') && city.slug === 'moskva')
                  return (
                    <Link
                      key={city.slug}
                      href={city.slug === 'moskva' ? '/' : `/city/${city.slug}`}
                      onClick={() => setMenuOpen(false)}
                      className={cn(
                        'px-3 py-2.5 text-center text-xs font-medium rounded-lg transition-colors duration-200',
                        isSelected
                          ? 'text-cream bg-white/[0.06]'
                          : 'text-cream/50 hover:text-cream/80 hover:bg-white/[0.04]'
                      )}
                    >
                      {city.name}
                    </Link>
                  )
                })}
              </div>
            </>
          )}
        </nav>
      </div>

      <SearchModal open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  )
}
