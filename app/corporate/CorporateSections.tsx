'use client'

import { useState, useEffect, useCallback } from 'react'
import dynamic from 'next/dynamic'
import { motion } from 'framer-motion'
import Image from 'next/image'

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
    image: 'https://static.tildacdn.com/tild3164-3330-4132-b635-383937633263/woman.jpg',
  },
  {
    title: 'Ретро Стендап',
    subtitle: 'Юмор с жизненным стажем',
    desc: 'На сцене комики 30+ честно и смешно рассказывают о своей боли, взрослении и реальной жизни без фильтров. Если ты помнишь звук модема, дискеты, первые смартфоны, как болит спина и почему выходные стали слишком короткими, то тебе точно сюда.',
    image: 'https://static.tildacdn.com/tild6236-3935-4836-b933-623264393463/retro.jpg',
  },
  {
    title: 'Eng. StandUp Show',
    subtitle: 'Шоу на английском языке',
    desc: 'We invite you to a special Standup Comedy show. Four comedians from all over the world — United States, France, Jordan and Russia — will be performing on one stage with their best jokes and material in English.',
    image: 'https://static.tildacdn.com/tild6339-3833-4635-b833-613862356230/eng.jpg',
  },
]

const GALLERY_IMAGES = [
  { src: 'https://static.tildacdn.com/tild6530-3265-4662-a165-353330396166/IMG_6848_1.png', vertical: false },
  { src: 'https://static.tildacdn.com/tild3833-3536-4637-b237-316237386264/IMG_6844.png', vertical: true },
  { src: 'https://static.tildacdn.com/tild6439-3064-4262-a266-623862323964/IMG_6840.png', vertical: true },
  { src: 'https://static.tildacdn.com/tild3835-6337-4663-a138-306132316538/IMG_6849_1.png', vertical: false },
  { src: 'https://static.tildacdn.com/tild3236-6239-4337-a534-633863643631/IMG_6838.png', vertical: true },
  { src: 'https://static.tildacdn.com/tild6163-3838-4366-b561-396164346232/IMG_6835.png', vertical: true },
  { src: 'https://static.tildacdn.com/tild3438-3435-4539-a638-323439666632/IMG_6833.png', vertical: false },
  { src: 'https://static.tildacdn.com/tild3961-3164-4339-b763-643832663837/IMG_6837.png', vertical: true },
  { src: 'https://static.tildacdn.com/tild6166-3262-4934-a139-633463663133/IMG_6836_2.png', vertical: true },
  { src: 'https://static.tildacdn.com/tild3736-3165-4661-a162-653235653632/IMG_6834.png', vertical: true },
  { src: 'https://static.tildacdn.com/tild3238-3434-4239-a138-616166373135/IMG_6832.png', vertical: false },
  { src: 'https://static.tildacdn.com/tild6562-3632-4237-b162-613264633538/IMG_6831.png', vertical: true },
  { src: 'https://static.tildacdn.com/tild6166-3739-4362-b936-613433663565/IMG_6830.png', vertical: true },
  { src: 'https://static.tildacdn.com/tild6130-6230-4333-b133-666364306333/IMG_6264.jpg', vertical: true },
  { src: 'https://static.tildacdn.com/tild3336-3936-4963-b436-646531366432/IMG_5614.jpg', vertical: true },
  { src: 'https://static.tildacdn.com/tild6238-6539-4334-a537-376663303434/IMG_5598.jpg', vertical: true },
  { src: 'https://static.tildacdn.com/tild3336-3530-4332-a465-316465626636/IMG_5319.jpg', vertical: true },
]

// ── Image URLs ──
const STARS_IMAGE = 'https://static.tildacdn.com/tild3136-6237-4633-b864-616637343930/IMG_6850.PNG'
const MEDIA_IMAGE_1 = 'https://static.tildacdn.com/tild6534-3737-4239-b462-356365346365/_21.jpg'
const MEDIA_IMAGE_2 = 'https://static.tildacdn.com/tild3037-3430-4934-b734-366235653732/IMG_6841.PNG'
const BUDGET_IMAGE = 'https://static.tildacdn.com/tild6663-3562-4562-a231-386135663966/IMG_6827.PNG'

export default function CorporateSections() {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)
  const closeLightbox = useCallback(() => setLightboxIndex(null), [])
  const prevImage = useCallback(() => setLightboxIndex(i => i === null ? null : (i - 1 + GALLERY_IMAGES.length) % GALLERY_IMAGES.length), [])
  const nextImage = useCallback(() => setLightboxIndex(i => i === null ? null : (i + 1) % GALLERY_IMAGES.length), [])

  useEffect(() => {
    if (lightboxIndex === null) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeLightbox()
      if (e.key === 'ArrowLeft') prevImage()
      if (e.key === 'ArrowRight') nextImage()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [lightboxIndex, closeLightbox, prevImage, nextImage])

  useEffect(() => {
    document.body.style.overflow = lightboxIndex !== null ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [lightboxIndex])

  return (
    <>
      {/* ── STARS ── */}
      <Section className="border-t border-border">
        <div className="relative min-h-[580px] lg:min-h-[700px] flex items-center justify-center overflow-hidden">
          <Image
            src={STARS_IMAGE}
            alt="Стендап комики — звёзды"
            fill
            className="object-cover [object-position:calc(50%_-_80px)_center] lg:[object-position:center_center]"
            sizes="100vw"
            priority={false}
          />
          <div className="absolute inset-0 bg-black/65" />
          <div className="relative z-10 w-full px-6 py-16 lg:py-20">
            <div className="max-w-3xl mx-auto text-center">
              <p className="text-[11px] text-red uppercase tracking-[0.25em] mb-4 font-semibold">
                Кто выступает
              </p>
              <h2 className="font-serif font-black text-cream text-3xl lg:text-5xl uppercase leading-snug mb-5">
                Такие комики как звёзды
              </h2>
              <p className="text-cream/70 text-sm lg:text-lg leading-relaxed max-w-2xl mx-auto mb-4">
                У нас есть возможность предоставить вам лучших стендап комиков, участников и резидентов
                известных комедийных проектов, а также готовые шоу под ключ.
              </p>
              <p className="text-cream/70 text-sm lg:text-lg leading-relaxed max-w-2xl mx-auto">
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
            <h2 className="font-serif font-black text-cream text-3xl lg:text-5xl uppercase leading-snug">
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
                <div className="relative aspect-[16/10] overflow-hidden">
                  <Image
                    src={show.image}
                    alt={show.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                    sizes="(max-width: 1024px) 100vw, 33vw"
                  />
                </div>
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
        <div className="max-w-7xl mx-auto">
          <div className="mb-10">
            <p className="text-[11px] text-muted uppercase tracking-[0.2em] mb-3">Для крупных компаний</p>
            <h2 className="font-serif font-black text-cream text-3xl lg:text-5xl uppercase leading-snug mb-5">
              Медийные комики на корпоратив
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Image 1 */}
            <Image
              src={MEDIA_IMAGE_1}
              alt="Медийные комики на сцене"
              width={800}
              height={600}
              className="w-full h-auto rounded-card"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
            {/* Image 2 */}
            <Image
              src={MEDIA_IMAGE_2}
              alt="Выступление медийных комиков"
              width={800}
              height={600}
              className="w-full h-auto rounded-card"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>

          <div className="max-w-4xl">
            <p className="text-muted text-base lg:text-lg leading-relaxed mb-4">
              Это известные артисты, которых вы видели по ТВ или встречали в любимых шоу в интернете.
              Они популярны, их приглашают на различные шоу, их монологи собирают много просмотров,
              их любят и ждут.
            </p>
            <p className="text-muted text-base lg:text-lg leading-relaxed mb-6">
              Если вы руководитель крупной и сильной компании и хотите сделать большой сюрприз для
              команды, то появление звезды на сцене станет неожиданным поворотом, а само выступление
              навсегда запомнится как яркое событие.
            </p>
          </div>

          <div className="bg-surface border border-border rounded-card p-6 lg:p-8 flex flex-col sm:flex-row items-start sm:items-center gap-5 max-w-2xl">
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
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row lg:items-start gap-10 lg:gap-16">
            <div className="lg:w-1/2">
              <p className="text-[11px] text-muted uppercase tracking-[0.2em] mb-4">Для камерных мероприятий</p>
              <h2 className="font-serif font-black text-cream text-3xl lg:text-5xl uppercase leading-snug mb-5">
                В рамках бюджета
              </h2>
              <p className="text-muted text-base lg:text-lg leading-relaxed mb-4">
                Для камерных мероприятий с ограниченным бюджетом мы всегда рекомендуем рассмотреть
                менее известных, но не менее талантливых ребят. В кулуарах медийного поля есть
                бриллианты комедии. Это профессионалы своего дела, опытные и очень смешные комики.
              </p>
              <p className="text-cream/80 text-base lg:text-lg leading-relaxed font-medium">
                Если вам важно не имя, а смех и эмоции ваших гостей — этот вариант для вас!
              </p>
            </div>

            {/* Image — right on desktop, bottom on mobile */}
            <div className="lg:w-1/2 shrink-0">
              <Image
                src={BUDGET_IMAGE}
                alt="Комики для камерных мероприятий"
                width={800}
                height={600}
                className="w-full h-auto rounded-card"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
          </div>
        </div>
      </Section>

      {/* ── GALLERY ── */}
      <Section className="py-20 lg:py-28 px-6 border-t border-border">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-4xl mb-12">
            <p className="text-[11px] text-muted uppercase tracking-[0.2em] mb-3">Галерея</p>
            <h2 className="font-serif font-black text-cream text-3xl lg:text-5xl uppercase leading-snug">
              Как проходят наши мероприятия
            </h2>
          </div>

          <div className="columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
            {GALLERY_IMAGES.map((img, i) => (
              <motion.div
                key={img.src}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.05 }}
                className="break-inside-avoid"
              >
                <button
                  className={`relative w-full overflow-hidden rounded-lg cursor-pointer group ${img.vertical ? 'aspect-[3/4]' : 'aspect-[4/3]'}`}
                  onClick={() => setLightboxIndex(i)}
                  aria-label={`Открыть фото ${i + 1}`}
                >
                  <Image
                    src={img.src}
                    alt={`Мероприятие — фото ${i + 1}`}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-[1.05]"
                    sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300 flex items-center justify-center">
                    <svg className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 drop-shadow-lg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/>
                    </svg>
                  </div>
                </button>
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
            <h2 className="font-serif font-black text-cream text-3xl lg:text-5xl uppercase leading-snug mb-4">
              Свяжитесь с нами
            </h2>
            <p className="text-muted text-base">
              Обсудим ваше мероприятие, подберём артистов и ответим на все вопросы
            </p>
          </div>

          <div className="flex flex-col gap-4">
            <a
              href={`tel:${PHONE_GENERAL}`}
              className="group flex items-center gap-6 bg-surface border border-border hover:border-muted-2 rounded-2xl px-6 lg:px-8 py-6 lg:py-7 transition-all duration-300"
            >
              <div className="w-12 h-12 flex-shrink-0 rounded-xl border bg-red/10 border-red/20 flex items-center justify-center">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#E8432A" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1.27h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.91a16 16 0 0 0 6.06 6.06l.92-.92a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7a2 2 0 0 1 1.72 2.02z"/>
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] text-muted uppercase tracking-[0.15em] mb-1">Общие вопросы</p>
                <p className="font-serif font-black text-cream text-xl lg:text-2xl">+7 906 731-45-51</p>
              </div>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-muted group-hover:text-cream transition-colors flex-shrink-0">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </a>

            <a
              href="https://t.me/lb_events_team"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-6 bg-surface border border-border hover:border-muted-2 rounded-2xl px-6 lg:px-8 py-6 lg:py-7 transition-all duration-300"
            >
              <div className="w-12 h-12 flex-shrink-0 rounded-xl border bg-[#2AABEE]/10 border-[#2AABEE]/20 flex items-center justify-center text-[#2AABEE]">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] text-muted uppercase tracking-[0.15em] mb-1">Телеграм</p>
                <p className="font-serif font-black text-cream text-xl lg:text-2xl">@lb_events_team</p>
              </div>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-muted group-hover:text-cream transition-colors flex-shrink-0">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </a>

            <a
              href="https://max.ru/+79067314551"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-6 bg-surface border border-border hover:border-muted-2 rounded-2xl px-6 lg:px-8 py-6 lg:py-7 transition-all duration-300"
            >
              <div className="w-12 h-12 flex-shrink-0 rounded-xl border bg-[#4CCFFF]/10 border-[#4CCFFF]/20 flex items-center justify-center">
                <svg width="22" height="22" viewBox="0 0 1000 1000" fill="none">
                  <rect width="1000" height="1000" fill="#4CCFFF" rx="249.681"/>
                  <path fill="#fff" fillRule="evenodd" d="M508.211 878.328c-75.007 0-109.864-10.95-170.453-54.75-38.325 49.275-159.686 87.783-164.979 21.9 0-49.456-10.95-91.248-23.36-136.873-14.782-56.21-31.572-118.807-31.572-209.508 0-216.626 177.754-379.597 388.357-379.597 210.785 0 375.947 171.001 375.947 381.604.707 207.346-166.595 376.118-373.94 377.224m3.103-571.585c-102.564-5.292-182.499 65.7-200.201 177.024-14.6 92.162 11.315 204.398 33.397 210.238 10.585 2.555 37.23-18.98 53.837-35.587a189.8 189.8 0 0 0 92.71 33.032c106.273 5.112 197.08-75.794 204.215-181.95 4.154-106.382-77.67-196.486-183.958-202.574Z" clipRule="evenodd"/>
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] text-muted uppercase tracking-[0.15em] mb-1">МАКС</p>
                <p className="font-serif font-black text-cream text-xl lg:text-2xl">+7 906 731-45-51</p>
              </div>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-muted group-hover:text-cream transition-colors flex-shrink-0">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </a>

            <a
              href={`mailto:${EMAIL}`}
              className="group flex items-center gap-6 bg-surface border border-border hover:border-muted-2 rounded-2xl px-6 lg:px-8 py-6 lg:py-7 transition-all duration-300"
            >
              <div className="w-12 h-12 flex-shrink-0 rounded-xl border bg-blue-500/10 border-blue-400/20 flex items-center justify-center">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#60A5FA" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <rect width="20" height="16" x="2" y="4" rx="2"/>
                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] text-muted uppercase tracking-[0.15em] mb-1">Почта</p>
                <p className="font-serif font-black text-cream text-lg lg:text-2xl break-all">{EMAIL}</p>
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
            <h2 className="font-serif font-black text-cream text-3xl lg:text-5xl uppercase leading-snug mb-5">
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

      {/* ── LIGHTBOX ── */}
      {lightboxIndex !== null && (
        <div
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-sm flex items-center justify-center"
          onClick={closeLightbox}
        >
          {/* Counter */}
          <div className="absolute top-5 left-1/2 -translate-x-1/2 z-10 text-white/50 text-sm tabular-nums pointer-events-none">
            {lightboxIndex + 1} / {GALLERY_IMAGES.length}
          </div>

          {/* Close */}
          <button
            className="absolute top-4 right-4 z-10 w-10 h-10 flex items-center justify-center bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors cursor-pointer"
            onClick={closeLightbox}
            aria-label="Закрыть"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 6 6 18M6 6l12 12"/>
            </svg>
          </button>

          {/* Prev */}
          <button
            className="absolute left-3 lg:left-6 top-1/2 -translate-y-1/2 z-10 w-10 h-10 flex items-center justify-center bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors cursor-pointer"
            onClick={(e) => { e.stopPropagation(); prevImage() }}
            aria-label="Предыдущее фото"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 18l-6-6 6-6"/>
            </svg>
          </button>

          {/* Image */}
          <div
            className="relative w-full h-full flex items-center justify-center px-14 lg:px-20 py-16"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative max-w-5xl w-full h-[80vh]">
              <Image
                src={GALLERY_IMAGES[lightboxIndex].src}
                alt={`Мероприятие — фото ${lightboxIndex + 1}`}
                fill
                className="object-contain"
                sizes="100vw"
                priority
              />
            </div>
          </div>

          {/* Next */}
          <button
            className="absolute right-3 lg:right-6 top-1/2 -translate-y-1/2 z-10 w-10 h-10 flex items-center justify-center bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors cursor-pointer"
            onClick={(e) => { e.stopPropagation(); nextImage() }}
            aria-label="Следующее фото"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 18l6-6-6-6"/>
            </svg>
          </button>
        </div>
      )}
    </>
  )
}
