'use client'

import Link from 'next/link'
import { useConsent } from '@/components/providers/ConsentProvider'

export default function CookieBanner() {
  const { acceptAll, rejectOptional, openSettings } = useConsent()

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[100] p-4 md:p-6">
      <div className="mx-auto max-w-7xl rounded-2xl bg-white px-5 py-5 shadow-2xl md:px-8 md:py-6">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex-1">
            <h2 className="font-serif text-lg font-bold text-gray-900">Файлы cookie</h2>
            <p className="mt-1 text-sm leading-relaxed text-gray-700">
              Мы используем необходимые файлы cookie для работы сайта. С вашего согласия мы также
              можем использовать аналитические файлы cookie, в том числе Яндекс Метрику, чтобы
              анализировать посещаемость и улучшать работу сайта.
            </p>
            <p className="mt-1 text-sm leading-relaxed text-gray-700">
              Вы можете принять использование необязательных файлов cookie, отказаться от них или
              изменить настройки.
            </p>
            <Link
              href="/privacy"
              className="mt-2 inline-block text-sm font-medium text-gray-900 underline underline-offset-2 hover:text-red"
            >
              Политика обработки персональных данных
            </Link>
          </div>

          <div className="flex shrink-0 flex-col gap-2.5 sm:flex-row lg:flex-col xl:flex-row">
            <button
              type="button"
              onClick={acceptAll}
              className="min-h-[44px] rounded-lg bg-red px-5 py-2.5 text-sm font-bold text-white shadow-red transition-colors hover:bg-red-hover"
            >
              Принять все
            </button>
            <button
              type="button"
              onClick={rejectOptional}
              className="min-h-[44px] rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-bold text-gray-900 transition-colors hover:bg-gray-100"
            >
              Отклонить необязательные
            </button>
            <button
              type="button"
              onClick={openSettings}
              className="min-h-[44px] rounded-lg bg-gray-100 px-5 py-2.5 text-sm font-bold text-gray-800 transition-colors hover:bg-gray-200"
            >
              Настройки cookie
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
