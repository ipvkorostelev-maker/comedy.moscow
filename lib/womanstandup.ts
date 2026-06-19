import { promises as fs } from 'fs'
import path from 'path'
import { Event, Artist } from './types'
import { toSlug, RU_MAP } from './utils'

const DATA_PATH = process.env.WOMANSTANDUP_DATA_PATH
const ASSETS_URL = process.env.WOMANSTANDUP_ASSETS_URL ?? ''
const SITE_KEY = 'smeshno'

function assetUrl(src: string): string {
  if (!src) return ''
  if (src.startsWith('http')) return src
  return ASSETS_URL + src
}

function formatDuration(minutes: number): string {
  if (!minutes) return ''
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return m > 0 ? `${h} ч ${String(m).padStart(2, '0')} мин` : `${h} ч`
}

function mapConcertToEvent(c: any): Event {
  const baseSlug = c.slug || toSlug(c.showTitle, '')
  const slug = baseSlug ? `${baseSlug}-${c.id}` : String(c.id)
  // Priority: smeshno-specific → per-event image → hero (often generic show banner) → horizontal
  const image = assetUrl(c.smeshnoSliderImage || c.image || c.heroImage || c.imageHorizontal || '')
  const gallery = (c.gallery ?? []).map((g: string) => assetUrl(g)).filter(Boolean)
  const price = parseInt(c.price, 10) || 0

  return {
    id: c.id,
    slug,
    title: c.showTitle ?? '',
    subtitle: c.subtitle ?? undefined,
    description: c.shortDescription || c.description?.slice(0, 220) || '',
    longDescription: c.description ?? undefined,
    metaDescription: c.metaDescription || undefined,
    date: c.date ?? '',
    time: c.time ?? '',
    duration: formatDuration(c.duration),
    venueId: toSlug(c.venue ?? '', c.id + '-venue'),
    artistIds: c.artistIds ?? [],
    headlinerId: c.artistIds?.[0] ?? '',
    image,
    gallery,
    tickets: {
      standard: { price, available: true },
      premium: { price: price ? Math.round(price * 1.5) : 0, available: false },
      vip:      { price: price ? Math.round(price * 2.5) : 0, available: false },
    },
    ticketsLeft: 50,
    totalTickets: 200,
    rating: 0,
    reviewsCount: 0,
    reviews: [],
    tags: [],
    category: 'standup',
    ageRestriction: c.age ?? '18+',
    city: c.city ?? '',
    featured: c.isFeatured ?? false,
    isDraft: c.isDraft ?? false,
    venueName: c.venue || undefined,
    ticketUrl: c.smeshnoTicketUrl || c.ticketUrl || undefined,
    ticketType: c.smeshnoTicketUrl ? 'external' : c.ticketType === 'yandex' ? 'yandex' : 'external',
    yandexWidgetId: c.yandexWidgetId || undefined,
    inticketsUrl: c.intiketsUrl || c.inticketsUrl
      || (typeof (c.smeshnoTicketUrl || c.ticketUrl) === 'string' && (c.smeshnoTicketUrl || c.ticketUrl)?.includes('intickets.ru') ? (c.smeshnoTicketUrl || c.ticketUrl) : undefined),
  }
}

function mapArtist(a: any): Artist {
  return {
    id: a.id,
    slug: toSlug(a.name, a.id),
    name: a.name ?? '',
    role: 'Артист',
    shortBio: '',
    bio: '',
    photo: assetUrl(a.photo || ''),
    city: '',
    upcomingEventIds: [],
    totalShows: 0,
    rating: 0,
  }
}

let _availableCache: Promise<boolean> | null = null

export function isAvailable(): Promise<boolean> {
  if (!DATA_PATH) return Promise.resolve(false)
  return (_availableCache ??= fs.access(path.join(DATA_PATH, 'concerts.json')).then(() => true).catch(() => false))
}

// ─── Tours ───────────────────────────────────────────────

export interface WSTour {
  id: string
  artistId: string
  slug: string
  title: string
  concertIds: string[]
  photo?: string
}

export async function getWomanstandupTours(): Promise<WSTour[]> {
  if (!DATA_PATH) return []
  try {
    const raw = await fs.readFile(path.join(DATA_PATH, 'tours.json'), 'utf-8')
    return JSON.parse(raw)
  } catch (err) {
    console.error('Failed to read womanstandup tours:', err)
    return []
  }
}

export interface EnrichedTour {
  id: string
  slug: string
  title: string
  artistId: string
  artistName: string
  photo: string
  totalConcerts: number
  cities: string[]
  nearestDate?: string
}

export async function getEnrichedTours(): Promise<EnrichedTour[]> {
  if (!DATA_PATH) return []
  try {
    const [tours, rawConcerts, artists] = await Promise.all([
      getWomanstandupTours(),
      getWomanstandupRawConcerts(),
      getWomanstandupArtists(),
    ])
    const today = new Date().toISOString().split("T")[0]
    return tours.map(tour => {
      const concerts = rawConcerts.filter((c: any) => tour.concertIds.includes(String(c.id)))
      const artist = artists.find(a => a.id === tour.artistId)
      const cities = [...new Set<string>(concerts.map((c: any) => c.city).filter(Boolean))]
      const upcomingDates = concerts
        .map((c: any) => c.date as string)
        .filter((d: string) => d && d >= today)
        .sort()
      return {
        id: tour.id,
        slug: tour.slug,
        title: tour.title,
        artistId: tour.artistId,
        artistName: artist?.name ?? "",
        photo: assetUrl(tour.photo ?? ""),
        totalConcerts: tour.concertIds.length,
        cities,
        nearestDate: upcomingDates[0],
      }
    })
  } catch (err) {
    console.error('Failed to read womanstandup enriched tours:', err)
    return []
  }
}

export async function getWomanstandupRawConcerts(): Promise<any[]> {
  if (!DATA_PATH) return []
  try {
    const raw = await fs.readFile(path.join(DATA_PATH, 'concerts.json'), 'utf-8')
    return JSON.parse(raw)
  } catch (err) {
    console.error('Failed to read womanstandup raw concerts:', err)
    return []
  }
}


export async function getWomanstandupEvents(): Promise<Event[]> {
  if (!DATA_PATH) return []
  try {
    const raw = await fs.readFile(path.join(DATA_PATH, 'concerts.json'), 'utf-8')
    const concerts = JSON.parse(raw)
    return concerts
      .filter((c: any) => !c.isDraft && Array.isArray(c.siteKeys) && c.siteKeys.includes(SITE_KEY))
      .map(mapConcertToEvent)
  } catch (err) {
    console.error('Failed to read womanstandup concerts:', err)
    return []
  }
}

export async function getWomanstandupArtists(): Promise<Artist[]> {
  if (!DATA_PATH) return []
  try {
    const raw = await fs.readFile(path.join(DATA_PATH, 'artists.json'), 'utf-8')
    return JSON.parse(raw).map(mapArtist)
  } catch (err) {
    console.error('Failed to read womanstandup artists:', err)
    return []
  }
}
