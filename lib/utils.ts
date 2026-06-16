import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export const BASE = 'https://comedy.moscow'

export const RU_MAP: Record<string, string> = {
  а:'a',б:'b',в:'v',г:'g',д:'d',е:'e',ё:'yo',ж:'zh',з:'z',и:'i',й:'y',
  к:'k',л:'l',м:'m',н:'n',о:'o',п:'p',р:'r',с:'s',т:'t',у:'u',ф:'f',
  х:'kh',ц:'ts',ч:'ch',ш:'sh',щ:'shch',ъ:'',ы:'y',ь:'',э:'e',ю:'yu',я:'ya',
}

export function toSlug(text: string, fallbackId = ''): string {
  if (!text) return fallbackId
  return text
    .toLowerCase()
    .replace(/[а-яё]/g, (c) => RU_MAP[c] ?? c)
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    || fallbackId
}

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

/**
 * Возвращает индекс формы склонения для русского числительного:
 * 0 — один (1, 21, 31…): «концерт», «город»
 * 1 — два-четыре (2-4, 22-24…): «концерта», «города»
 * 2 — пять-двадцать (5-20, 25-30…): «концертов», «городов»
 */
export function pluralForm(n: number): number {
  const mod10 = n % 10
  const mod100 = n % 100
  if (mod10 === 1 && mod100 !== 11) return 0
  if (mod10 >= 2 && mod10 <= 4 && !(mod100 >= 12 && mod100 <= 14)) return 1
  return 2
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
