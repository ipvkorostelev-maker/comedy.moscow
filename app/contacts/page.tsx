import type { Metadata } from 'next'
import ObfuscatedContact from '@/components/ui/ObfuscatedContact'
import { BASE } from '@/lib/utils'

export const metadata: Metadata = {
  title: 'Контакты — comedy.moscow',
  description: 'Свяжитесь с нами по телефону, Telegram, Max или почте — ответим на любые вопросы о стендап-концертах и корпоративах.',
  alternates: { canonical: `${BASE}/contacts` },
  openGraph: {
    title: 'Контакты | Смешно — стендап в Москве',
    description: 'Телефон, Telegram, Max и почта для связи по вопросам стендап-концертов и корпоративных мероприятий.',
    url: `${BASE}/contacts`,
    siteName: 'Смешно',
    locale: 'ru_RU',
  },
  twitter: {
    card: 'summary',
    title: 'Контакты | Смешно',
    description: 'Телефон, Telegram, Max и почта для связи.',
  },
}

const ARROW_ICON = (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-muted group-hover:text-cream transition-colors duration-200 flex-shrink-0">
    <path d="M5 12h14M12 5l7 7-7 7"/>
  </svg>
)

type ContactEntry =
  | { type: 'obfuscated'; label: string; iconBg: string; iconColor: string; hoverColor: string; icon: React.ReactNode; parts: string[]; href: string }
  | { type: 'link'; label: string; iconBg: string; iconColor: string; hoverColor: string; icon: React.ReactNode; display: string; href: string }

const contacts: ContactEntry[] = [
  {
    type: 'obfuscated',
    label: 'Телефон',
    iconBg: 'bg-red/10 border-red/20',
    iconColor: 'text-red',
    hoverColor: 'group-hover:text-red',
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1.27h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.91a16 16 0 0 0 6.06 6.06l.92-.92a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7a2 2 0 0 1 1.72 2.02z"/></svg>,
    parts: ['+7 (906)', ' ', '731', '-45-51'],
    href: 'tel:__VALUE__',
  },
  {
    type: 'link',
    label: 'Телеграм',
    iconBg: 'bg-[#2AABEE]/10 border-[#2AABEE]/20',
    iconColor: 'text-[#2AABEE]',
    hoverColor: 'group-hover:text-[#2AABEE]',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
        <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
      </svg>
    ),
    display: '@smeshno',
    href: 'https://t.me/smeshno',
  },
  {
    type: 'link',
    label: 'МАКС',
    iconBg: 'bg-[#4CCFFF]/10 border-[#4CCFFF]/20',
    iconColor: 'text-[#4CCFFF]',
    hoverColor: 'group-hover:text-[#4CCFFF]',
    icon: (
      <svg width="22" height="22" viewBox="0 0 1000 1000" fill="none">
        <rect width="1000" height="1000" fill="#4CCFFF" rx="249.681"/>
        <path fill="#fff" fillRule="evenodd" d="M508.211 878.328c-75.007 0-109.864-10.95-170.453-54.75-38.325 49.275-159.686 87.783-164.979 21.9 0-49.456-10.95-91.248-23.36-136.873-14.782-56.21-31.572-118.807-31.572-209.508 0-216.626 177.754-379.597 388.357-379.597 210.785 0 375.947 171.001 375.947 381.604.707 207.346-166.595 376.118-373.94 377.224m3.103-571.585c-102.564-5.292-182.499 65.7-200.201 177.024-14.6 92.162 11.315 204.398 33.397 210.238 10.585 2.555 37.23-18.98 53.837-35.587a189.8 189.8 0 0 0 92.71 33.032c106.273 5.112 197.08-75.794 204.215-181.95 4.154-106.382-77.67-196.486-183.958-202.574Z" clipRule="evenodd"/>
      </svg>
    ),
    display: '+7 (906) 731-45-51',
    href: 'https://max.ru/+79067314551',
  },
  {
    type: 'obfuscated',
    label: 'Почта',
    iconBg: 'bg-blue-500/10 border-blue-400/20',
    iconColor: 'text-blue-400',
    hoverColor: 'group-hover:text-blue-400',
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>,
    parts: ['river-show', '@', 'mail.ru'],
    href: 'mailto:__VALUE__',
  },
]

export default function ContactsPage() {
  return (
    <main className="min-h-screen pt-16 pb-24 px-6">
      <div className="max-w-2xl mx-auto">
        <div className="mb-14">
          <p className="text-[11px] text-muted uppercase tracking-[0.2em] mb-3">Свяжитесь с нами</p>
          <h1 className="font-serif font-black text-cream text-5xl lg:text-6xl uppercase leading-none">
            Контакты
          </h1>
        </div>

        <div className="flex flex-col gap-4">
          {contacts.map((contact) => (
            <div
              key={contact.label}
              className="group flex items-center gap-6 bg-surface border border-border hover:border-muted-2 rounded-2xl px-8 py-7 transition-all duration-300 hover:shadow-card-hover"
            >
              <div className={`w-12 h-12 flex-shrink-0 rounded-xl border flex items-center justify-center ${contact.iconBg} ${contact.iconColor}`}>
                {contact.icon}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] text-muted uppercase tracking-[0.15em] mb-1">{contact.label}</p>
                {contact.type === 'obfuscated' ? (
                  <ObfuscatedContact
                    parts={contact.parts}
                    href={contact.href}
                    className={`font-serif font-black text-cream text-2xl transition-colors duration-200 break-all ${contact.hoverColor}`}
                  />
                ) : (
                  <a
                    href={contact.href}
                    target={contact.href.startsWith('http') ? '_blank' : undefined}
                    rel={contact.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                    className={`font-serif font-black text-cream text-2xl transition-colors duration-200 break-all ${contact.hoverColor}`}
                  >
                    {contact.display}
                  </a>
                )}
              </div>
              {ARROW_ICON}
            </div>
          ))}
        </div>

        <p className="text-muted text-sm leading-relaxed mt-10 max-w-sm">
          Пишите по вопросам организации мероприятий, партнёрства и сотрудничества.
        </p>
      </div>
    </main>
  )
}
