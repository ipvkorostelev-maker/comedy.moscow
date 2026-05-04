import { getEventsForFeed } from '@/lib/data'
import { minEventPrice, formatDateShort, BASE } from '@/lib/utils'

export const dynamic = 'force-dynamic'

export async function GET() {
  const now = new Date()
  const events = await getEventsForFeed()

  const offers = events
    .map((e) => {
      const price = minEventPrice(e)
      const url = `${BASE}/events/${e.slug}`
      const salesNotes = [
        e.ageRestriction ? `${e.ageRestriction}+` : '',
        e.duration ? `Продолжительность: ${e.duration}` : '',
      ].filter(Boolean).join('. ')
      const t = e.time ?? '00:00'
      const eventTime = new Date(`${e.date}T${t.length === 5 ? t : '00:00'}:00`)
      const available = eventTime > now ? 'true' : 'false'

      return `
    <offer id="${e.id}" available="${available}">
      <url><![CDATA[${url}]]></url>
      <price>${price}</price>
      <currencyId>RUR</currencyId>
      <categoryId>1</categoryId>
      <picture><![CDATA[${e.image}]]></picture>
      <name><![CDATA[${e.title} — ${formatDateShort(e.date)}, ${e.city || 'Москва'}]]></name>
      <description><![CDATA[${e.description ?? e.subtitle ?? e.title}]]></description>
      ${e.venueName ? `<param name="Место"><![CDATA[${e.venueName}]]></param>` : ''}
      ${e.city ? `<param name="Город"><![CDATA[${e.city}]]></param>` : ''}
      <param name="Дата"><![CDATA[${e.date}]]></param>
      <param name="Время"><![CDATA[${e.time}]]></param>
      ${e.ageRestriction ? `<param name="Возраст">${e.ageRestriction}+</param>` : ''}
      ${e.duration ? `<param name="Продолжительность"><![CDATA[${e.duration}]]></param>` : ''}
      ${salesNotes ? `<sales_notes><![CDATA[${salesNotes}]]></sales_notes>` : ''}
      ${e.tags?.map((t) => `<param name="Жанр"><![CDATA[${t}]]></param>`).join('\n      ') ?? ''}
    </offer>`
    })
    .join('')

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE yml_catalog SYSTEM "shops.dtd">
<yml_catalog date="${new Date().toISOString().slice(0, 16).replace('T', ' ')}">
  <shop>
    <name>Смешно</name>
    <company>comedy.moscow</company>
    <url>${BASE}</url>
    <currencies>
      <currency id="RUR" rate="1"/>
    </currencies>
    <categories>
      <category id="1">Стендап-концерты</category>
    </categories>
    <offers>${offers}
    </offers>
  </shop>
</yml_catalog>`

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=300, stale-while-revalidate=60',
    },
  })
}
