import type { Event } from '@/lib/types'
import BuyButton from '@/components/ui/BuyButton'
import InticketsBuyButton from '@/components/ui/InticketsBuyButton'

export function hasEventTickets(event: Event) {
  return !!(event.ticketUrl || (event.ticketType === 'yandex' && event.yandexWidgetId) || event.inticketsUrl || event.buyButtons?.length)
}

export default function EventTickets({ event }: { event: Event }) {
  const primary = !!(event.ticketUrl || (event.ticketType === 'yandex' && event.yandexWidgetId))
  const secondary = event.inticketsUrl && (!primary || event.inticketsUrl !== event.ticketUrl)
  const additional = event.buyButtons?.filter((b) => b.time && b.ticketUrl) || []
  const buttons: {
    time: string
    ticketUrl?: string
    ticketType?: Event['ticketType']
    yandexWidgetId?: string
    intickets?: boolean
  }[] = []
  if (primary) buttons.push({ time: event.time, ticketUrl: event.ticketUrl, ticketType: event.ticketType, yandexWidgetId: event.yandexWidgetId })
  if (secondary) buttons.push({ time: event.time, ticketUrl: event.inticketsUrl, intickets: true })
  buttons.push(...additional.map((b) => ({ ...b, ticketType: 'external' as const })))
  const minutes = (time: string) => {
    const [hours, minutes] = time.split(':').map(Number)
    return hours * 60 + minutes
  }
  buttons.sort((a, b) => minutes(a.time) - minutes(b.time))
  const totalCount = buttons.length
  // Название оператора — один раз: при ≥2 кнопках под второй, при одной — под ней
  const providerIndex = totalCount >= 2 ? 1 : 0
  const label = (time: string) => totalCount >= 2 ? `Купить билеты · ${time}` : 'Купить билеты'
  if (!hasEventTickets(event)) return <p className="event-ticket-notice">Информация о билетах уточняется</p>
  return <div className="event-ticket-actions">
    {buttons.map((b, i) => b.intickets
      ? <InticketsBuyButton key={i} url={b.ticketUrl!} label={label(b.time)} className="event-buy" hideProvider={i !== providerIndex} />
      : <BuyButton key={i} ticketType={b.ticketType} ticketUrl={b.ticketUrl} yandexWidgetId={b.yandexWidgetId} variant="event" label={label(b.time)} className="event-buy" hideProvider={i !== providerIndex} />
    )}
  </div>
}
