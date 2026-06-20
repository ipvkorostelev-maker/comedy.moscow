import type { Metadata } from 'next'
import { notFound, redirect } from 'next/navigation'
import { getCities, getEventsByCity } from '@/lib/data'
import { BASE } from '@/lib/utils'
import EventCard from '@/components/cards/EventCard'
import { NavLabelSync } from '@/components/ui/NavLabelProvider'

export const revalidate = 300
export const dynamicParams = true

export async function generateStaticParams() {
  const cities = await getCities()
  return cities.filter((c) => c.slug !== 'moskva').map((c) => ({ slug: c.slug }))
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const { slug } = params
  if (slug === 'moskva') return {}
  const cities = await getCities()
  const city = cities.find((c) => c.slug === slug)
  if (!city) return {}
  const url = `${BASE}/city/${slug}`
  return {
    title: `Стендап концерты — ${city.name}, афиша и билеты`,
    description: `Афиша стендап-концертов — ${city.name}. Расписание, составы комиков. Купить билеты на стендап в ${city.name} онлайн.`,
    alternates: { canonical: url },
    openGraph: {
      type: 'website',
      title: `Стендап концерты — ${city.name}`,
      description: `Афиша стендап-концертов — ${city.name}. Билеты онлайн.`,
      url,
      siteName: 'Смешно',
      locale: 'ru_RU',
    },
  }
}

export default async function CityPage({ params }: { params: { slug: string } }) {
  const { slug } = params
  if (slug === 'moskva') redirect('/')
  const [cities, events] = await Promise.all([
    getCities(),
    getEventsByCity(slug),
  ])
  const city = cities.find((c) => c.slug === slug)
  if (!city) notFound()

  return (
    <>
      <NavLabelSync label={`Стендап ${city.name}`} />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h1 className="font-serif font-black text-cream text-3xl lg:text-4xl mb-2">
          Стендап концерты — {city.name}
        </h1>
        <p className="text-muted text-sm mb-8">
          {events.length} {pluralEvents(events.length)} в {city.name}. Купить билеты онлайн.
        </p>

        {events.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
            {events.map((ev) => (
              <EventCard key={ev.id} event={ev} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-muted text-lg mb-4">Нет запланированных концертов в {city.name}</p>
            <a href="/events" className="text-red text-sm font-semibold hover:brightness-110 transition-all">
              Смотреть все события →
            </a>
          </div>
        )}

        <a href="/events" className="inline-flex items-center gap-2 text-sm text-muted hover:text-cream transition-colors group">
          <span>Все города</span>
          <span className="text-cream/40 group-hover:text-red transition-colors font-semibold">Смотреть →</span>
        </a>
      </main>
    </>
  )
}

function pluralEvents(n: number): string {
  const mod10 = n % 10
  const mod100 = n % 100
  if (mod10 === 1 && mod100 !== 11) return 'концерт'
  if (mod10 >= 2 && mod10 <= 4 && !(mod100 >= 12 && mod100 <= 14)) return 'концерта'
  return 'концертов'
}
