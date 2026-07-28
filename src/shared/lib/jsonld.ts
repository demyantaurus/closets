import type { Media, SiteSetting } from '@/payload/payload-types'

import { imageProps, type MediaSize } from './media'

export const SITE_URL = (process.env.NEXT_PUBLIC_SERVER_URL ?? 'http://localhost:3000').replace(
  /\/+$/,
  '',
)

export const ORGANIZATION_ID = `${SITE_URL}/#organization`
export const WEBSITE_ID = `${SITE_URL}/#website`

export const ORGANIZATION_NAME = 'Closets'

export function absoluteUrl(path = '/'): string {
  if (/^[a-z][a-z0-9+.-]*:/i.test(path)) return path
  return `${SITE_URL}${path.startsWith('/') ? path : `/${path}`}`
}

export function absoluteImageUrl(
  media: Media | number | null | undefined,
  size: MediaSize,
): string | undefined {
  const image = imageProps(media, size)
  return image ? absoluteUrl(image.src) : undefined
}

function isHttpUrl(value: string | null | undefined): value is string {
  return typeof value === 'string' && /^https?:\/\//i.test(value)
}

export function pruneJsonLd(value: unknown): unknown {
  if (Array.isArray(value)) {
    const items = value.map(pruneJsonLd).filter((item) => item !== undefined)
    return items.length > 0 ? items : undefined
  }
  if (value !== null && typeof value === 'object') {
    const entries = Object.entries(value as Record<string, unknown>).flatMap(([key, raw]) => {
      const pruned = pruneJsonLd(raw)
      return pruned === undefined ? [] : [[key, pruned] as const]
    })
    if (entries.length === 0) return undefined
    if (entries.every(([key]) => key === '@type' || key === '@context')) return undefined
    return Object.fromEntries(entries)
  }
  if (value === null || value === '') return undefined
  return value
}

export function serializeJsonLd(data: unknown): string {
  return JSON.stringify(pruneJsonLd(data) ?? {}).replace(/</g, '\\u003c')
}

export function organizationSchema(settings: SiteSetting) {
  const sameAs = [
    settings.socials?.telegram,
    settings.socials?.whatsapp,
    settings.socials?.instagram,
    settings.socials?.viber,
  ].filter(isHttpUrl)

  return {
    '@type': 'FurnitureStore',
    '@id': ORGANIZATION_ID,
    name: ORGANIZATION_NAME,
    description: 'Мебель на заказ в Минске: шкафы-купе, гардеробные, кухни, прихожие',
    url: SITE_URL,
    image: absoluteImageUrl(settings.heroImage, 'hero'),
    telephone: settings.phones?.[0]?.number,
    email: settings.email,
    currenciesAccepted: 'BYN',
    areaServed: { '@type': 'City', name: 'Минск' },
    address: settings.address
      ? {
          '@type': 'PostalAddress',
          streetAddress: settings.address,
          addressLocality: 'Минск',
          addressCountry: 'BY',
        }
      : undefined,
    contactPoint: settings.phones?.length
      ? settings.phones.map((phone) => ({
          '@type': 'ContactPoint',
          contactType: 'sales',
          telephone: phone.number,
          areaServed: 'BY',
          availableLanguage: ['ru', 'be'],
        }))
      : undefined,
    sameAs: sameAs.length > 0 ? sameAs : undefined,
  }
}

export function websiteSchema() {
  return {
    '@type': 'WebSite',
    '@id': WEBSITE_ID,
    name: ORGANIZATION_NAME,
    url: SITE_URL,
    inLanguage: 'ru-RU',
    publisher: { '@id': ORGANIZATION_ID },
  }
}
