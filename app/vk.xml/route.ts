import { getAllEvents } from '@/lib/data'
import { minEventPrice, BASE } from '@/lib/utils'

export async function GET() {
  const events = await getAllEvents()

  // Build unique city categories
  const cities = [...new Set(events.map((e) => e.city).filter(Boolean))]
  const cityIndex = new Map(cities.map((city, i) => [city, i + 1]))

  const categoriesXml = cities
    .map((city, i) => `    <category id="${i + 1}">${city}</category>`)
    .join('\n')

  const offersXml = events
    .map((e) => {
      const price = minEventPrice(e)
      const url = `${BASE}/events/${e.slug}`
      const available = e.ticketsLeft > 0 ? 'true' : 'false'
      const catId = cityIndex.get(e.city)
      const catTag = catId ? `\n      <categoryId>${catId}</categoryId>` : ''

      // Up to 2 params per VK spec
      const params = [
        e.city ? `      <param name="Город">${escXml(e.city)}</param>` : '',
        e.date ? `      <param name="Дата">${e.date}</param>` : '',
      ].filter(Boolean).join('\n')

      return `    <offer id="${e.id}" available="${available}">
      <url><![CDATA[${url}]]></url>
      <price>${price}</price>
      <currencyId>RUB</currencyId>${catTag}
      <name><![CDATA[${e.title}]]></name>
      <description><![CDATA[${e.description}]]></description>
      ${e.image ? `<picture><![CDATA[${e.image}]]></picture>` : ''}
${params}
    </offer>`
    })
    .join('\n')

  const date = new Date().toISOString().slice(0, 16).replace('T', ' ')

  const xml = `<?xml version="1.0" encoding="utf-8"?>
<yml_catalog date="${date}">
  <shop>
    <name>Смешно</name>
    <company>comedy.moscow</company>
    <url>${BASE}</url>
    <currencies>
      <currency id="RUB" rate="1"/>
    </currencies>
    <categories>
${categoriesXml}
    </categories>
    <offers>
${offersXml}
    </offers>
  </shop>
</yml_catalog>`

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  })
}

function escXml(str: string): string {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}
