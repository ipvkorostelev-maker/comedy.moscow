import { getAllEvents } from '@/lib/data'

const BASE = 'https://comedy.moscow'

export async function GET() {
  const events = await getAllEvents()

  const items = events
    .map((event) => {
      const url = `${BASE}/events/${event.slug}`
      const pubDate = new Date(`${event.date}T${event.time ?? '00:00'}:00+03:00`).toUTCString()
      const description = [
        event.description,
        event.venueName ? `Место: ${event.venueName}` : '',
        event.city ? `Город: ${event.city}` : '',
      ].filter(Boolean).join(' | ')

      return `
    <item>
      <title><![CDATA[${event.title}]]></title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <pubDate>${pubDate}</pubDate>
      <description><![CDATA[${description}]]></description>
      ${event.image ? `<enclosure url="${event.image}" type="image/jpeg" length="0" />` : ''}
      ${event.tags?.map((t) => `<category><![CDATA[${t}]]></category>`).join('\n      ') ?? ''}
    </item>`
    })
    .join('')

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Стендап концерты в Москве — comedy.moscow</title>
    <link>${BASE}</link>
    <description>Афиша стендап концертов в Москве. Расписание, составы комиков, билеты.</description>
    <language>ru</language>
    <atom:link href="${BASE}/rss.xml" rel="self" type="application/rss+xml" />
    <image>
      <url>${BASE}/logo.png</url>
      <title>comedy.moscow</title>
      <link>${BASE}</link>
    </image>
    ${items}
  </channel>
</rss>`

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  })
}
