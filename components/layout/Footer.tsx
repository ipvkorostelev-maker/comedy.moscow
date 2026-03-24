import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="border-t border-border mt-20">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-10">

        {/* Top row */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-8">
          <div>
            <p className="text-xs text-muted max-w-[220px] leading-relaxed">
              Лучшие стендап-концерты Москвы
            </p>
          </div>

          <nav className="flex items-center gap-7">
            <Link href="/events" className="text-sm text-muted hover:text-cream transition-colors">
              События
            </Link>
            <Link href="/artists" className="text-sm text-muted hover:text-cream transition-colors">
              Артисты
            </Link>
            <Link href="/contacts" className="text-sm text-muted hover:text-cream transition-colors">
              Контакты
            </Link>
          </nav>

          <p className="text-xs text-cream/50">© 2026 comedy.moscow</p>
        </div>

        {/* Legal */}
        <div className="border-t border-border pt-6 space-y-3">
          <p className="text-[11px] text-cream/50 leading-relaxed">
            ИП Ширяев Афанасий Павлович · ИНН 711404628447 · ОГРНИП 320715400048420
          </p>
          <p className="text-[11px] text-cream/50 leading-relaxed max-w-xl">
            Билеты реализуются через сервисы Яндекс Билеты и intickets. Возврат и обмен — согласно правилам сервисов продажи.
          </p>
          <div className="flex items-center gap-5 pt-1">
            <Link href="/offer" className="text-[11px] text-cream/50 hover:text-muted transition-colors underline underline-offset-2 decoration-muted-2/50">
              Публичная оферта
            </Link>
            <Link href="/privacy" className="text-[11px] text-cream/50 hover:text-muted transition-colors underline underline-offset-2 decoration-muted-2/50">
              Политика конфиденциальности
            </Link>
          </div>
        </div>

      </div>
    </footer>
  )
}
