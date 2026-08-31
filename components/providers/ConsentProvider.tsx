'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import {
  buildConsent,
  type ConsentState,
  disableAnalytics,
  disableMarketing,
  enableAnalytics,
  enableMarketing,
  getStoredConsent,
  HAS_MARKETING_TRACKERS,
  persistConsent,
} from '@/lib/consent'
import CookieBanner from '@/components/ui/CookieBanner'
import CookieSettingsModal from '@/components/ui/CookieSettingsModal'

interface PendingChoices {
  analytics: boolean
  marketing: boolean
}

interface ConsentContextValue {
  consent: ConsentState | null
  bannerVisible: boolean
  settingsOpen: boolean
  pending: PendingChoices
  setPending: (value: PendingChoices) => void
  acceptAll: () => void
  rejectOptional: () => void
  openSettings: () => void
  closeSettings: () => void
  saveChoices: (choices: PendingChoices) => void
}

const ConsentContext = createContext<ConsentContextValue | null>(null)

export function ConsentProvider({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false)
  const [consent, setConsent] = useState<ConsentState | null>(null)
  const [bannerVisible, setBannerVisible] = useState(false)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [pending, setPending] = useState<PendingChoices>({
    analytics: false,
    marketing: false,
  })

  const applyConsent = useCallback((state: ConsentState, changed: boolean) => {
    if (state.analytics) {
      enableAnalytics()
    } else if (changed) {
      disableAnalytics()
    }

    if (HAS_MARKETING_TRACKERS) {
      if (state.marketing) {
        enableMarketing()
      } else if (changed) {
        disableMarketing()
      }
    }
  }, [])

  useEffect(() => {
    setMounted(true)
    const stored = getStoredConsent()
    if (stored) {
      setConsent(stored)
      applyConsent(stored, false)
    } else {
      setBannerVisible(true)
    }
  }, [applyConsent])

  const acceptAll = useCallback(() => {
    const state = buildConsent({ analytics: true, marketing: HAS_MARKETING_TRACKERS })
    persistConsent(state)
    setConsent(state)
    setBannerVisible(false)
    setSettingsOpen(false)
    applyConsent(state, true)
  }, [applyConsent])

  const rejectOptional = useCallback(() => {
    const state = buildConsent({ analytics: false, marketing: false })
    persistConsent(state)
    setConsent(state)
    setBannerVisible(false)
    setSettingsOpen(false)
    applyConsent(state, true)
  }, [applyConsent])

  const openSettings = useCallback(() => {
    setPending({
      analytics: consent?.analytics ?? false,
      marketing: consent?.marketing ?? false,
    })
    setSettingsOpen(true)
  }, [consent])

  const closeSettings = useCallback(() => {
    setSettingsOpen(false)
  }, [])

  const saveChoices = useCallback(
    (choices: PendingChoices) => {
      const prevAnalytics = consent?.analytics ?? false
      const prevMarketing = consent?.marketing ?? false
      const state = buildConsent(choices)

      persistConsent(state)
      setConsent(state)
      setBannerVisible(false)
      setSettingsOpen(false)
      applyConsent(state, true)

      const revokedAnalytics = prevAnalytics && !choices.analytics
      const revokedMarketing = HAS_MARKETING_TRACKERS && prevMarketing && !choices.marketing

      if (revokedAnalytics || revokedMarketing) {
        if (typeof window !== 'undefined') {
          window.location.reload()
        }
      }
    },
    [applyConsent, consent]
  )

  const value = useMemo(
    () => ({
      consent,
      bannerVisible,
      settingsOpen,
      pending,
      setPending,
      acceptAll,
      rejectOptional,
      openSettings,
      closeSettings,
      saveChoices,
    }),
    [
      consent,
      bannerVisible,
      settingsOpen,
      pending,
      acceptAll,
      rejectOptional,
      openSettings,
      closeSettings,
      saveChoices,
    ]
  )

  return (
    <ConsentContext.Provider value={value}>
      {children}
      {mounted && bannerVisible && <CookieBanner />}
      {mounted && settingsOpen && <CookieSettingsModal />}
    </ConsentContext.Provider>
  )
}

export function useConsent() {
  const ctx = useContext(ConsentContext)
  if (!ctx) {
    throw new Error('useConsent must be used within ConsentProvider')
  }
  return ctx
}
