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

          {/* Social links */}
          <div className="flex items-center gap-3">
            <a href="https://vk.com/smeshno" target="_blank" rel="noopener noreferrer" aria-label="ВКонтакте" className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/5 border border-white/8 text-cream/40 hover:text-cream/80 hover:bg-white/8 transition-all">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M15.07 2H8.93C3.33 2 2 3.33 2 8.93v6.14C2 20.67 3.33 22 8.93 22h6.14C20.67 22 22 20.67 22 15.07V8.93C22 3.33 20.67 2 15.07 2zm3.08 13.56h-1.6c-.6 0-.79-.48-1.87-1.58-.94-.93-1.35-.93-1.35 0v1.43c0 .44-.14.58-1.26.58-1.86 0-3.92-1.13-5.37-3.24C5.48 10.3 5 8.24 5 7.82c0-.25.1-.49.58-.49h1.6c.43 0 .6.2.77.67.85 2.44 2.27 4.58 2.86 4.58.22 0 .32-.1.32-.65V9.56c-.07-1.17-.68-1.27-.68-1.69 0-.21.17-.43.45-.43h2.52c.36 0 .49.19.49.62v3.33c0 .36.16.49.27.49.22 0 .4-.13.8-.54 1.24-1.39 2.13-3.52 2.13-3.52.12-.25.32-.49.75-.49h1.6c.48 0 .59.25.48.59-.2.93-2.14 3.66-2.14 3.66-.17.28-.24.4 0 .71.17.23.73.71 1.1 1.14.68.77 1.2 1.42 1.34 1.87.13.44-.1.67-.54.67z"/>
              </svg>
            </a>
            <a href="https://t.me/smeshno" target="_blank" rel="noopener noreferrer" aria-label="Telegram" className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/5 border border-white/8 text-cream/40 hover:text-cream/80 hover:bg-white/8 transition-all">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
              </svg>
            </a>
            <a href="https://www.youtube.com/@smeshno" target="_blank" rel="noopener noreferrer" aria-label="YouTube" className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/5 border border-white/8 text-cream/40 hover:text-cream/80 hover:bg-white/8 transition-all">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
              </svg>
            </a>
          </div>

          <nav className="flex items-center gap-7">
            <Link href="/" className="text-sm text-muted hover:text-cream transition-colors">
              Главная
            </Link>
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

          {/* Ticket refund links */}
          <div>
            <p className="text-[11px] text-cream/50 mb-3">Возврат билетов:</p>
            <div className="flex flex-wrap gap-x-6 gap-y-2">
              <a
                href="https://yandex.ru/support/afisha/ru/theatre-return"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[11px] text-cream/50 hover:text-cream transition-colors underline underline-offset-2 decoration-muted-2/50"
              >
                Яндекс Билеты
              </a>
              <a
                href="https://intickets.ru/refund/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[11px] text-cream/50 hover:text-cream transition-colors underline underline-offset-2 decoration-muted-2/50"
              >
                Intickets
              </a>
              <a
                href="https://support.ticketscloud.com/ru/articles/685400-%D0%B2%D0%BE%D0%B7%D0%B2%D1%80%D0%B0%D1%82-%D0%B1%D0%B8%D0%BB%D0%B5%D1%82%D0%B0-%D0%B4%D0%BB%D1%8F-%D0%B7%D1%80%D0%B8%D1%82%D0%B5%D0%BB%D0%B5%D0%B9"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[11px] text-cream/50 hover:text-cream transition-colors underline underline-offset-2 decoration-muted-2/50"
              >
                Ticketscloud
              </a>
            </div>
          </div>

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
