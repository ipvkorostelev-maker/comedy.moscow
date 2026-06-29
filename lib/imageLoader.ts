export default function imageLoader({
  src,
  width,
  quality = 85,
}: {
  src: string
  width: number
  quality?: number
}): string {
  if (src.startsWith('data:') || src.startsWith('/') || src.startsWith('.')) {
    return src
  }
  const encoded = encodeURIComponent(src)
  return `/api/image?url=${encoded}&w=${width}&q=${quality}`
}
