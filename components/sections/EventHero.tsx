import Image from 'next/image'
import Link from 'next/link'
import type { Event, Artist, Venue } from '@/lib/types'
import { formatDateShort, formatDayOfWeek, formatPrice } from '@/lib/utils'
import EventTickets from './EventTickets'

interface EventHeroProps { event: Event; artists: Artist[]; venue: Venue | undefined; price: number }

export default function EventHero({ event, artists, venue, price }: EventHeroProps) {
  const solo = artists.length === 1 ? artists[0] : undefined
  const prefix = solo && event.title.toLocaleLowerCase('ru').startsWith(solo.name.toLocaleLowerCase('ru'))
  const remainder = prefix ? event.title.slice(solo.name.length) : ''
  const split = !!(prefix && /^[\s.·:—–-]/.test(remainder))
  const heading = split ? solo!.name : event.title
  const program = split ? remainder.replace(/^[\s.·:—–-]+/, '') : ''
  const day = Number(event.date.split('-')[2])
  const month = formatDateShort(event.date).replace(/^\d+\s*/, '')
  const venueName = event.venueName || venue?.name
  return <section className="event-hero" aria-labelledby="event-title">
    <div className="event-visual">
      <div className="event-photo">
        {event.image ? <Image src={event.image} alt={event.title} width={1200} height={800} priority quality={85} sizes="(max-width: 760px) 100vw, 55vw" /> : <div className="event-photo-fallback">СТЕНДАП<span>{event.city}</span></div>}
        {event.ageRestriction && <span className="event-age">{event.ageRestriction}</span>}
      </div>
      {solo && <div className="event-photo-caption"><span>{solo.shortBio || (solo.role !== 'Артист' ? solo.role : solo.name)}</span><Link href={`/artists/${solo.slug}`}>Об артисте ↗</Link></div>}
    </div>
    <div className="event-booking">
      <p className="event-eyebrow"><span />{event.city || 'Москва'} · Стендап</p>
      <h1 id="event-title" className={split ? 'event-title-solo' : ''}><span className="event-artist-heading">{heading}</span>{program && <span className="event-program">{program}</span>}</h1>
      {event.subtitle && <p className="event-subtitle">{event.subtitle}</p>}
      <div className="event-date"><div className="event-date-square"><b>{day}</b><span>{month}</span></div><div><strong>{formatDayOfWeek(event.date)}{event.time && `, ${event.time}`}</strong><p>{formatDateShort(event.date)} {event.date.slice(0, 4)}{event.duration && ` · ${event.duration}`}</p></div></div>
      {venueName && <a className="event-venue-short" href="#venue"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d="M19 10c0 5-7 11-7 11S5 15 5 10a7 7 0 1 1 14 0Z"/><circle cx="12" cy="10" r="2.5"/></svg><span><strong>{venueName}</strong><small>{event.city || venue?.city}</small></span><span className="event-arrow">↗</span></a>}
      <div className="event-checkout" id="event-primary-purchase">
        <div className="event-price">{price > 0 ? <><span>Билеты от</span><strong>{formatPrice(price)}</strong></> : <span>Стоимость у билетного оператора</span>}</div>
        <EventTickets event={event} />
      </div>
    </div>
  </section>
}
