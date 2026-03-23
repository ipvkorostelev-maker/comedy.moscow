import { cn } from '@/lib/utils'

const CalendarIcon = () => (
  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0">
    <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
  </svg>
)

const ClockIcon = () => (
  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0">
    <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
  </svg>
)

const PinIcon = () => (
  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/>
  </svg>
)

type PillVariant = 'solid' | 'glass'

interface MetaPillProps {
  type: 'date' | 'time' | 'venue'
  children: React.ReactNode
  variant?: PillVariant
  className?: string
}

// Solid variant — colored accent pills on dark card background
const solidCls: Record<'date' | 'time' | 'venue', string> = {
  date:  'bg-blue-500/15 border border-blue-400/30 text-blue-300',
  time:  'bg-blue-500/15 border border-blue-400/30 text-blue-300',
  venue: 'bg-blue-500/15 border border-blue-400/30 text-blue-300',
}

// Glass variant (on image backgrounds — hero, slider)
const glassCls = 'bg-white/10 backdrop-blur-sm border border-white/15 text-cream'

export default function MetaPill({ type, children, variant = 'solid', className }: MetaPillProps) {
  const colorCls = variant === 'glass' ? glassCls : solidCls[type]

  const base = cn(
    'inline-flex items-center gap-1.5 text-[11px] font-medium px-2.5 py-1 rounded-md',
    colorCls,
    className
  )

  const Icon = type === 'date' ? CalendarIcon : type === 'time' ? ClockIcon : PinIcon

  return (
    <span className={base}>
      <Icon />
      {type === 'venue' ? <span className="truncate">{children}</span> : children}
    </span>
  )
}
