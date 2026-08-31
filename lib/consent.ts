declare global {
  interface Window {
    ym?: YmFunction
    _tmr?: unknown[]
    YandexTicketsDealer?: unknown[]
  }
}

type YmFunction = {
  (...args: unknown[]): void
  a?: unknown[][]
  l?: number
}

export const CONSENT_VERSION = 1
export const CONSENT_STORAGE_KEY = 'smeshno-consent'
export const CONSENT_COOKIE_NAME = 'smeshno_consent'

export const YANDEX_METRIKA_COUNTERS = [108210320, 94359734] as const
export type YandexCounterId = (typeof YANDEX_METRIKA_COUNTERS)[number]

export const YANDEX_METRIKA_CONFIG: Record<YandexCounterId, Record<string, unknown>> = {
  108210320: {
    webvisor: true,
    clickmap: true,
    ecommerce: 'dataLayer',
    accurateTrackBounce: true,
    trackLinks: true,
    trustedDomains: ['afisha.yandex.ru', 'widget.afisha.yandex.ru'],
  },
  94359734: {
    clickmap: true,
    ecommerce: 'dataLayer',
    accurateTrackBounce: true,
    trackLinks: true,
    trustedDomains: ['afisha.yandex.ru', 'widget.afisha.yandex.ru'],
  },
}

export const VK_PIXEL_ID = '3764427'
export const HAS_MARKETING_TRACKERS = true

export interface ConsentState {
  necessary: true
  analytics: boolean
  marketing: boolean
  version: number
  timestamp: string
}

function isBrowser() {
  return typeof window !== 'undefined' && typeof document !== 'undefined'
}

export function buildConsent(choices: {
  analytics: boolean
  marketing: boolean
}): ConsentState {
  return {
    necessary: true,
    analytics: choices.analytics,
    marketing: choices.marketing,
    version: CONSENT_VERSION,
    timestamp: new Date().toISOString(),
  }
}

function getHostnameVariants(): string[] {
  if (!isBrowser()) return []
  const host = window.location.hostname
  const parts = host.split('.')
  const variants: string[] = ['', host, `.${host}`]
  if (parts.length > 2) {
    variants.push(`.${parts.slice(-2).join('.')}`)
  }
  return variants
}

function eraseCookie(name: string) {
  if (!isBrowser()) return
  const variants = getHostnameVariants()
  const paths = ['/', '']
  variants.forEach((domain) => {
    paths.forEach((path) => {
      let cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=${path}`
      if (domain) cookie += `; domain=${domain}`
      document.cookie = cookie
    })
  })
}

function setCookie(name: string, value: string, maxAgeDays = 365) {
  if (!isBrowser()) return
  const maxAge = 60 * 60 * 24 * maxAgeDays
  document.cookie = `${name}=${encodeURIComponent(value)}; path=/; max-age=${maxAge}; SameSite=Lax`
}

export function getStoredConsent(): ConsentState | null {
  if (!isBrowser()) return null

  try {
    const raw = window.localStorage.getItem(CONSENT_STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw) as ConsentState
      if (parsed && parsed.version === CONSENT_VERSION) {
        return parsed
      }
    }
  } catch {
    // ignore
  }

  try {
    const match = document.cookie.match(new RegExp(`(?:^|; )${CONSENT_COOKIE_NAME}=([^;]*)`))
    if (match) {
      const parsed = JSON.parse(decodeURIComponent(match[1])) as ConsentState
      if (parsed && parsed.version === CONSENT_VERSION) {
        return parsed
      }
    }
  } catch {
    // ignore
  }

  return null
}

export function persistConsent(state: ConsentState) {
  if (!isBrowser()) return
  try {
    window.localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(state))
  } catch {
    // ignore
  }
  setCookie(CONSENT_COOKIE_NAME, JSON.stringify(state))
}

export function clearConsentStorage() {
  if (!isBrowser()) return
  try {
    window.localStorage.removeItem(CONSENT_STORAGE_KEY)
  } catch {
    // ignore
  }
  eraseCookie(CONSENT_COOKIE_NAME)
}

export function clearYandexMetricaCookies() {
  if (!isBrowser()) return
  ;[
    '_ym_uid',
    '_ym_d',
    '_ym_isad',
    'ymex',
    'yandexuid',
    '_ym_debug',
  ].forEach(eraseCookie)

  document.cookie.split(';').forEach((chunk) => {
    const name = chunk.split('=')[0]?.trim()
    if (name && name.startsWith('_ym')) {
      eraseCookie(name)
    }
  })
}

export function clearMarketingCookies() {
  if (!isBrowser()) return
  ;[
    'tmr_reqNum',
    'tmr_lvid',
    'tmr_lvidTS',
    'tmr_detect',
    'tmr_mailru_sid',
    'tmr_mailru_gid',
    '_tmr_sid',
  ].forEach(eraseCookie)
}

export function setDisableYaCounters(disabled: boolean) {
  if (!isBrowser()) return
  YANDEX_METRIKA_COUNTERS.forEach((id) => {
    ;(window as unknown as Record<string, boolean>)[`disableYaCounter${id}`] = disabled
  })
}

let analyticsLoaded = false
let marketingLoaded = false

export function enableAnalytics() {
  if (!isBrowser() || analyticsLoaded) return
  analyticsLoaded = true

  setDisableYaCounters(false)

  if (typeof window.ym !== 'function') {
    const stub: YmFunction = function (...args: unknown[]) {
      ;(stub.a = stub.a || []).push(args)
    }
    window.ym = stub
    stub.l = new Date().valueOf()
  }

  const existing = document.getElementById('yandex-metrika-script') as HTMLScriptElement | null
  if (!existing) {
    const s = document.createElement('script')
    s.id = 'yandex-metrika-script'
    s.async = true
    s.src = 'https://mc.yandex.ru/metrika/tag.js'
    const first = document.getElementsByTagName('script')[0]
    first?.parentNode?.insertBefore(s, first)
  }

  YANDEX_METRIKA_COUNTERS.forEach((id) => {
    const counterName = `yaCounter${id}`
    if (typeof window[counterName as keyof Window] === 'undefined' && window.ym) {
      window.ym(id, 'init', YANDEX_METRIKA_CONFIG[id])
    }
  })
}

export function disableAnalytics() {
  if (!isBrowser()) return
  setDisableYaCounters(true)
  clearYandexMetricaCookies()
  analyticsLoaded = false
}

export function enableMarketing() {
  if (!isBrowser() || marketingLoaded) return
  marketingLoaded = true

  if (typeof window._tmr !== 'object') {
    window._tmr = []
  }
  ;(window._tmr as unknown[]).push({ id: VK_PIXEL_ID, type: 'pageView', start: new Date().getTime() })

  const existing = document.getElementById('vk-pixel-script') as HTMLScriptElement | null
  if (!existing) {
    const s = document.createElement('script')
    s.id = 'vk-pixel-script'
    s.async = true
    s.src = 'https://top-fwz1.mail.ru/js/code.js'
    const first = document.getElementsByTagName('script')[0]
    first?.parentNode?.insertBefore(s, first)
  }
}

export function disableMarketing() {
  if (!isBrowser()) return
  clearMarketingCookies()
  marketingLoaded = false
}

if (isBrowser()) {
  setDisableYaCounters(true)
}
