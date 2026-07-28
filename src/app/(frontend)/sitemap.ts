import type { MetadataRoute } from 'next'

import { getCategories, getProducts } from '@/shared/api'

export const dynamic = 'force-dynamic'

const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL ?? 'http://localhost:3000'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [categories, products] = await Promise.all([getCategories(), getProducts()])

  const staticPages: MetadataRoute.Sitemap = [
    '',
    '/catalog',
    '/portfolio',
    '/calculator',
    '/faq',
    '/contacts',
  ].map((path) => ({
    url: `${SERVER_URL}${path}`,
    changeFrequency: 'weekly',
    priority: path === '' ? 1 : 0.8,
  }))

  const categoryPages: MetadataRoute.Sitemap = categories.map((category) => ({
    url: `${SERVER_URL}/catalog/${category.slug}`,
    changeFrequency: 'weekly',
    priority: 0.7,
  }))

  const productPages: MetadataRoute.Sitemap = products.flatMap((product) => {
    const category =
      typeof product.category === 'object' && product.category !== null
        ? product.category
        : null
    if (!category) return []
    return [
      {
        url: `${SERVER_URL}/catalog/${category.slug}/${product.slug}`,
        changeFrequency: 'monthly' as const,
        priority: 0.6,
      },
    ]
  })

  return [...staticPages, ...categoryPages, ...productPages]
}
