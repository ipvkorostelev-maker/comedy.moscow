'use client'

import Link from 'next/link'
import { useConsent } from '@/components/providers/ConsentProvider'

export default function CookieBanner() {
  const { acceptAll, rejectOptional, openSettings } = useConsent()

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[100] p-2.5 md:p-3">
      <div className="mx-auto max-w-6xl rounded-xl bg-white px-4 py-3 shadow-2xl md:px-5 md:py-3.5">
        <div className="flex flex-col gap-2.5 lg:flex-row lg:items-center lg:justify-between lg:gap-6">
          <div className="flex-1">
            <h2 className="font-serif text-sm font-bold text-gray-900 md:text-base">Файлы cookie</h2>
            <p className="mt-0.5 text-xs leading-snug text-gray-600">
              Мы используем необходимые файлы cookie для работы сайта. С вашего согласия мы также
              можем использовать аналитические файлы cookie, в том числе Яндекс Метрику, чтобы
              анализировать посещаемость и улучшать работу сайта. Вы можете принять использование
              необязательных файлов cookie, отказаться от них или изменить настройки.
            </p>
            <Link
              href="/privacy"
              className="mt-1 inline-block text-xs font-medium text-gray-900 underline underline-offset-2 hover:text-red"
            >
              Политика обработки персональных данных
            </Link>
          </div>

          <div className="flex shrink-0 flex-col gap-1.5 sm:flex-row lg:flex-col xl:flex-row">
            <button
              type="button"
              onClick={acceptAll}
              className="min-h-[44px] rounded-lg bg-red px-4 py-1.5 text-[13px] font-bold text-white shadow-red transition-colors hover:bg-red-hover lg:min-h-[38px]"
            >
              Принять все
            </button>
            <button
              type="button"
              onClick={rejectOptional}
              className="min-h-[44px] rounded-lg border border-gray-300 bg-white px-4 py-1.5 text-[13px] font-bold text-gray-900 transition-colors hover:bg-gray-100 lg:min-h-[38px]"
            >
              Отклонить необязательные
            </button>
            <button
              type="button"
              onClick={openSettings}
              className="min-h-[44px] rounded-lg bg-gray-100 px-4 py-1.5 text-[13px] font-bold text-gray-800 transition-colors hover:bg-gray-200 lg:min-h-[38px]"
            >
              Настройки cookie
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
