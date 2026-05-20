import type { Metadata } from 'next'
import ArtistTourClient from './ArtistTourClient'

export const metadata: Metadata = {
  robots: { index: false, follow: false },
}

export default function ArtistTourPage() {
  return <ArtistTourClient />
}
