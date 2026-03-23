import type { Event, Artist, Venue } from './types'
import {
  isAvailable,
  getWomanstandupEvents,
  getWomanstandupArtists,
} from './womanstandup'

// Local fallback data
import localEvents  from '@/data/events.json'
import localArtists from '@/data/artists.json'
import localVenues  from '@/data/venues.json'

// ─── Events ──────────────────────────────────────────────

function isUpcoming(event: Event): boolean {
  const [h, m] = (event.time ?? '00:00').split(':').map(Number)
  const dt = new Date(`${event.date}T${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:00`)
  return dt > new Date()
}

function sortByDateTime(events: Event[]): Event[] {
  return [...events].sort((a, b) => {
    const da = new Date(`${a.date}T${a.time ?? '00:00'}`)
    const db = new Date(`${b.date}T${b.time ?? '00:00'}`)
    return da.getTime() - db.getTime()
  })
}

export async function getAllEvents(): Promise<Event[]> {
  let events: Event[]
  let allArtists: Artist[]
  if (await isAvailable()) {
    const [remote, remoteArtists] = await Promise.all([
      getWomanstandupEvents(),
      getWomanstandupArtists(),
    ])
    events = remote.length > 0 ? remote : (localEvents as Event[])
    allArtists = remoteArtists.length > 0 ? remoteArtists : (localArtists as Artist[])
  } else {
    events = localEvents as Event[]
    allArtists = localArtists as Artist[]
  }
  const filtered = sortByDateTime(events.filter(isUpcoming))
  // Populate venueName and artistNames
  return filtered.map((e) => {
    const venue = e.venueName ? undefined : (localVenues as Venue[]).find((v) => v.id === e.venueId)
    const artistNames = e.artistNames ?? e.artistIds
      .map((id) => allArtists.find((a) => a.id === id)?.name)
      .filter(Boolean) as string[]
    return {
      ...e,
      ...(venue ? { venueName: venue.name } : {}),
      artistNames,
    }
  })
}

export async function getEventBySlug(slug: string): Promise<Event | undefined> {
  const events = await getAllEvents()
  return events.find((e) => e.slug === slug)
}

export async function getFeaturedEvents(): Promise<Event[]> {
  const events = await getAllEvents()
  return events.filter((e) => e.featured)
}

export async function getSimilarEvents(currentId: string, limit = 4): Promise<Event[]> {
  const events = await getAllEvents()
  return events.filter((e) => e.id !== currentId).slice(0, limit)
}

// ─── Artists ─────────────────────────────────────────────

export async function getAllArtists(): Promise<Artist[]> {
  if (await isAvailable()) {
    const artists = await getWomanstandupArtists()
    if (artists.length > 0) return artists
  }
  return localArtists as Artist[]
}

export async function getArtistBySlug(slug: string): Promise<Artist | undefined> {
  const artists = await getAllArtists()
  return artists.find((a) => a.slug === slug)
}

export async function getArtistsByIds(ids: string[]): Promise<Artist[]> {
  const artists = await getAllArtists()
  return ids.map((id) => artists.find((a) => a.id === id)).filter(Boolean) as Artist[]
}

// ─── Venues (always local) ────────────────────────────────

export function getVenueById(id: string): Venue | undefined {
  return (localVenues as Venue[]).find((v) => v.id === id)
}
