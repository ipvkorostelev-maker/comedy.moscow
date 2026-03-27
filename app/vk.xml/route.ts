import { getAllEvents } from '@/lib/data'
import { minEventPrice, BASE } from '@/lib/utils'

// VK YML limits: ≤15 000 offers, ≤2 params per offer, ≤50 values each
export async function GET() {
  const events = await getAllEvents()

  // Always include a root category; add per-city subcategories
  const cities = [...new Set(events.map((e) => e.city).filter(Boolean))]
  // id=1 is the root "Стендап-концерты"; cities start from id=2
  const cityIndex = new Map(cities.map((city, i) => [city, i + 2]))

  const categoriesXml = [
    '    <category id="1">Стендап-концерты</category>',
    ...cities.map((city, i) =>
      `    <category id="${i + 2}" parentId="1">${x(city)}</category>`
    ),
  ].join('\n')

  const offersXml = events
    .filter((e) => minEventPrice(e) > 0 && e.image)   // VK requires price>0 and picture
    .map((e) => {
      const price = minEventPrice(e)
      const catId = cityIndex.get(e.city) ?? 1          // fallback to root category
      const available = e.ticketsLeft > 0 ? 'true' : 'false'
      const url = `${BASE}/events/${e.slug}`

      // Up to 2 params per VK spec
      const paramLines: string[] = []
      if (e.city)  paramLines.push(`      <param name="Город">${x(e.city)}</param>`)
      if (e.date)  paramLines.push(`      <param name="Дата">${e.date}</param>`)

      return [
        `    <offer id="${e.id}" available="${available}">`,
        `      <url>${x(url)}</url>`,
        `      <price>${price}</price>`,
        `      <currencyId>RUB</currencyId>`,
        `      <categoryId>${catId}</categoryId>`,
        `      <picture>${x(e.image)}</picture>`,
        `      <name>${x(e.title)}</name>`,
        `      <description>${x(e.description)}</description>`,
        ...paramLines,
        `    </offer>`,
      ].join('\n')
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

/** Escape XML special chars */
function x(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}
