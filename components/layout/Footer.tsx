import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="border-t border-border mt-24">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <Link href="/" className="font-serif text-lg font-black text-cream">
            Смеш<em className="text-red not-italic">но</em>
          </Link>

          <nav className="flex items-center gap-6">
            <Link href="/events" className="text-xs text-muted hover:text-cream transition-colors">
              События
            </Link>
            <Link href="/artists" className="text-xs text-muted hover:text-cream transition-colors">
              Артисты
            </Link>
          </nav>

          <p className="text-xs text-muted-2">© 2025 Смешно</p>
        </div>
      </div>
    </footer>
  )
}
