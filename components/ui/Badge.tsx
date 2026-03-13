import { cn } from '@/lib/utils'

type BadgeVariant = 'red' | 'gold' | 'dark' | 'outline'

interface BadgeProps {
  variant?: BadgeVariant
  children: React.ReactNode
  className?: string
}

const variants: Record<BadgeVariant, string> = {
  red: 'bg-red text-white',
  gold: 'bg-gold text-[#1A1208]',
  dark: 'bg-surface-2 text-muted border border-border',
  outline: 'border border-border text-muted',
}

export default function Badge({ variant = 'dark', children, className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 text-[9px] font-bold tracking-[0.12em] uppercase px-3 py-1 rounded',
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  )
}
