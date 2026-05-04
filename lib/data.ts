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

function toDateTime(date: string, time: string | undefined): Date {
  const t = time ?? '00:00'
  const [h, m] = t.split(':').map(Number)
  return new Date(`${date}T${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:00`)
}

function isUpcoming(event: Event): boolean {
  return toDateTime(event.date, event.time) > new Date()
}

function sortByDateTime(events: Event[]): Event[] {
  return [...events].sort((a, b) =>
    toDateTime(a.date, a.time).getTime() - toDateTime(b.date, b.time).getTime()
  )
}

async function loadEnrichedEvents(): Promise<Event[]> {
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
  return sortByDateTime(events.filter((e) => !e.isDraft)).map((e) => {
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

export async function getAllEvents(): Promise<Event[]> {
  const events = await loadEnrichedEvents()
  return events.filter(isUpcoming)
}

// Returns upcoming + events from the past 30 days (for feeds — past events get available=false).
export async function getEventsForFeed(): Promise<Event[]> {
  const events = await loadEnrichedEvents()
  const cutoff = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
  return events.filter((e) => toDateTime(e.date, e.time) > cutoff)
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
