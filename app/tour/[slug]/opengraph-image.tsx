import { ImageResponse } from 'next/og'
import { getWomanstandupTours, getWomanstandupArtists, getWomanstandupRawConcerts } from '@/lib/womanstandup'
import {
  fetchImageBase64,
  loadFonts,
  OgContainer,
  OgSubtitle,
  OgTitle,
  OG_SIZE,
  OG_CONTENT_TYPE,
} from '@/lib/og'
import { pluralForm } from '@/lib/utils'

export const revalidate = 300
export const alt = 'Тур — comedy.moscow'
export const size = OG_SIZE
export const contentType = OG_CONTENT_TYPE

function pluralConcerts(n: number): string {
  const forms = ['концерт', 'концерта', 'концертов']
  return `${n} ${forms[pluralForm(n)]}`
}

function isPast(dateStr: string, timeStr = '23:59'): boolean {
  return new Date(`${dateStr}T${timeStr}`) < new Date()
}

export default async function Image({ params }: { params: { slug: string } }) {
  const [tours, allArtists, rawConcerts] = await Promise.all([
    getWomanstandupTours(),
    getWomanstandupArtists(),
    getWomanstandupRawConcerts(),
  ])
  const tour = tours.find((t) => t.slug === params.slug)
  if (!tour) return new Response('Not found', { status: 404 })

  const artist = allArtists.find((a) => a.id === tour.artistId)
  const artistName = artist?.name ?? ''

  const concertMap = new Map(rawConcerts.map((c) => [c.id, c]))
  const tourConcerts = (tour.concertIds ?? [])
    .map((id: string) => concertMap.get(id))
    .filter((c: any) => c && !c.isDraft && !isPast(c.date, c.time))

  const cities = [...new Set(tourConcerts.map((c: any) => c.city).filter(Boolean))]
  const years = tourConcerts.map((c: any) => new Date(c.date).getFullYear()).filter(Boolean)
  const year =
    years.length > 0
      ? Math.min(...years) === Math.max(...years)
        ? `${Math.min(...years)}`
        : `${Math.min(...years)}–${Math.max(...years)}`
      : ''

  const assetsUrl = process.env.WOMANSTANDUP_ASSETS_URL ?? ''
  const photoUrl = tour.photo
    ? tour.photo.startsWith('http')
      ? tour.photo
      : assetsUrl + tour.photo
    : undefined

  const [fonts, backgroundImage] = await Promise.all([
    loadFonts(),
    fetchImageBase64(photoUrl || ''),
  ])

  const title = tour.title.startsWith(artistName)
    ? tour.title
    : `${artistName} — ${tour.title}`

  const subtitleParts = []
  if (tourConcerts.length > 0) subtitleParts.push(`${pluralConcerts(tourConcerts.length)} · ${cities.length} городов`)
  if (year) subtitleParts.push(year)
  const subtitle = subtitleParts.join(' · ')

  return new ImageResponse(
    (
      <OgContainer backgroundImage={backgroundImage}>
        <OgTitle>{title}</OgTitle>
        {subtitle && <OgSubtitle>{subtitle}</OgSubtitle>}
      </OgContainer>
    ),
    { ...size, fonts },
  )
}
