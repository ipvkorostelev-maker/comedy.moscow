'use client'

import { useState } from 'react'
import CommissionModal from './CommissionModal'

interface Props {
  artistNames?: string[]
}

export default function CommissionButton({ artistNames }: Props) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="w-full py-2.5 px-4 rounded-lg text-[12px] font-medium transition-all duration-200 border border-white/10 text-cream/45 hover:text-cream/80 hover:border-white/20 hover:bg-white/[0.03]"
      >
        Заказать комика на мероприятие
      </button>
      <CommissionModal open={open} onClose={() => setOpen(false)} artistNames={artistNames} />
    </>
  )
}
