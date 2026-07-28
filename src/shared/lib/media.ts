import type { Media } from '@/payload/payload-types'

export type MediaSize = 'thumbnail' | 'card' | 'gallery' | 'hero'

export type ImageProps = {
  src: string
  alt: string
  width: number
  height: number
  blurDataURL?: string
}

export function isMedia(value: unknown): value is Media {
  return typeof value === 'object' && value !== null && 'url' in value
}

export function imageProps(media: Media | number | null | undefined, size: MediaSize): ImageProps | null {
  if (!isMedia(media)) return null
  const variant = media.sizes?.[size]
  const src = variant?.url ?? media.url
  const width = variant?.width ?? media.width
  const height = variant?.height ?? media.height
  if (!src || !width || !height) return null
  return {
    src,
    alt: media.alt,
    width,
    height,
    blurDataURL: media.blurDataUrl ?? undefined,
  }
}
