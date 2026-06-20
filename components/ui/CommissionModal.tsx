'use client'

import { useEffect, useRef } from 'react'
import ObfuscatedContact from './ObfuscatedContact'

interface Props {
  open: boolean
  onClose: () => void
  artistNames?: string[]
}

export default function CommissionModal({ open, onClose, artistNames }: Props) {
  const overlayRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    document.body.style.overflow = 'hidden'
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handler)
    return () => {
      document.body.style.overflow = ''
      document.removeEventListener('keydown', handler)
    }
  }, [open, onClose])

  if (!open) return null

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.82)', backdropFilter: 'blur(8px)' }}
      onClick={(e) => { if (e.target === overlayRef.current) onClose() }}
    >
      <div
        className="bg-surface border border-border rounded-2xl w-full max-w-md p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between mb-5">
          <h2 className="font-serif font-bold text-lg text-cream">Заказать комика</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-md text-muted hover:text-cream hover:bg-white/5 transition-colors"
            aria-label="Закрыть"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <p className="text-sm text-cream/70 leading-relaxed mb-5">
          {artistNames && artistNames.length > 0 ? (
            <>Вы можете пригласить <span className="text-cream font-semibold">{artistNames.join(', ')}</span> на корпоратив, частное мероприятие, свадьбу или день рождения. Условия обсуждаются индивидуально.</>
          ) : (
            <>Вы можете пригласить комика на корпоратив, частное мероприятие, свадьбу или день рождения. Условия обсуждаются индивидуально.</>
          )}
        </p>

        <div className="space-y-3 mb-5">
          <div className="flex items-center gap-3 bg-surface-2 border border-border rounded-xl px-4 py-3">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-red shrink-0">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
            </svg>
            <div>
              <p className="text-xs text-muted mb-0.5">Телефон</p>
              <ObfuscatedContact parts={['+7', '906', '73', '14', '55', '1']} href="tel:__VALUE__" className="text-cream font-semibold text-sm" />
            </div>
          </div>

          <div className="flex items-center gap-3 bg-surface-2 border border-border rounded-xl px-4 py-3">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-red shrink-0">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
              <polyline points="22,6 12,13 2,6" />
            </svg>
            <div>
              <p className="text-xs text-muted mb-0.5">Email</p>
              <ObfuscatedContact parts={['River-show', '@', 'mail', '.', 'ru']} href="mailto:__VALUE__" className="text-cream font-semibold text-sm" />
            </div>
          </div>
        </div>

        <p className="text-[11px] text-muted/60 leading-relaxed border-t border-border pt-4">
          Свяжитесь с нами любым удобным способом — мы обсудим дату, состав участников и стоимость.
        </p>
      </div>
    </div>
  )
}
