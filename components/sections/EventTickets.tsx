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
  const totalCount = (primary ? 1 : 0) + (secondary ? 1 : 0) + additional.length
  const label = (time: string) => totalCount >= 2 ? `Купить билеты · ${time}` : 'Купить билеты'
  if (!hasEventTickets(event)) return <p className="event-ticket-notice">Информация о билетах уточняется</p>
  return <div className="event-ticket-actions">
    {primary && <BuyButton ticketType={event.ticketType} ticketUrl={event.ticketUrl} yandexWidgetId={event.yandexWidgetId} variant="event" label={label(event.time)} className="event-buy" />}
    {secondary && <InticketsBuyButton url={event.inticketsUrl!} label={label(event.time)} className="event-buy" />}
    {additional.map((b, i) => (
      <BuyButton key={i} ticketType="external" ticketUrl={b.ticketUrl} variant="event" label={label(b.time)} className="event-buy" />
    ))}
  </div>
}
