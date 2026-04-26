import type { Metadata } from 'next'
import ObfuscatedContact from '@/components/ui/ObfuscatedContact'

export const metadata: Metadata = {
  title: 'Контакты',
  description: 'Свяжитесь с нами по телефону или почте — ответим на любые вопросы о стендап-концертах.',
}

const ARROW_ICON = (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-muted group-hover:text-cream transition-colors duration-200 flex-shrink-0">
    <path d="M5 12h14M12 5l7 7-7 7"/>
  </svg>
)

const contacts = [
  {
    label: 'Телефон',
    iconBg: 'bg-red/10 border-red/20',
    iconColor: 'text-red',
    hoverColor: 'group-hover:text-red',
    icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1.27h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.91a16 16 0 0 0 6.06 6.06l.92-.92a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7a2 2 0 0 1 1.72 2.02z"/></svg>,
    parts: ['+7 (906)', ' ', '731', '-45-51'],
    href: 'tel:__VALUE__',
  },
  {
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
          {contacts.map(({ label, iconBg, iconColor, hoverColor, icon, parts, href }) => (
            <div key={label} className="group flex items-center gap-6 bg-surface border border-border hover:border-muted-2 rounded-2xl px-8 py-7 transition-all duration-300 hover:shadow-card-hover">
              <div className={`w-12 h-12 flex-shrink-0 rounded-xl border flex items-center justify-center ${iconBg} ${iconColor}`}>
                {icon}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] text-muted uppercase tracking-[0.15em] mb-1">{label}</p>
                <ObfuscatedContact
                  parts={parts}
                  href={href}
                  className={`font-serif font-black text-cream text-2xl transition-colors duration-200 break-all ${hoverColor}`}
                />
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
