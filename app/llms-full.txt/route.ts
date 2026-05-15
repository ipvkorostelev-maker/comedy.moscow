import { getAllEvents, getAllArtists } from '@/lib/data'
import { minEventPrice, formatDateShort, formatPrice, BASE } from '@/lib/utils'

export const dynamic = 'force-dynamic'

function plainText(html: string): string {
  return html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()
}

export async function GET() {
  const [events, artists] = await Promise.all([getAllEvents(), getAllArtists()])

  const sections: string[] = [
    '# comedy.moscow — Полный контент',
    '',
    `## События (${events.length})`,
  ]

  for (const e of events) {
    const price = minEventPrice(e)
    const desc = plainText(e.longDescription ?? e.description ?? '')
    sections.push(
      '',
      `### ${e.title}`,
      '',
      `- **Дата:** ${formatDateShort(e.date)} ${e.time}`,
      `- **Место:** ${e.venueName ?? e.city ?? '—'}`,
      `- **Город:** ${e.city || 'Москва'}`,
      `- **Длительность:** ${e.duration}`,
      `- **Возраст:** ${e.ageRestriction}`,
      price > 0 ? `- **Цена:** от ${formatPrice(price)}` : '',
      `- **Билеты:** ${BASE}/events/${e.slug}`,
      `- **Теги:** ${e.tags.join(', ')}`,
      '',
      desc,
    )
  }

  sections.push('', `## Артисты (${artists.length})`)

  for (const a of artists) {
    const bio = plainText(a.bio || a.shortBio || '')
    sections.push(
      '',
      `### ${a.name}`,
      '',
      `- **Роль:** ${a.role}`,
      a.city ? `- **Город:** ${a.city}` : '',
      '',
      bio,
    )
  }

  return new Response(sections.join('\n'), {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, stale-while-revalidate=300',
    },
  })
}
