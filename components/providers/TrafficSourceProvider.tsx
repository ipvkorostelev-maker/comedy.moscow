'use client'

import { useEffect } from 'react'
import {
  appendTrafficSourceToTicketUrl,
  getTrafficSourceParams,
  saveTrafficSource,
} from '@/lib/trafficSource'

function updateYandexTicketLink(event: Event) {
  const target = event.target
  if (!(target instanceof Element)) return

  const anchor = target.closest<HTMLAnchorElement>('a[href]')
  if (!anchor) return

  const nextUrl = appendTrafficSourceToTicketUrl(anchor.href)
  if (nextUrl !== anchor.href) anchor.href = nextUrl
}

export function TrafficSourceProvider() {
  useEffect(() => {
    const source = saveTrafficSource()
    const params = getTrafficSourceParams(source)

    if (Object.keys(params).length > 0) {
      const dealer = window.YandexTicketsDealer ?? []
      window.YandexTicketsDealer = dealer
      dealer.push(['setDefaultUrlQueryParams', params])
    }

    document.addEventListener('click', updateYandexTicketLink, true)
    document.addEventListener('auxclick', updateYandexTicketLink, true)
    document.addEventListener('contextmenu', updateYandexTicketLink, true)

    return () => {
      document.removeEventListener('click', updateYandexTicketLink, true)
      document.removeEventListener('auxclick', updateYandexTicketLink, true)
      document.removeEventListener('contextmenu', updateYandexTicketLink, true)
    }
  }, [])

  return null
}
