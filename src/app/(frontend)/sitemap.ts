import type { MetadataRoute } from 'next'

import { getCategories, getProducts } from '@/shared/api'

export const dynamic = 'force-dynamic'

const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL ?? 'http://localhost:3000'

const STATIC_PAGES = [
  { path: '', changeFrequency: 'weekly', priority: 1 },
  { path: '/catalog', changeFrequency: 'weekly', priority: 0.8 },
  { path: '/portfolio', changeFrequency: 'weekly', priority: 0.8 },
  { path: '/calculator', changeFrequency: 'monthly', priority: 0.8 },
  { path: '/faq', changeFrequency: 'monthly', priority: 0.6 },
  { path: '/contacts', changeFrequency: 'monthly', priority: 0.8 },
  { path: '/privacy', changeFrequency: 'yearly', priority: 0.2 },
] as const

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [categories, products] = await Promise.all([getCategories(), getProducts()])

  const staticPages: MetadataRoute.Sitemap = STATIC_PAGES.map(
    ({ path, changeFrequency, priority }) => ({
      url: `${SERVER_URL}${path}`,
      changeFrequency,
      priority,
    }),
  )

  const categoryPages: MetadataRoute.Sitemap = categories.map((category) => ({
    url: `${SERVER_URL}/catalog/${category.slug}`,
    lastModified: category.updatedAt ? new Date(category.updatedAt) : undefined,
    changeFrequency: 'weekly',
    priority: 0.7,
  }))

  const productPages: MetadataRoute.Sitemap = products.flatMap((product) => {
    const category =
      typeof product.category === 'object' && product.category !== null ? product.category : null
    if (!category) return []
    return [
      {
        url: `${SERVER_URL}/catalog/${category.slug}/${product.slug}`,
        lastModified: product.updatedAt ? new Date(product.updatedAt) : undefined,
        changeFrequency: 'monthly' as const,
        priority: 0.6,
      },
    ]
  })

  return [...staticPages, ...categoryPages, ...productPages]
}
