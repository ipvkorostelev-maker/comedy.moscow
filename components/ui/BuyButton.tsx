'use client'

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
  label = 'Купить билет →',
  subtitle = 'Яндекс Билеты',
}: BuyButtonProps) {
  const isYandex = ticketType === 'yandex' && !!yandexWidgetId

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

  const cls = `inline-flex items-center justify-center text-black text-sm font-bold px-7 py-3.5 rounded-xl transition-all hover:brightness-90 active:scale-95 ${className}`
  const s = { backgroundColor: 'rgb(253, 246, 2)', boxShadow: '0 4px 14px rgba(253,246,2,0.30)' }

  if (isYandex) {
    return (
      <div>
        <button type="button" onClick={handleYandex} className={cls} style={s}>
          {label}
        </button>
        <p className="text-[10px] text-muted text-center mt-1.5">{subtitle}</p>
      </div>
    )
  }

  if (ticketUrl) {
    return (
      <div>
        <a href={ticketUrl} target="_blank" rel="noopener noreferrer" className={cls} style={s} onClick={trackGoal}>
          {label}
        </a>
        <p className="text-[10px] text-muted text-center mt-1.5">{subtitle}</p>
      </div>
    )
  }

  return (
    <div>
      <span className={`${cls} opacity-50 cursor-default`} style={s}>
        {label}
      </span>
      <p className="text-[10px] text-muted text-center mt-1.5">{subtitle}</p>
    </div>
  )
}
