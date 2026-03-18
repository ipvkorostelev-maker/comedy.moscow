'use client'

interface BuyButtonProps {
  ticketType?: 'yandex' | 'external'
  ticketUrl?: string
  yandexWidgetId?: string
  className?: string
  label?: string
}

export default function BuyButton({
  ticketType,
  ticketUrl,
  yandexWidgetId,
  className = '',
  label = 'Купить билет →',
}: BuyButtonProps) {
  const isYandex = ticketType === 'yandex' && !!yandexWidgetId

  function handleYandex(e: React.MouseEvent) {
    e.preventDefault()
    const d = (window as any).YandexTicketsDealer
    if (d && typeof d.push === 'function') {
      d.push(['getDealer', function (dealer: any) {
        dealer.open({ id: yandexWidgetId, type: 'session' })
      }])
    }
  }

  const cls = `inline-flex items-center justify-center bg-red hover:bg-red-hover text-white text-sm font-bold px-7 py-3.5 rounded-xl transition-all shadow-red ${className}`

  if (isYandex) {
    return (
      <button type="button" onClick={handleYandex} className={cls}>
        {label}
      </button>
    )
  }

  if (ticketUrl) {
    return (
      <a href={ticketUrl} target="_blank" rel="noopener noreferrer" className={cls}>
        {label}
      </a>
    )
  }

  return (
    <span className={`${cls} opacity-50 cursor-default`}>
      {label}
    </span>
  )
}
