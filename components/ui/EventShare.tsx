'use client'

import { useRef, useState } from 'react'

export default function EventShare({ url, title }: { url: string; title: string }) {
  const dialog = useRef<HTMLDialogElement>(null)
  const input = useRef<HTMLInputElement>(null)
  const [message, setMessage] = useState('')
  async function copy() {
    try {
      await navigator.clipboard.writeText(url)
      setMessage('Ссылка скопирована')
    } catch {
      input.current?.focus()
      input.current?.select()
      setMessage('Скопируйте выделенную ссылку вручную')
    }
  }
  return <>
    <button type="button" className="event-share" onClick={() => { setMessage(''); dialog.current?.showModal() }}>Поделиться ↗</button>
    <dialog ref={dialog} className="event-share-dialog" aria-labelledby="event-share-title">
      <div className="event-dialog-top"><h2 id="event-share-title">Поделиться концертом</h2><button type="button" aria-label="Закрыть" onClick={() => dialog.current?.close()}>×</button></div>
      <label htmlFor="event-share-url">Ссылка на концерт</label>
      <input ref={input} id="event-share-url" value={url} readOnly />
      <button type="button" className="event-copy" onClick={copy}>Скопировать ссылку</button>
      <p role="status">{message}</p>
      <div className="event-share-links">
        <a href={`https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`} target="_blank" rel="noopener noreferrer">Telegram ↗</a>
        <a href={`https://vk.com/share.php?url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}`} target="_blank" rel="noopener noreferrer">ВКонтакте ↗</a>
        <a href={`https://max.ru/:share?text=${encodeURIComponent(title + ' ' + url)}`} target="_blank" rel="noopener noreferrer">Max ↗</a>
      </div>
    </dialog>
  </>
}
