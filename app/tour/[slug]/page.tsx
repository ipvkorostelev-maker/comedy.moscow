import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import {
  getWomanstandupTours,
  getWomanstandupRawConcerts,
  getWomanstandupArtists,
} from '@/lib/womanstandup'
import { BASE, toSlug, pluralForm } from '@/lib/utils'
import ArtistTourClient, { type TourShow } from '@/app/artist-tour/ArtistTourClient'

export const revalidate = 300

function pluralConcerts(n: number): string {
  const forms = ['концерт', 'концерта', 'концертов']
  return `${n} ${forms[pluralForm(n)]}`
}

function pluralCities(n: number): string {
  const forms = ['город', 'города', 'городов']
  return `${n} ${forms[pluralForm(n)]}`
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
  const [tours, allArtists, rawConcerts] = await Promise.all([
    getWomanstandupTours(),
    getWomanstandupArtists(),
    getWomanstandupRawConcerts(),
  ])
  const tour = tours.find((t) => t.slug === slug)
  if (!tour) return {}

  const artist = allArtists.find((a) => a.id === tour.artistId)
  const artistName = artist?.name ?? ''
  const tourTitle = tour.title || 'стендап-тур'

  const concertMap = new Map(rawConcerts.map((c) => [c.id, c]))
  const tourConcerts = (tour.concertIds ?? [])
    .map((id: string) => concertMap.get(id))
    .filter((c: any) => c && !c.isDraft)

  const cities = [...new Set(tourConcerts.map((c: any) => c.city).filter(Boolean))]
  const citiesCount = cities.length
  const totalConcerts = tourConcerts.length

  const years = tourConcerts
    .map((c: any) => new Date(c.date).getFullYear())
    .filter(Boolean)
  const year =
    years.length > 0
      ? Math.min(...years) === Math.max(...years)
        ? `${Math.min(...years)}`
        : `${Math.min(...years)}–${Math.max(...years)}`
      : ''

  const title = tourTitle.startsWith(artistName)
    ? `${tourTitle} | Билеты на концерты ${year}`
    : `${artistName} — ${tourTitle} | Билеты на концерты ${year}`

  const cityList = cities.slice(0, 4).join(', ')
  const moreText = citiesCount > 4 ? ' и других' : ''
  const description = tourTitle.startsWith(artistName)
    ? `«${tourTitle}». ${pluralConcerts(totalConcerts)}, ${pluralCities(citiesCount)} — ${cityList}${moreText}. Купить билеты онлайн.`
    : `Гастрольный тур ${artistName} «${tourTitle}». ${pluralConcerts(totalConcerts)}, ${pluralCities(citiesCount)} — ${cityList}${moreText}. Купить билеты онлайн.`

  const assetsUrl = process.env.WOMANSTANDUP_ASSETS_URL ?? ''
  const ogImages = tour.photo
    ? [{ url: tour.photo.startsWith('http') ? tour.photo : assetsUrl + tour.photo }]
    : undefined

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      ...(ogImages && { images: ogImages }),
    },
    alternates: {
      canonical: `${BASE}/tour/${slug}`,
    },
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
        year: new Date(c.date ?? "").getFullYear() || undefined,
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
      showPlaque={false}
    />
  )
}
