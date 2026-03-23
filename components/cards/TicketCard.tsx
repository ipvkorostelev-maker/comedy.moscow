import { TicketTier } from '@/lib/types'
import { formatPrice, cn } from '@/lib/utils'
import { ZapIcon } from '@/components/ui/icons'

type TicketType = 'standard' | 'premium' | 'vip'

interface TicketCardProps {
  type: TicketType
  tier: TicketTier
  featured?: boolean
  perks: string[]
}

const LABELS: Record<TicketType, string> = {
  standard: 'Стандарт',
  premium: 'Премиум',
  vip: 'VIP',
}

export default function TicketCard({ type, tier, featured, perks }: TicketCardProps) {
  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-2xl p-6 bg-surface border transition-all duration-200',
        featured ? 'border-red' : 'border-border hover:border-muted-2 hover:-translate-y-0.5',
        !tier.available && 'opacity-50'
      )}
    >
      {/* Ambient glow */}
      <div className="absolute -top-10 -right-10 w-36 h-36 rounded-full bg-red/5 blur-2xl pointer-events-none" />

      {featured && (
        <div className="absolute top-0 right-0 bg-red text-white text-[9px] font-bold uppercase tracking-widest px-4 py-1.5 rounded-bl-xl rounded-tr-2xl">
          Популярный
        </div>
      )}

      <p className="text-[10px] font-bold tracking-[0.14em] uppercase text-muted mb-2.5">
        {LABELS[type]}
      </p>

      <div className="font-serif text-3xl font-black text-cream mb-1">
        {formatPrice(tier.price)}{' '}
      </div>

      {tier.seats && (
        <p className="inline-flex items-center gap-1 text-[11px] text-gold font-semibold mb-5">
          <ZapIcon className="w-2.5 h-2.5" />
          Осталось {tier.seats} мест
        </p>
      )}

      <ul className="space-y-2 mb-6 mt-4">
        {perks.map((perk) => (
          <li key={perk} className="flex items-center gap-2 text-xs text-cream/70">
            <span className="text-red font-bold text-[11px] flex-shrink-0">✓</span>
            {perk}
          </li>
        ))}
      </ul>

      <button
        disabled={!tier.available}
        className={cn(
          'w-full py-3 rounded-lg text-sm font-bold transition-all',
          featured
            ? 'bg-red text-white hover:opacity-85 shadow-[0_4px_18px_rgba(212,66,30,0.35)]'
            : 'bg-transparent text-cream border-[1.5px] border-border hover:border-muted',
          !tier.available && 'cursor-not-allowed'
        )}
      >
        {tier.available ? (featured ? 'Купить →' : 'Выбрать →') : 'Продано'}
      </button>
    </div>
  )
}
