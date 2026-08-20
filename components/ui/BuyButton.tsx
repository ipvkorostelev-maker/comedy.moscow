'use client'

import { getTicketProvider } from '@/lib/utils'

interface BuyButtonProps {
  ticketType?: 'yandex' | 'external'
  ticketUrl?: string
  yandexWidgetId?: string
  className?: string
  label?: string
  subtitle?: string
}

export default function BuyButton({
  ticketType,
  ticketUrl,
  yandexWidgetId,
  className = '',
  label = 'Купить билет',
  subtitle,
}: BuyButtonProps) {
  const isYandex = ticketType === 'yandex' && !!yandexWidgetId
  const provider = subtitle ?? getTicketProvider(ticketUrl) ?? (isYandex ? 'Яндекс Билеты' : null)

  function trackGoal() {
    const ym = (window as any).ym
    if (typeof ym !== 'function') return
    ym(108210320, 'reachGoal', 'buy_ticket_click')
    // 94359734 — счётчик Директа/виджета, его цели (выбор мест, покупка)
    // виджет Яндекса стреляет сам через trustedDomains, дублировать не нужно
  }

  function handleYandex(e: React.MouseEvent) {
    e.preventDefault()
    trackGoal()
    const d = (window as any).YandexTicketsDealer
    if (d && typeof d.push === 'function') {
      // yandexWidgetId format: "ticketsteam-4063@60615011" — extract session ID after @
      const sessionId = yandexWidgetId!.includes('@')
        ? yandexWidgetId!.split('@')[1]
        : yandexWidgetId
      d.push(['getDealer', function (dealer: any) {
        dealer.open({ id: sessionId, type: 'session' })
      }])
    }
  }

  const cls = `group inline-flex items-center justify-center gap-2.5 text-black text-base font-extrabold px-8 py-4 min-h-[52px] rounded-xl transition-all duration-200 hover:-translate-y-0.5 hover:brightness-105 active:scale-[0.98] ${className}`
  const s = { backgroundColor: 'rgb(253, 246, 2)', boxShadow: '0 6px 24px rgba(253,246,2,0.32)' }

  const arrow = (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="shrink-0 transition-transform duration-200 group-hover:translate-x-1"
    >
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  )

  if (isYandex) {
    return (
      <div>
        <button type="button" onClick={handleYandex} className={cls} style={s}>
          {label}
          {arrow}
        </button>
        {provider && <p className="text-[10px] text-muted text-center mt-1.5">{provider}</p>}
      </div>
    )
  }

  if (ticketUrl) {
    return (
      <div>
        <a href={ticketUrl} target="_blank" rel="noopener noreferrer" className={cls} style={s} onClick={trackGoal}>
          {label}
          {arrow}
        </a>
        {provider && <p className="text-[10px] text-muted text-center mt-1.5">{provider}</p>}
      </div>
    )
  }

  return (
    <div>
      <span className={`${cls} opacity-50 cursor-default pointer-events-none`} style={s}>
        {label}
        {arrow}
      </span>
      {provider && <p className="text-[10px] text-muted text-center mt-1.5">{provider}</p>}
    </div>
  )
}
