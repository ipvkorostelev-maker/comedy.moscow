import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

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

export function minEventPrice(event: {
  tickets: { standard: { price: number }; premium: { price: number }; vip: { price: number } }
}): number {
  return Math.min(
    event.tickets.standard.price,
    event.tickets.premium.price,
    event.tickets.vip.price
  )
}
