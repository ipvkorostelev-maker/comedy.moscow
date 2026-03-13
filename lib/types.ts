export interface Venue {
  id: string
  slug: string
  name: string
  address: string
  city: string
  capacity: number
}

export interface Review {
  id: string
  author: string
  avatar: string
  rating: number
  text: string
  date: string
}

export interface TicketTier {
  price: number
  available: boolean
  seats?: number
}

export interface Event {
  id: string
  slug: string
  title: string
  subtitle?: string
  description: string
  longDescription?: string
  date: string
  time: string
  duration: string
  venueId: string
  artistIds: string[]
  headlinerId: string
  image: string
  gallery?: string[]
  tickets: {
    standard: TicketTier
    premium: TicketTier
    vip: TicketTier
  }
  ticketsLeft: number
  totalTickets: number
  rating: number
  reviewsCount: number
  reviews?: Review[]
  tags: string[]
  category: string
  ageRestriction: string
  city: string
  featured: boolean
}

export interface Artist {
  id: string
  slug: string
  name: string
  role: string
  shortBio: string
  bio: string
  photo: string
  city: string
  upcomingEventIds: string[]
  totalShows: number
  rating: number
}
