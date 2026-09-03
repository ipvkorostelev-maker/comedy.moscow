import { ImageResponse } from 'next/og'
import { getArtistBySlug } from '@/lib/data'
import {
  fetchImageBase64,
  loadFonts,
  OgContainer,
  OgSubtitle,
  OgTitle,
  OG_SIZE,
  OG_CONTENT_TYPE,
} from '@/lib/og'

export const revalidate = 300
export const alt = 'Артист — comedy.moscow'
export const size = OG_SIZE
export const contentType = OG_CONTENT_TYPE

export default async function Image({ params }: { params: { slug: string } }) {
  const artist = await getArtistBySlug(params.slug)
  if (!artist) return new Response('Not found', { status: 404 })

  const [fonts, backgroundImage] = await Promise.all([
    loadFonts(),
    fetchImageBase64(artist.photo),
  ])

  const subtitle = [artist.role, artist.city].filter(Boolean).join(' · ')

  return new ImageResponse(
    (
      <OgContainer backgroundImage={backgroundImage}>
        <OgTitle>{artist.name}</OgTitle>
        {subtitle && <OgSubtitle>{subtitle}</OgSubtitle>}
      </OgContainer>
    ),
    { ...size, fonts },
  )
}
