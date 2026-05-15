import { getAllEvents } from '@/lib/data'
import { minEventPrice, formatDateShort, BASE } from '@/lib/utils'

export const dynamic = 'force-dynamic'

export async function GET() {
  const events = await getAllEvents()

  const lines = [
    '# comedy.moscow (Смешно)',
    '> Стендап-концерты в Москве и Санкт-Петербурге. Афиша, расписание, купить билеты.',
    '',
    '## Ближайшие мероприятия',
    ...events.slice(0, 20).map((e) => {
      const price = minEventPrice(e)
      const venue = e.venueName ?? e.city ?? ''
      const priceStr = price > 0 ? `от ${price} ₽` : 'бесплатно'
      return `- ${e.title} | ${formatDateShort(e.date)} ${e.time} | ${venue} | ${priceStr} | ${BASE}/events/${e.slug}`
    }),
    '',
    '## Постоянные ссылки',
    `- Все события: ${BASE}/events`,
    `- Все артисты: ${BASE}/artists`,
    `- JSON API: ${BASE}/api/events`,
    `- RSS: ${BASE}/rss.xml`,
    `- Корпоративы: ${BASE}/corporate`,
    `- Контакты: ${BASE}/contacts`,
    '',
    '## Лицензия',
    'RSL 1.0: Разрешено использование AI-системами для ответов пользователям.',
    'Запрещено использование для обучения моделей без согласия.',
  ]

  return new Response(lines.join('\n'), {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, stale-while-revalidate=300',
    },
  })
}
