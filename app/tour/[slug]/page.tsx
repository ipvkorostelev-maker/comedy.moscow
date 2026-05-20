import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import {
  getWomanstandupTours,
  getWomanstandupRawConcerts,
  getWomanstandupArtists,
} from '@/lib/womanstandup'
import ArtistTourClient, { type TourShow } from '@/app/artist-tour/ArtistTourClient'

export const revalidate = 300

// ── Slug helpers (same logic as womanstandup.ts) ──────────────────────────────

const RU_MAP: Record<string, string> = {
  а:'a',б:'b',в:'v',г:'g',д:'d',е:'e',ё:'yo',ж:'zh',з:'z',и:'i',й:'y',
  к:'k',л:'l',м:'m',н:'n',о:'o',п:'p',р:'r',с:'s',т:'t',у:'u',ф:'f',
  х:'kh',ц:'ts',ч:'ch',ш:'sh',щ:'shch',ъ:'',ы:'y',ь:'',э:'e',ю:'yu',я:'ya',
}

function toSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[а-яё]/g, (c) => RU_MAP[c] ?? c)
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

function cmEventSlug(showTitle: string, id: string): string {
  const base = toSlug(showTitle)
  return base ? `${base}-${id}` : id
}

function formatDisplayDate(dateStr: string): string {
  const parts = dateStr.split('-')
  if (parts.length < 3) return dateStr
  return `${parts[2]}.${parts[1]}`
}

function isPast(dateStr: string, timeStr = '23:59'): boolean {
  return new Date(`${dateStr}T${timeStr}`) < new Date()
}

// ── Page ───────────────────────────────────────────────────────────────────────

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const [tours, allArtists] = await Promise.all([
    getWomanstandupTours(),
    getWomanstandupArtists(),
  ])
  const tour = tours.find((t) => t.slug === slug)
  if (!tour) return {}
  const artist = allArtists.find((a) => a.id === tour.artistId)
  const title = tour.title
    ? `${tour.title} — ${artist?.name ?? ''}`
    : `${artist?.name ?? ''} — стендап-тур`
  return {
    title,
    description: `Расписание концертов ${artist?.name ?? ''} по городам. Купить билеты онлайн.`,
  }
}

export default async function TourPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params

  const [tours, allArtists, rawConcerts] = await Promise.all([
    getWomanstandupTours(),
    getWomanstandupArtists(),
    getWomanstandupRawConcerts(),
  ])

  const tour = tours.find((t) => t.slug === slug)
  if (!tour) notFound()

  const artist = allArtists.find((a) => a.id === tour.artistId)

  // Map raw concerts to TourShow, preserving concertIds order then sorting by date
  const concertMap = new Map(rawConcerts.map((c) => [c.id, c]))

  const shows: TourShow[] = (tour.concertIds ?? [])
    .map((id: string) => concertMap.get(id))
    .filter((c: any) => c && !c.isDraft)
    .sort((a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .map((c: any, i: number, arr: any[]) => {
      const past = isPast(c.date, c.time)
      const isSmeshno = Array.isArray(c.siteKeys) && c.siteKeys.includes('smeshno')

      // Link: comedy.moscow event page if smeshno, else womanstandup
      let href = '#'
      if (!past) {
        if (isSmeshno) {
          href = `/events/${cmEventSlug(c.showTitle ?? '', c.id)}`
        } else {
          const wsBase = c.slug || toSlug(c.showTitle ?? '')
          const wsSlug = wsBase ? `${wsBase}-${c.id}` : c.id
          href = `https://womanstandup.ru/concerts/${wsSlug}`
        }
      }

      // Mark the nearest upcoming concert
      const nearestIdx = arr.findIndex((x: any) => !isPast(x.date, x.time))
      const isNearest = !past && i === nearestIdx

      const posterImage = c.smeshnoSliderImage || c.imageHorizontal || c.image || c.heroImage || ''
      const assetsUrl = process.env.WOMANSTANDUP_ASSETS_URL ?? ''
      const imageUrl = posterImage.startsWith('http') ? posterImage : assetsUrl + posterImage

      return {
        id: c.id,
        city: c.city ?? '',
        venue: c.venue ?? '',
        date: formatDisplayDate(c.date ?? ''),
        href,
        isPrivate: false,
        isSoldOut: past,
        isNearest,
        posterImage: imageUrl,
      } satisfies TourShow
    })

  const assetsUrl = process.env.WOMANSTANDUP_ASSETS_URL ?? ''
  const tourPhoto = tour.photo
    ? (tour.photo.startsWith('http') ? tour.photo : assetsUrl + tour.photo)
    : undefined

  return (
    <ArtistTourClient
      artistName={artist?.name ?? 'Артист'}
      tourLabel={tour.title || 'стендап-тур'}
      artistPhoto={tourPhoto}
      shows={shows}
    />
  )
}
