import type { Event } from '@/lib/types'
import BuyButton from '@/components/ui/BuyButton'
import InticketsBuyButton from '@/components/ui/InticketsBuyButton'

export function hasEventTickets(event: Event) {
  return !!(event.ticketUrl || (event.ticketType === 'yandex' && event.yandexWidgetId) || event.inticketsUrl)
}

export default function EventTickets({ event }: { event: Event }) {
  const primary = !!(event.ticketUrl || (event.ticketType === 'yandex' && event.yandexWidgetId))
  const secondary = event.inticketsUrl && (!primary || event.inticketsUrl !== event.ticketUrl)
  if (!hasEventTickets(event)) return <p className="event-ticket-notice">Информация о билетах уточняется</p>
  return <div className="event-ticket-actions">
    {primary && <BuyButton ticketType={event.ticketType} ticketUrl={event.ticketUrl} yandexWidgetId={event.yandexWidgetId} variant="event" label="Выбрать места" className="event-buy" />}
    {secondary && <InticketsBuyButton url={event.inticketsUrl!} label={primary ? 'Билеты в Intickets' : 'Выбрать места'} className="event-buy" />}
  </div>
}
