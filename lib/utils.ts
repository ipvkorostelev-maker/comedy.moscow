import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export const BASE = 'https://comedy.moscow'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

export function formatDateShort(dateString: string): string {
  return new Date(dateString).toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
  })
}

export function formatDayOfWeek(dateString: string): string {
  return new Date(dateString).toLocaleDateString('ru-RU', { weekday: 'long' })
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat('ru-RU').format(price) + '\u00a0₽'
}

export function stripHtml(html: string): string {
  return html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()
}

/** Определяет провайдера билетов по URL */
export function getTicketProvider(url?: string): string | null {
  if (!url) return null
  if (url.includes('ticketscloud.com')) return 'Ticketscloud'
  if (url.includes('widget.afisha.yandex.ru')) return 'Яндекс Билеты'
  if (url.includes('intickets.ru')) return 'Intickets'
  return null
}

export function minEventPrice(event: {
  tickets: { standard: { price: number }; premium: { price: number }; vip: { price: number } }
}): number {
  return Math.min(
    event.tickets.standard.price,
    event.tickets.premium.price,
    event.tickets.vip.price
  )
}
