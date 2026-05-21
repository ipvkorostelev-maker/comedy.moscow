import type { Metadata } from 'next'
import ArtistTourClient, { type TourShow } from './ArtistTourClient'

export const metadata: Metadata = {
  robots: { index: false, follow: false },
}

const DEMO_SHOWS: TourShow[] = [
  { id: 1, city: 'Сочи',           venue: 'Victory Hotels',          date: '20.05', year: 2026, href: '#', isPrivate: true,  posterImage: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=900&q=90&fit=crop' },
  { id: 2, city: 'Калининград',    venue: 'Клуб Вагонка',            date: '29.05', year: 2026, href: '#', isPrivate: false, isNearest: true, posterImage: 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=900&q=90&fit=crop' },
  { id: 3, city: 'Москва',         venue: 'Petter',                  date: '31.05', year: 2026, href: '#', isPrivate: false, isSoldOut: true, posterImage: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=900&q=90&fit=crop' },
  { id: 4, city: 'Москва',         venue: 'Petter',                  date: '02.06', year: 2026, href: '#', isPrivate: false, posterImage: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=900&q=90&fit=crop' },
  { id: 5, city: 'Москва',         venue: 'Зелёный театр ВДНХ',     date: '26.07', year: 2026, href: '#', isPrivate: false, posterImage: 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=900&q=90&fit=crop' },
  { id: 6, city: 'Санкт-Петербург', venue: 'Roof Place',             date: '08.08', year: 2026, href: '#', isPrivate: false, posterImage: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=900&q=90&fit=crop' },
  { id: 7, city: 'Belek',          venue: 'Dobedan Exclusive hotel', date: '25.08', year: 2026, href: '#', isPrivate: true,  posterImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=900&q=90&fit=crop' },
  { id: 8, city: 'Kemer',          venue: 'Dobedan World Palace',    date: '26.08', year: 2026, href: '#', isPrivate: true,  posterImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=900&q=90&fit=crop' },
  { id: 9, city: 'Краснодар',      venue: 'Кроп Арена',             date: '10.10', year: 2026, href: '#', isPrivate: false, posterImage: 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=900&q=90&fit=crop' },
  { id: 10, city: 'Ростов-на-Дону', venue: 'Кроп Арена',            date: '11.10', year: 2026, href: '#', isPrivate: false, posterImage: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=900&q=90&fit=crop' },
  { id: 11, city: 'Новосибирск',   venue: 'Арт-пространство «Бункер»', date: '25.10', year: 2026, href: '#', isPrivate: false, posterImage: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=900&q=90&fit=crop' },
]

export default function ArtistTourPage() {
  return (
    <ArtistTourClient
      artistName="Амир Гурбанов"
      tourLabel="стендап-тур"
      shows={DEMO_SHOWS}
    />
  )
}
