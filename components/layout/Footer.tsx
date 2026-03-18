import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="border-t border-border mt-20">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-10">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <Link href="/" className="font-serif text-xl font-black text-cream">
              Смеш<em className="text-red not-italic">но</em>
            </Link>
            <p className="text-xs text-muted mt-1.5 max-w-[220px] leading-relaxed">
              Лучшие стендап-концерты Москвы и Санкт-Петербурга
            </p>
          </div>

          <nav className="flex items-center gap-7">
            <Link href="/events" className="text-sm text-muted hover:text-cream transition-colors">
              События
            </Link>
            <Link href="/artists" className="text-sm text-muted hover:text-cream transition-colors">
              Артисты
            </Link>
          </nav>

          <p className="text-xs text-muted-2">© 2025 comedy.moscow</p>
        </div>
      </div>
    </footer>
  )
}
