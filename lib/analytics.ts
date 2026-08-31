import { getStoredConsent, YANDEX_METRIKA_COUNTERS } from './consent'

function canTrack(): boolean {
  if (typeof window === 'undefined') return false
  const consent = getStoredConsent()
  return !!consent && consent.analytics === true
}

export function trackGoal(counterId: number, goalName: string, params?: unknown) {
  if (!canTrack()) return
  if (typeof window.ym !== 'function') return
  window.ym(counterId, 'reachGoal', goalName, params)
}

export function trackGoalDefault(goalName: string, params?: unknown) {
  trackGoal(108210320, goalName, params)
}

export function trackPageView(url?: string) {
  if (!canTrack()) return
  if (typeof window.ym !== 'function') return
  const target = url ?? window.location.href
  YANDEX_METRIKA_COUNTERS.forEach((id) => {
    window.ym?.(id, 'hit', target)
  })
}
