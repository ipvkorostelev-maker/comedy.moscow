import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-6 text-center">
      <p className="text-[10px] font-bold uppercase tracking-widest text-red mb-4">404</p>
      <h1 className="font-serif font-black text-4xl lg:text-5xl text-cream mb-4 leading-tight">
        Страница не найдена
      </h1>
      <p className="text-cream/50 text-sm mb-8 max-w-sm">
        Возможно, концерт уже прошёл или адрес изменился.
      </p>
      <div className="flex gap-3">
        <Link
          href="/"
          className="inline-flex items-center gap-2 bg-red hover:bg-red-hover text-white text-sm font-bold px-6 py-3 rounded-xl transition-all"
        >
          На главную
        </Link>
        <Link
          href="/events"
          className="inline-flex items-center gap-2 bg-white/10 border border-white/15 text-cream text-sm font-medium px-6 py-3 rounded-xl hover:bg-white/15 transition-all"
        >
          Все концерты
        </Link>
      </div>
    </div>
  )
}
