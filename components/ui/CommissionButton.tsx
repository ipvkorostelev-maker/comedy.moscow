'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'
import CommissionModal from './CommissionModal'

interface Props {
  artistNames?: string[]
  className?: string
}

export default function CommissionButton({ artistNames, className }: Props) {
  const [open, setOpen] = useState(false)
  const count = artistNames?.length ?? 0
  const word = count > 1 ? 'комиков' : 'комика'

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className={cn(
          'rounded-lg text-[12px] font-medium transition-all duration-200 border',
          'text-gold/80 border-gold/20 hover:text-gold hover:border-gold/40 hover:bg-gold/[0.04]',
          className
        )}
      >
        Заказать {word} на мероприятие
      </button>
      <CommissionModal open={open} onClose={() => setOpen(false)} artistNames={artistNames} />
    </>
  )
}
