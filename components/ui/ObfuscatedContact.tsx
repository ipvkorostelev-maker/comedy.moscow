'use client'

import { useState, useEffect } from 'react'

interface ObfuscatedContactProps {
  parts: string[]       // split value, assembled on client only
  href: string          // tel: or mailto: prefix + assembled value
  className?: string
}

export default function ObfuscatedContact({ parts, href, className = '' }: ObfuscatedContactProps) {
  const [value, setValue] = useState('')
  const [link, setLink] = useState('#')

  useEffect(() => {
    const assembled = parts.join('')
    setValue(assembled)
    setLink(href.replace('__VALUE__', assembled))
  }, [])

  if (!value) return <span className={className}>—</span>

  return (
    <a href={link} className={className}>
      {value}
    </a>
  )
}
