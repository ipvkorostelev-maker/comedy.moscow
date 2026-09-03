import { ImageResponse } from 'next/og'
import { getEventBySlugAny } from '@/lib/data'
import {
  fetchImageBase64,
  loadFonts,
  OgContainer,
  OgSubtitle,
  OgTitle,
  OG_SIZE,
  OG_CONTENT_TYPE,
} from '@/lib/og'
import { formatDateShort, formatPrice, minEventPrice } from '@/lib/utils'

export const revalidate = 300
export const alt = 'Событие — comedy.moscow'
export const size = OG_SIZE
export const contentType = OG_CONTENT_TYPE

export default async function Image({ params }: { params: { slug: string } }) {
  const event = await getEventBySlugAny(params.slug)
  if (!event) return new Response('Not found', { status: 404 })

  const [fonts, backgroundImage] = await Promise.all([
    loadFonts(),
    fetchImageBase64(event.image),
  ])

  const price = minEventPrice(event)
  const priceText = price > 0 ? `от ${formatPrice(price)}` : ''
  const subtitle = [
    formatDateShort(event.date),
    event.city || 'Москва',
    event.venueName,
    priceText,
  ]
    .filter(Boolean)
    .join(' · ')

  return new ImageResponse(
    (
      <OgContainer backgroundImage={backgroundImage}>
        <OgTitle>{event.title}</OgTitle>
        <OgSubtitle>{subtitle}</OgSubtitle>
      </OgContainer>
    ),
    { ...size, fonts },
  )
}
