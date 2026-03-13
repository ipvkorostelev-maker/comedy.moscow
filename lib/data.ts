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

export async function getAllEvents(): Promise<Event[]> {
  if (await isAvailable()) {
    const events = await getWomanstandupEvents()
    if (events.length > 0) return events
  }
  return localEvents as Event[]
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
