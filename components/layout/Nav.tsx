'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

const LINKS = [
  {
    href: '/events',
    label: 'События',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="18" rx="3"/>
        <path d="M16 2v4M8 2v4M3 10h18"/>
      </svg>
    ),
  },
  {
    href: '/artists',
    label: 'Артисты',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2a3 3 0 0 1 3 3v7a3 3 0 0 1-6 0V5a3 3 0 0 1 3-3Z"/>
        <path d="M19 10v2a7 7 0 0 1-14 0v-2M12 19v3M8 22h8"/>
      </svg>
    ),
  },
  {
    href: '/contacts',
    label: 'Контакты',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
      </svg>
    ),
  },
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
      <header className="fixed top-0 left-0 right-0 z-50 pt-3 px-4 pointer-events-none">

        {/* ── DESKTOP: single centered pill ── */}
        <div className="hidden md:flex justify-center">
          <div
            className="pointer-events-auto flex items-center gap-1 p-1.5 rounded-full backdrop-blur-xl border border-white/10"
            style={{
              background: 'linear-gradient(135deg, rgba(232,67,42,0.18) 0%, rgba(14,14,18,0.80) 45%, rgba(232,67,42,0.10) 100%)',
              boxShadow: '0 4px 32px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.09)',
            }}
          >
            {/* Logo inside pill */}
            <Link
              href="/"
              className="flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-200 hover:bg-white/5"
            >
              <div className="relative w-6 h-6 flex-shrink-0">
                <Image src="/logo.png" alt="Logo" fill className="object-contain" style={{ filter: 'brightness(0) invert(1)' }} />
              </div>
              <div className="leading-none">
                <div className="font-serif font-black text-cream text-[10px] uppercase tracking-[0.08em] leading-[1.2]">
                  Стендап<br />в Москве
                </div>
                <div className="text-[8px] text-cream/35 mt-0.5 tracking-wider">comedy.moscow</div>
              </div>
            </Link>

            {/* Divider */}
            <span className="w-px h-6 bg-white/10 mx-1" />

            {/* Nav links */}
            {LINKS.map(({ href, label, icon }) => {
              const active = pathname.startsWith(href)
              return (
                <Link
                  key={href}
                  href={href}
                  aria-current={active ? 'page' : undefined}
                  className={cn(
                    'flex flex-col items-center gap-1 px-5 py-2 rounded-full text-[11px] font-medium tracking-wide transition-all duration-200',
                    active ? 'text-cream' : 'text-cream/45 hover:text-cream/80'
                  )}
                  style={active ? {
                    background: 'linear-gradient(135deg, rgba(232,67,42,0.32) 0%, rgba(232,67,42,0.14) 100%)',
                    boxShadow: '0 2px 12px rgba(232,67,42,0.22), inset 0 1px 0 rgba(255,255,255,0.10)',
                    border: '1px solid rgba(232,67,42,0.28)',
                  } : undefined}
                >
                  {icon}
                  {label}
                </Link>
              )
            })}
          </div>
        </div>

        {/* ── MOBILE: logo left + burger right ── */}
        <div className="flex md:hidden items-center justify-between">
          <Link
            href="/"
            className="pointer-events-auto flex items-center gap-2 px-4 py-2.5 rounded-full backdrop-blur-xl border border-white/10"
            style={{
              background: 'linear-gradient(135deg, rgba(232,67,42,0.18) 0%, rgba(14,14,18,0.80) 100%)',
              boxShadow: '0 4px 20px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.08)',
            }}
          >
            <div className="relative w-6 h-6 flex-shrink-0">
              <Image src="/logo.png" alt="Logo" fill className="object-contain" style={{ filter: 'brightness(0) invert(1)' }} />
            </div>
            <div className="leading-none">
              <div className="font-serif font-black text-cream text-[10px] uppercase tracking-[0.08em] leading-[1.2]">
                Стендап<br />в Москве
              </div>
              <div className="text-[8px] text-cream/35 mt-0.5 tracking-wider">comedy.moscow</div>
            </div>
          </Link>

          <button
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Меню"
            className="pointer-events-auto flex items-center justify-center w-11 h-11 rounded-full backdrop-blur-xl border border-white/10 transition-all duration-200"
            style={{
              background: menuOpen
                ? 'linear-gradient(135deg, rgba(232,67,42,0.35) 0%, rgba(14,14,18,0.85) 100%)'
                : 'linear-gradient(135deg, rgba(232,67,42,0.18) 0%, rgba(14,14,18,0.80) 100%)',
              boxShadow: '0 4px 20px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.08)',
            }}
          >
            <span className="relative w-5 h-4 flex flex-col justify-between">
              <span className={cn('block w-full h-0.5 bg-cream rounded-full transition-all duration-300 origin-center', menuOpen && 'translate-y-[7px] rotate-45')} />
              <span className={cn('block w-full h-0.5 bg-cream rounded-full transition-all duration-300', menuOpen && 'opacity-0 scale-x-0')} />
              <span className={cn('block w-full h-0.5 bg-cream rounded-full transition-all duration-300 origin-center', menuOpen && '-translate-y-[7px] -rotate-45')} />
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
        style={{ background: 'rgba(0,0,0,0.92)', backdropFilter: 'blur(24px)' }}
      >
        <nav className="flex flex-col items-center justify-center h-full gap-3">
          {LINKS.map(({ href, label, icon }) => {
            const active = pathname.startsWith(href)
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  'flex items-center gap-4 w-64 px-8 py-5 rounded-2xl transition-all duration-200',
                  active ? 'text-cream' : 'text-cream/50 hover:text-cream'
                )}
                style={active ? {
                  background: 'linear-gradient(135deg, rgba(232,67,42,0.25) 0%, rgba(232,67,42,0.10) 100%)',
                  border: '1px solid rgba(232,67,42,0.25)',
                } : {
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.07)',
                }}
              >
                <span className="opacity-70">{icon}</span>
                <span className="font-serif font-bold text-2xl">{label}</span>
              </Link>
            )
          })}
        </nav>
      </div>
    </>
  )
}
