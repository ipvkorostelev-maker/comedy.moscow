'use client'

import { useState } from 'react'

export default function PromoCode({ code, text }: { code: string; text?: string }) {
  const [status, setStatus] = useState<'idle' | 'copied' | 'error'>('idle')

  async function copy() {
    try {
      await navigator.clipboard.writeText(code)
      setStatus('copied')
    } catch {
      setStatus('error')
    }
  }

  return <div className="event-promo">
    {text?.trim() && <p className="event-promo-text">{text.trim()}</p>}
    <button type="button" className="event-promo-button" onClick={copy} aria-label={`Скопировать промокод ${code}`}>
      <span><span className="event-promo-label">Промокод</span><strong>{code}</strong></span>
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><rect x="8" y="8" width="12" height="13" rx="2"/><path d="M16 8V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h3"/></svg>
    </button>
    <span className="event-promo-status" role="status">{status === 'copied' ? 'Скопировано' : status === 'error' ? 'Не удалось скопировать. Выделите и скопируйте код вручную.' : 'Нажмите, чтобы скопировать'}</span>
  </div>
}
