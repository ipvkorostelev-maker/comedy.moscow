import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Стендап на корпоратив — заказать комиков на мероприятие',
  description: 'Организация стендап-выступлений на корпоративы и частные мероприятия. Медийные и начинающие комики, готовые шоу под ключ.',
  robots: { index: false, follow: false },
}

const PHONE_GENERAL = '+79067314551'
const PHONE_ALINA = '+79031597317'
const EMAIL = 'River-show@mail.ru'

function ContactButton({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      className="inline-flex items-center gap-3 bg-red hover:bg-red-hover text-white font-bold px-8 py-4 rounded-xl transition-all shadow-red text-base"
    >
      {children}
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M5 12h14M12 5l7 7-7 7"/>
      </svg>
    </a>
  )
}

function PlaceholderImage({ label, aspectClass = 'aspect-[4/3]' }: { label: string; aspectClass?: string }) {
  return (
    <div className={`${aspectClass} bg-surface border border-border rounded-card flex items-center justify-center`}>
      <span className="text-muted text-xs font-mono">{label}</span>
    </div>
  )
}

const PROJECTS = [
  {
    title: 'Большой Девчачий Стендап',
    subtitle: 'Минимум 5 монологов за один вечер и безграничный максимум ваших эмоций',
    description: 'Яркое женское шоу покоряет любимые сердца, в том числе мужские.',
    imageLabel: 'Девчачий Стендап',
  },
  {
    title: 'Ретро Стендап',
    subtitle: 'Юмор с жизненным стажем',
    description: 'На сцене комики 30+ честно и смешно рассказывают о своей боли, взрослении и реальной жизни без фильтров. Если ты помнишь звук модема, дискеты, первые смартфоны, как болит спина и почему выходные стали слишком короткими, то тебе точно сюда.',
    imageLabel: 'Ретро Стендап',
  },
  {
    title: 'Eng. StandUp Show',
    subtitle: 'Шоу на английском языке',
    description: 'We invite you to a special Standup Comedy show. Four comedians from all over the world — United States, France, Jordan and Russia — will be performing on one stage with their best jokes and material in English.',
    imageLabel: 'Eng StandUp',
  },
]

const GALLERY_IMAGES = Array.from({ length: 8 }, (_, i) => ({
  label: `Фото ${i + 1}`,
  w: 600,
  h: i % 3 === 0 ? 800 : 400,
}))

export default function CorporatePage() {
  return (
    <main className="min-h-screen">
      {/* ── HERO ── */}
      <section className="relative pt-24 pb-20 lg:pt-36 lg:pb-28 px-6">
        <div className="max-w-4xl mx-auto">
          <p className="text-[11px] text-red uppercase tracking-[0.25em] mb-5 font-semibold">
            Корпоративы и частные мероприятия
          </p>
          <h1 className="font-serif font-black text-cream text-4xl sm:text-5xl lg:text-7xl uppercase leading-[0.95] mb-6">
            Стендап комики<br />на ваш праздник
          </h1>
          <p className="text-muted text-base lg:text-lg leading-relaxed max-w-2xl mb-8">
            Удивите своих друзей и коллег необычной программой вечера. Шоу Стендап станет большим
            сюрпризом для гостей, а вечер пройдёт не только красиво, но и весело. Мы гарантируем,
            что вы получите отличный результат и удовольствие от проведённого мероприятия.
          </p>
          <ContactButton href={`tel:${PHONE_GENERAL}`}>
            Связаться
          </ContactButton>
        </div>
      </section>

      {/* ── STARS ── */}
      <section className="py-16 lg:py-24 px-6 border-t border-border">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-serif font-black text-cream text-3xl lg:text-4xl uppercase leading-tight mb-5">
            Такие комики как звёзды
          </h2>
          <p className="text-muted text-base lg:text-lg leading-relaxed max-w-2xl">
            У нас есть возможность предоставить вам лучших стендап комиков, участников и резидентов
            известных комедийных проектов, а также готовые шоу под ключ.
          </p>
          <p className="text-muted text-base lg:text-lg leading-relaxed max-w-2xl mt-4">
            Сообщите нам дату и формат мероприятия и мы подберём для вас артиста. Или сообщите имя
            любимого комика и мы узнаем его расписание.
          </p>
        </div>
      </section>

      {/* ── READY PROJECTS ── */}
      <section className="py-16 lg:py-24 px-6 border-t border-border">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-4xl mb-12">
            <p className="text-[11px] text-muted uppercase tracking-[0.2em] mb-3">Готовые проекты</p>
            <h2 className="font-serif font-black text-cream text-3xl lg:text-4xl uppercase leading-tight">
              Шоу под ключ
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {PROJECTS.map((project) => (
              <div
                key={project.title}
                className="bg-surface border border-border rounded-card overflow-hidden group hover:border-muted-2 transition-colors flex flex-col"
              >
                <PlaceholderImage label={project.imageLabel} aspectClass="aspect-[16/10]" />
                <div className="p-6 flex flex-col flex-1">
                  <h3 className="font-serif font-bold text-xl text-cream mb-1">{project.title}</h3>
                  <p className="text-sm text-muted mb-3">{project.subtitle}</p>
                  <p className="text-sm text-muted-2 leading-relaxed flex-1">{project.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SPECIAL OFFER ── */}
      <section className="py-16 lg:py-20 px-6">
        <div className="max-w-3xl mx-auto">
          <div className="relative bg-surface border-2 border-gold rounded-card p-8 lg:p-12">
            <div className="absolute -top-3 left-6 bg-gold text-black text-xs font-bold px-4 py-1 rounded-full uppercase tracking-wider">
              Спецпредложение
            </div>
            <h2 className="font-serif font-black text-cream text-2xl lg:text-3xl uppercase mb-4 mt-2">
              Абонемент в подарок
            </h2>
            <p className="text-muted text-base leading-relaxed mb-6">
              Закажи артистов через нас и получи абонемент на наши шоу.
              Акция действует до конца мая.
            </p>
            <ContactButton href={`tel:${PHONE_GENERAL}`}>
              Заказать
            </ContactButton>
          </div>
        </div>
      </section>

      {/* ── MEDIA COMEDIANS ── */}
      <section className="py-16 lg:py-24 px-6 border-t border-border">
        <div className="max-w-4xl mx-auto">
          <div className="mb-10">
            <p className="text-[11px] text-muted uppercase tracking-[0.2em] mb-3">Для крупных компаний</p>
            <h2 className="font-serif font-black text-cream text-3xl lg:text-4xl uppercase leading-tight mb-5">
              Медийные комики на корпоратив
            </h2>
            <p className="text-muted text-base lg:text-lg leading-relaxed max-w-2xl mb-4">
              Это известные артисты, которых вы видели по ТВ или встречали в любимых шоу в интернете.
              Они популярны, их приглашают на различные шоу, их монологи собирают много просмотров,
              их любят и ждут.
            </p>
            <p className="text-muted text-base lg:text-lg leading-relaxed max-w-2xl">
              Если вы руководитель крупной и сильной компании и хотите сделать большой сюрприз для
              команды, то появление звезды на сцене станет неожиданным поворотом, а само выступление
              навсегда запомнится как яркое событие.
            </p>
          </div>

          <div className="bg-surface border border-border rounded-card p-6 lg:p-8 flex flex-col sm:flex-row items-start sm:items-center gap-5">
            <div className="w-12 h-12 bg-red/10 border border-red/20 rounded-xl flex items-center justify-center flex-shrink-0">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#E8432A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1.27h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.91a16 16 0 0 0 6.06 6.06l.92-.92a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7a2 2 0 0 1 1.72 2.02z"/>
              </svg>
            </div>
            <div>
              <p className="text-sm text-muted mb-1">Медийные комики</p>
              <p className="font-serif font-bold text-cream text-xl">Алина</p>
            </div>
            <a
              href={`tel:${PHONE_ALINA}`}
              className="ml-auto font-bold text-red hover:text-red-hover transition-colors text-lg"
            >
              {PHONE_ALINA.replace(/(\d{1})(\d{3})(\d{3})(\d{2})(\d{2})/, '+$1 $2 $3-$4-$5')}
            </a>
          </div>
        </div>
      </section>

      {/* ── BUDGET OPTION ── */}
      <section className="py-16 lg:py-24 px-6 border-t border-border">
        <div className="max-w-4xl mx-auto">
          <p className="text-[11px] text-muted uppercase tracking-[0.2em] mb-3">Для камерных мероприятий</p>
          <h2 className="font-serif font-black text-cream text-3xl lg:text-4xl uppercase leading-tight mb-5">
            В рамках бюджета
          </h2>
          <p className="text-muted text-base lg:text-lg leading-relaxed max-w-2xl mb-4">
            Для камерных мероприятий с ограниченным бюджетом мы всегда рекомендуем рассмотреть
            менее известных, но не менее талантливых ребят. В кулуарах медийного поля есть
            бриллианты комедии. Это профессионалы своего дела, опытные и очень смешные комики.
          </p>
          <p className="text-muted text-base lg:text-lg leading-relaxed max-w-2xl">
            Если вам важно не имя, а смех и эмоции ваших гостей, то этот вариант для вас!
          </p>
        </div>
      </section>

      {/* ── GALLERY ── */}
      <section className="py-16 lg:py-24 px-6 border-t border-border">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-4xl mb-10">
            <p className="text-[11px] text-muted uppercase tracking-[0.2em] mb-3">Галерея</p>
            <h2 className="font-serif font-black text-cream text-3xl lg:text-4xl uppercase leading-tight">
              Как проходят наши мероприятия
            </h2>
          </div>

          <div className="columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
            {GALLERY_IMAGES.map((img) => (
              <div key={img.label} className="break-inside-avoid">
                <PlaceholderImage label={img.label} aspectClass={img.h > img.w ? 'aspect-[3/4]' : 'aspect-[4/3]'} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CONTACTS ── */}
      <section className="py-16 lg:py-24 px-6 border-t border-border">
        <div className="max-w-2xl mx-auto">
          <div className="mb-10 text-center">
            <p className="text-[11px] text-muted uppercase tracking-[0.2em] mb-3">Контакты</p>
            <h2 className="font-serif font-black text-cream text-3xl lg:text-4xl uppercase leading-tight mb-4">
              Свяжитесь с нами
            </h2>
            <p className="text-muted text-base">
              Обсудим ваше мероприятие, подберём артистов и ответим на все вопросы
            </p>
          </div>

          <div className="flex flex-col gap-4">
            <a
              href={`tel:${PHONE_GENERAL}`}
              className="group flex items-center gap-6 bg-surface border border-border hover:border-muted-2 rounded-2xl px-8 py-7 transition-all duration-300"
            >
              <div className="w-12 h-12 flex-shrink-0 rounded-xl border bg-red/10 border-red/20 flex items-center justify-center">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#E8432A" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1.27h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.91a16 16 0 0 0 6.06 6.06l.92-.92a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7a2 2 0 0 1 1.72 2.02z"/>
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] text-muted uppercase tracking-[0.15em] mb-1">Общие вопросы</p>
                <p className="font-serif font-black text-cream text-2xl">
                  +7 906 731-45-51
                </p>
              </div>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-muted group-hover:text-cream transition-colors flex-shrink-0">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </a>

            <a
              href={`mailto:${EMAIL}`}
              className="group flex items-center gap-6 bg-surface border border-border hover:border-muted-2 rounded-2xl px-8 py-7 transition-all duration-300"
            >
              <div className="w-12 h-12 flex-shrink-0 rounded-xl border bg-blue-500/10 border-blue-400/20 flex items-center justify-center">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#60A5FA" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <rect width="20" height="16" x="2" y="4" rx="2"/>
                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] text-muted uppercase tracking-[0.15em] mb-1">Почта</p>
                <p className="font-serif font-black text-cream text-2xl break-all">
                  {EMAIL}
                </p>
              </div>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-muted group-hover:text-cream transition-colors flex-shrink-0">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </a>
          </div>
        </div>
      </section>

      {/* ── BOTTOM CTA ── */}
      <section className="py-16 lg:py-24 px-6 border-t border-border">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="font-serif font-black text-cream text-3xl lg:text-4xl uppercase leading-tight mb-4">
            Готовы удивить гостей?
          </h2>
          <p className="text-muted text-base mb-8">
            Оставьте заявку и мы подберём идеальный формат под ваш бюджет и дату
          </p>
          <ContactButton href={`tel:${PHONE_GENERAL}`}>
            Связаться
          </ContactButton>
        </div>
      </section>
    </main>
  )
}
