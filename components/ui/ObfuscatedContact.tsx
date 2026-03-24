'use client'

import { useState, useEffect } from 'react'

interface ObfuscatedContactProps {
  parts: string[]
  href: string
  className?: string
}

export default function ObfuscatedContact({ parts, href, className = '' }: ObfuscatedContactProps) {
  const [revealed, setRevealed] = useState(false)
  const [value, setValue] = useState('')
  const [link, setLink] = useState('#')

  useEffect(() => {
    const assembled = parts.join('')
    setValue(assembled)
    setLink(href.replace('__VALUE__', assembled))
  }, [])

  if (!value) return <span className={className}>—</span>

  if (!revealed) {
    return (
      <button
        type="button"
        onClick={() => setRevealed(true)}
        className={`${className} relative inline-flex items-center gap-2 cursor-pointer group/reveal`}
      >
        <span className="relative">
          {/* First 3 chars visible */}
          <span>{value.slice(0, 3)}</span>
          {/* Rest blurred */}
          <span className="select-none blur-sm opacity-70">{value.slice(3)}</span>
        </span>
        <span className="text-[10px] text-white font-semibold normal-case tracking-normal font-sans whitespace-nowrap bg-white/15 group-hover/reveal:bg-white/25 border border-white/25 rounded-md px-2 py-0.5 transition-colors">
          Показать
        </span>
      </button>
    )
  }

  return (
    <a href={link} className={className}>
      {value}
    </a>
  )
}
