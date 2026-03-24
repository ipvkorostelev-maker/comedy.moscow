import { promises as fs } from 'fs'
import path from 'path'
import { Event, Artist } from './types'

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

function toSlug(text: string, id: string): string {
  if (!text) return id
  return text
    .toLowerCase()
    .replace(/[а-яё]/g, (c) => RU_MAP[c] ?? c)
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    || id
}

const RU_MAP: Record<string, string> = {
  а:'a',б:'b',в:'v',г:'g',д:'d',е:'e',ё:'yo',ж:'zh',з:'z',и:'i',й:'y',
  к:'k',л:'l',м:'m',н:'n',о:'o',п:'p',р:'r',с:'s',т:'t',у:'u',ф:'f',
  х:'kh',ц:'ts',ч:'ch',ш:'sh',щ:'shch',ъ:'',ы:'y',ь:'',э:'e',ю:'yu',я:'ya',
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
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
    venueName: c.venue || undefined,
    ticketUrl: c.smeshnoTicketUrl || c.ticketUrl || undefined,
    ticketType: c.smeshnoTicketUrl ? 'external' : c.ticketType === 'yandex' ? 'yandex' : 'external',
    yandexWidgetId: c.yandexWidgetId || undefined,
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
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

export async function isAvailable(): Promise<boolean> {
  if (!DATA_PATH) return false
  try {
    await fs.access(path.join(DATA_PATH, 'concerts.json'))
    return true
  } catch {
    return false
  }
}

export async function getWomanstandupEvents(): Promise<Event[]> {
  if (!DATA_PATH) return []
  const raw = await fs.readFile(path.join(DATA_PATH, 'concerts.json'), 'utf-8')
  const concerts = JSON.parse(raw)
  return concerts
    .filter((c: any) => !c.isDraft && Array.isArray(c.siteKeys) && c.siteKeys.includes(SITE_KEY))
    .map(mapConcertToEvent)
}

export async function getWomanstandupArtists(): Promise<Artist[]> {
  if (!DATA_PATH) return []
  const raw = await fs.readFile(path.join(DATA_PATH, 'artists.json'), 'utf-8')
  return JSON.parse(raw).map(mapArtist)
}
