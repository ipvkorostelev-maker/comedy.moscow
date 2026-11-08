'use client'

import { useEffect, useId, useRef, useState } from 'react'
import Image from 'next/image'

export default function PromoCode({ code, text, instructionImage }: { code: string; text?: string; instructionImage?: string }) {
  const [status, setStatus] = useState<'idle' | 'copied' | 'error'>('idle')
  const [open, setOpen] = useState(false)
  const [imageError, setImageError] = useState(false)
  const dialog = useRef<HTMLDialogElement>(null)
  const titleId = useId()
  const image = instructionImage?.trim()

  useEffect(() => {
    if (!open || !image) return
    const element = dialog.current
    if (!element) return
    element.showModal()
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      element.close()
      document.body.style.overflow = previousOverflow
    }
  }, [open, image])

  function showInstruction() {
    setImageError(false)
    setOpen(true)
  }

  async function copy() {
    try {
      await navigator.clipboard.writeText(code)
      setStatus('copied')
      if (image) showInstruction()
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
    {image && <>
      <button type="button" className="event-promo-help" onClick={showInstruction} aria-haspopup="dialog">куда ввести промокод</button>
      <dialog ref={dialog} className="event-promo-dialog" aria-labelledby={titleId} onClose={() => setOpen(false)} onClick={(event) => {
        if (event.target !== event.currentTarget) return
        const rect = event.currentTarget.getBoundingClientRect()
        if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.current?.close()
      }}>
        <div className="event-promo-dialog-top">
          <h2 id={titleId}>Куда ввести промокод</h2>
          <button type="button" aria-label="Закрыть инструкцию" onClick={() => dialog.current?.close()}>×</button>
        </div>
        <p className="event-promo-dialog-code">{status === 'copied' ? 'Промокод скопирован: ' : 'Промокод: '}<strong>{code}</strong></p>
        {imageError ? <p role="status">Не удалось загрузить инструкцию. <a href={image} target="_blank" rel="noopener noreferrer">Открыть изображение ↗</a></p> : <Image src={image} alt="Инструкция: куда ввести промокод при покупке билета" width={1200} height={800} unoptimized onError={() => setImageError(true)} />}
      </dialog>
    </>}
  </div>
}
