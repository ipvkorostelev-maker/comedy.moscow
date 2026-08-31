'use client'

import { useCallback, useEffect } from 'react'
import { useConsent } from '@/components/providers/ConsentProvider'
import { HAS_MARKETING_TRACKERS } from '@/lib/consent'

function Toggle({
  checked,
  onChange,
  disabled,
  label,
}: {
  checked: boolean
  onChange?: (value: boolean) => void
  disabled?: boolean
  label: string
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      disabled={disabled}
      onClick={() => onChange?.(!checked)}
      className={`
        relative inline-flex h-7 w-12 shrink-0 rounded-full transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-red focus-visible:ring-offset-2
        ${checked ? 'bg-red' : 'bg-gray-300'}
        ${disabled ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'}
      `}
    >
      <span
        className={`
          inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform
          ${checked ? 'translate-x-6' : 'translate-x-1'}
          mt-1
        `}
      />
    </button>
  )
}

export default function CookieSettingsModal() {
  const { pending, setPending, closeSettings, saveChoices } = useConsent()

  const handleSave = useCallback(() => {
    saveChoices(pending)
  }, [pending, saveChoices])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeSettings()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [closeSettings])

  return (
    <div
      className="fixed inset-0 z-[110] flex items-end justify-center bg-black/60 p-0 backdrop-blur-sm sm:items-center sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="cookie-settings-title"
      onClick={(e) => {
        if (e.currentTarget === e.target) closeSettings()
      }}
    >
      <div className="flex max-h-[90vh] w-full max-w-lg flex-col rounded-t-2xl bg-white shadow-2xl sm:rounded-2xl">
        <div className="border-b border-gray-200 px-6 py-5">
          <h2 id="cookie-settings-title" className="font-serif text-xl font-bold text-gray-900">
            Настройки файлов cookie
          </h2>
          <p className="mt-1 text-sm text-gray-600">
            Необходимые файлы cookie используются для корректной работы сайта и не могут быть
            отключены. Использование аналитических и других необязательных файлов cookie можно
            настроить.
          </p>
        </div>

        <div className="overflow-y-auto px-6 py-5">
          <div className="space-y-5">
            <section className="rounded-xl border border-gray-200 bg-gray-50 p-4">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h3 className="font-semibold text-gray-900">Необходимые файлы cookie</h3>
                  <p className="mt-0.5 text-xs text-gray-500">Всегда включены</p>
                </div>
                <Toggle checked disabled label="Необходимые файлы cookie всегда включены" />
              </div>
              <p className="mt-2 text-sm text-gray-600">
                Эти файлы cookie необходимы для работы сайта, обеспечения его безопасности и
                использования запрошенных вами функций.
              </p>
            </section>

            <section className="rounded-xl border border-gray-200 bg-white p-4">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h3 className="font-semibold text-gray-900">Аналитические файлы cookie</h3>
                </div>
                <Toggle
                  checked={pending.analytics}
                  onChange={(value) => setPending({ ...pending, analytics: value })}
                  label="Аналитические файлы cookie"
                />
              </div>
              <p className="mt-2 text-sm text-gray-600">
                Помогают анализировать посещаемость и использование сайта. В этой категории
                используется Яндекс Метрика. Данные используются только после получения вашего
                согласия.
              </p>
            </section>

            {HAS_MARKETING_TRACKERS && (
              <section className="rounded-xl border border-gray-200 bg-white p-4">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <h3 className="font-semibold text-gray-900">Рекламные файлы cookie</h3>
                  </div>
                  <Toggle
                    checked={pending.marketing}
                    onChange={(value) => setPending({ ...pending, marketing: value })}
                    label="Рекламные файлы cookie"
                  />
                </div>
                <p className="mt-2 text-sm text-gray-600">
                  Используются для оценки эффективности рекламы и показа релевантных рекламных
                  материалов.
                </p>
              </section>
            )}
          </div>
        </div>

        <div className="border-t border-gray-200 px-6 py-5">
          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={closeSettings}
              className="min-h-[44px] rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-bold text-gray-900 transition-colors hover:bg-gray-100"
            >
              Отмена
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="min-h-[44px] rounded-lg bg-red px-5 py-2.5 text-sm font-bold text-white shadow-red transition-colors hover:bg-red-hover"
            >
              Сохранить настройки
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
