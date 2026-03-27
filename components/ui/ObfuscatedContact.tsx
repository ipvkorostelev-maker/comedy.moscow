'use client'

import { useState, useEffect } from 'react'

interface ObfuscatedContactProps {
  parts: string[]
  href: string
  className?: string
}

export default function ObfuscatedContact({ parts, href, className = '' }: ObfuscatedContactProps) {
  const [revealed, setRevealed] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return <span className={className}>—</span>

  const value = parts.join('')
  const link = href.replace('__VALUE__', value)

  if (!revealed) {
    return (
      <button
        type="button"
        onClick={() => setRevealed(true)}
        className={`${className} relative inline-flex items-center gap-2 cursor-pointer group/reveal`}
      >
        <span className="relative">
          <span>{value.slice(0, 3)}</span>
          <span className="select-none blur-sm opacity-70">{value.slice(3)}</span>
        </span>
        <span className="text-[10px] text-white font-semibold normal-case tracking-normal font-sans whitespace-nowrap bg-white/15 group-hover/reveal:bg-white/25 border border-white/25 rounded-md px-2 py-0.5 transition-colors">
          Показать
        </span>
      </button>
    )
  }

  return <a href={link} className={className}>{value}</a>
}
