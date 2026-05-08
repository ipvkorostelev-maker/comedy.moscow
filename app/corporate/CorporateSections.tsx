'use client'

import dynamic from 'next/dynamic'
import { motion } from 'framer-motion'

const ArtistGrid = dynamic(() => import('@/components/sections/ArtistGrid'), { ssr: false })

const PHONE_GENERAL = '+79067314551'
const PHONE_ALINA = '+79031597317'
const EMAIL = 'River-show@mail.ru'

function Section({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className={className}
    >
      {children}
    </motion.section>
  )
}

function PlaceholderImage({ label, aspectClass = 'aspect-[4/3]' }: { label: string; aspectClass?: string }) {
  return (
    <div className={`${aspectClass} bg-surface border border-border rounded-card flex items-center justify-center`}>
      <span className="text-muted text-xs font-mono">{label}</span>
    </div>
  )
}

const SHOWS = [
  {
    title: 'Большой Девчачий Стендап',
    subtitle: 'Минимум 5 монологов за один вечер и безграничный максимум ваших эмоций',
    desc: 'Яркое женское шоу покоряет любимые сердца, в том числе мужские.',
    label: 'Девчачий Стендап',
  },
  {
    title: 'Ретро Стендап',
    subtitle: 'Юмор с жизненным стажем',
    desc: 'На сцене комики 30+ честно и смешно рассказывают о своей боли, взрослении и реальной жизни без фильтров. Если ты помнишь звук модема, дискеты, первые смартфоны, как болит спина и почему выходные стали слишком короткими, то тебе точно сюда.',
    label: 'Ретро Стендап',
  },
  {
    title: 'Eng. StandUp Show',
    subtitle: 'Шоу на английском языке',
    desc: 'We invite you to a special Standup Comedy show. Four comedians from all over the world — United States, France, Jordan and Russia — will be performing on one stage with their best jokes and material in English.',
    label: 'Eng StandUp',
  },
]

const GALLERY = Array.from({ length: 8 }, (_, i) => ({
  label: `Фото ${i + 1}`,
  tall: i % 3 === 0,
}))

export default function CorporateSections() {
  return (
    <>
      {/* ── STARS ── */}
      <Section className="py-20 lg:py-28 px-6 border-t border-border">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col lg:flex-row lg:items-start gap-10 lg:gap-16">
            <div className="lg:w-1/2">
              <p className="text-[11px] text-red uppercase tracking-[0.25em] mb-4 font-semibold">
                Кто выступает
              </p>
              <h2 className="font-serif font-black text-cream text-3xl lg:text-5xl uppercase leading-[1.05] mb-5">
                Такие комики как звёзды
              </h2>
            </div>
            <div className="lg:w-1/2">
              <p className="text-muted text-base lg:text-lg leading-relaxed mb-4">
                У нас есть возможность предоставить вам лучших стендап комиков, участников и резидентов
                известных комедийных проектов, а также готовые шоу под ключ.
              </p>
              <p className="text-muted text-base lg:text-lg leading-relaxed">
                Сообщите нам дату и формат мероприятия — и мы подберём для вас артиста. Или сообщите
                имя любимого комика, и мы узнаем его расписание.
              </p>
            </div>
          </div>
        </div>
      </Section>

      {/* ── ARTISTS ── */}
      <ArtistGrid />

      {/* ── READY SHOWS ── */}
      <Section className="py-20 lg:py-28 px-6 border-t border-border">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-4xl mb-14">
            <p className="text-[11px] text-muted uppercase tracking-[0.2em] mb-3">Готовые проекты</p>
            <h2 className="font-serif font-black text-cream text-3xl lg:text-5xl uppercase leading-tight">
              Шоу под ключ
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {SHOWS.map((show, i) => (
              <motion.div
                key={show.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.12 }}
                className="bg-surface border border-border rounded-card overflow-hidden group hover:border-muted-2 transition-colors flex flex-col"
              >
                <PlaceholderImage label={show.label} aspectClass="aspect-[16/10]" />
                <div className="p-6 flex flex-col flex-1">
                  <h3 className="font-serif font-bold text-xl text-cream mb-1">{show.title}</h3>
                  <p className="text-sm text-muted mb-3">{show.subtitle}</p>
                  <p className="text-sm text-muted-2 leading-relaxed flex-1">{show.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="mt-10 text-center">
            <a
              href="tel:+79067314551"
              className="inline-flex items-center gap-2 bg-red hover:bg-red-hover text-white font-bold px-8 py-4 rounded-xl transition-all shadow-red text-base"
            >
              Связаться
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </a>
          </div>
        </div>
      </Section>

      {/* ── SPECIAL OFFER ── */}
      <Section className="py-16 lg:py-20 px-6">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="relative bg-surface border-2 border-gold rounded-card p-8 lg:p-12 text-center"
          >
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gold text-black text-xs font-bold px-5 py-1.5 rounded-full uppercase tracking-wider whitespace-nowrap">
              Спецпредложение
            </div>
            <h2 className="font-serif font-black text-cream text-2xl lg:text-3xl uppercase mb-4 mt-3">
              Абонемент в подарок
            </h2>
            <p className="text-muted text-base leading-relaxed mb-6 max-w-md mx-auto">
              Закажи артистов через нас и получи абонемент на наши шоу.
              Акция действует до конца мая.
            </p>
            <a
              href="tel:+79067314551"
              className="inline-flex items-center gap-2 bg-gold hover:bg-gold/90 text-black font-bold px-8 py-4 rounded-xl transition-all text-base"
            >
              Заказать
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </a>
          </motion.div>
        </div>
      </Section>

      {/* ── MEDIA COMEDIANS ── */}
      <Section className="py-20 lg:py-28 px-6 border-t border-border">
        <div className="max-w-4xl mx-auto">
          <div className="mb-10">
            <p className="text-[11px] text-muted uppercase tracking-[0.2em] mb-3">Для крупных компаний</p>
            <h2 className="font-serif font-black text-cream text-3xl lg:text-5xl uppercase leading-tight mb-5">
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
              className="sm:ml-auto font-bold text-red hover:text-red-hover transition-colors text-lg lg:text-xl"
            >
              +7 903 159-73-17
            </a>
          </div>
        </div>
      </Section>

      {/* ── BUDGET ── */}
      <Section className="py-20 lg:py-28 px-6 border-t border-border">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col lg:flex-row lg:items-start gap-10 lg:gap-16">
            <div className="lg:w-1/2">
              <p className="text-[11px] text-muted uppercase tracking-[0.2em] mb-4">Для камерных мероприятий</p>
              <h2 className="font-serif font-black text-cream text-3xl lg:text-5xl uppercase leading-[1.05] mb-5">
                В рамках бюджета
              </h2>
            </div>
            <div className="lg:w-1/2">
              <p className="text-muted text-base lg:text-lg leading-relaxed mb-4">
                Для камерных мероприятий с ограниченным бюджетом мы всегда рекомендуем рассмотреть
                менее известных, но не менее талантливых ребят. В кулуарах медийного поля есть
                бриллианты комедии. Это профессионалы своего дела, опытные и очень смешные комики.
              </p>
              <p className="text-cream/80 text-base lg:text-lg leading-relaxed font-medium">
                Если вам важно не имя, а смех и эмоции ваших гостей — этот вариант для вас!
              </p>
            </div>
          </div>
        </div>
      </Section>

      {/* ── GALLERY ── */}
      <Section className="py-20 lg:py-28 px-6 border-t border-border">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-4xl mb-12">
            <p className="text-[11px] text-muted uppercase tracking-[0.2em] mb-3">Галерея</p>
            <h2 className="font-serif font-black text-cream text-3xl lg:text-5xl uppercase leading-tight">
              Как проходят наши мероприятия
            </h2>
          </div>

          <div className="columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
            {GALLERY.map((img, i) => (
              <motion.div
                key={img.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="break-inside-avoid"
              >
                <PlaceholderImage label={img.label} aspectClass={img.tall ? 'aspect-[3/4]' : 'aspect-[4/3]'} />
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      {/* ── CONTACTS ── */}
      <Section className="py-20 lg:py-28 px-6 border-t border-border">
        <div className="max-w-2xl mx-auto">
          <div className="mb-10 text-center">
            <p className="text-[11px] text-muted uppercase tracking-[0.2em] mb-3">Контакты</p>
            <h2 className="font-serif font-black text-cream text-3xl lg:text-5xl uppercase leading-tight mb-4">
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
                <p className="font-serif font-black text-cream text-2xl">+7 906 731-45-51</p>
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
                <p className="font-serif font-black text-cream text-2xl break-all">{EMAIL}</p>
              </div>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-muted group-hover:text-cream transition-colors flex-shrink-0">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </a>
          </div>
        </div>
      </Section>

      {/* ── BOTTOM CTA ── */}
      <Section className="py-24 lg:py-32 px-6 border-t border-border">
        <div className="max-w-2xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="font-serif font-black text-cream text-3xl lg:text-5xl uppercase leading-tight mb-5">
              Готовы удивить гостей?
            </h2>
            <p className="text-muted text-base lg:text-lg mb-10">
              Оставьте заявку, и мы подберём идеальный формат под ваш бюджет и дату
            </p>
            <a
              href="tel:+79067314551"
              className="inline-flex items-center gap-3 bg-red hover:bg-red-hover text-white font-bold px-10 py-5 rounded-xl transition-all shadow-red text-lg"
            >
              Обсудить мероприятие
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </a>
          </motion.div>
        </div>
      </Section>
    </>
  )
}
