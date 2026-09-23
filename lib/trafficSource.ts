export const TRAFFIC_SOURCE_STORAGE_KEY = 'comedy_traffic_source'
export const TRAFFIC_SOURCE_TTL_MS = 30 * 24 * 60 * 60 * 1000

export const UTM_KEYS = [
  'utm_source',
  'utm_medium',
  'utm_campaign',
  'utm_content',
  'utm_term',
] as const

export type UtmKey = (typeof UTM_KEYS)[number]
export type TrafficSource = Partial<Record<UtmKey, string>> & {
  _timestamp: number
}

function isBrowser(): boolean {
  return typeof window !== 'undefined'
}

function parseStoredTrafficSource(raw: string | null): TrafficSource | null {
  if (!raw) return null

  try {
    const parsed = JSON.parse(raw) as Record<string, unknown>
    if (!parsed || typeof parsed !== 'object' || !Number.isFinite(parsed._timestamp)) {
      return null
    }

    const source: TrafficSource = { _timestamp: parsed._timestamp as number }
    UTM_KEYS.forEach((key) => {
      if (typeof parsed[key] === 'string' && parsed[key].length > 0) {
        source[key] = parsed[key]
      }
    })

    return source
  } catch {
    return null
  }
}

export function getTrafficSource(now = Date.now()): TrafficSource | null {
  if (!isBrowser()) return null

  try {
    const source = parseStoredTrafficSource(
      window.localStorage.getItem(TRAFFIC_SOURCE_STORAGE_KEY)
    )

    if (!source) return null
    if (now - source._timestamp > TRAFFIC_SOURCE_TTL_MS) {
      window.localStorage.removeItem(TRAFFIC_SOURCE_STORAGE_KEY)
      return null
    }

    return source
  } catch {
    return null
  }
}

export function getTrafficSourceParams(
  source = getTrafficSource()
): Partial<Record<UtmKey, string>> {
  if (!source) return {}

  return UTM_KEYS.reduce<Partial<Record<UtmKey, string>>>((params, key) => {
    if (source[key]) params[key] = source[key]
    return params
  }, {})
}

export function getTrafficSourceQuery(source = getTrafficSource()): string {
  const params = new URLSearchParams()
  const trafficParams = getTrafficSourceParams(source)

  UTM_KEYS.forEach((key) => {
    const value = trafficParams[key]
    if (value) params.set(key, value)
  })

  return params.toString()
}

export function saveTrafficSource(
  search = isBrowser() ? window.location.search : '',
  now = Date.now()
): TrafficSource | null {
  if (!isBrowser()) return null

  try {
    const searchParams = new URLSearchParams(search)
    const incoming = UTM_KEYS.reduce<Partial<Record<UtmKey, string>>>((params, key) => {
      const value = searchParams.get(key)
      if (value) params[key] = value
      return params
    }, {})

    if (Object.keys(incoming).length === 0) {
      return getTrafficSource(now)
    }

    const stored = getTrafficSource(now)
    const source: TrafficSource = {
      ...getTrafficSourceParams(stored),
      ...incoming,
      _timestamp: now,
    }

    window.localStorage.setItem(TRAFFIC_SOURCE_STORAGE_KEY, JSON.stringify(source))
    return source
  } catch {
    return null
  }
}

export function appendTrafficSourceToTicketUrl(
  rawUrl: string,
  source = getTrafficSource()
): string {
  if (!source) return rawUrl

  try {
    const url = new URL(rawUrl)
    if (url.hostname !== 'widget.afisha.yandex.ru') return rawUrl

    let changed = false
    UTM_KEYS.forEach((key) => {
      const value = source[key]
      if (value && !url.searchParams.has(key)) {
        url.searchParams.set(key, value)
        changed = true
      }
    })

    return changed ? url.toString() : rawUrl
  } catch {
    return rawUrl
  }
}
