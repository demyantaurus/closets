import { unstable_cache } from 'next/cache'
import { cache } from 'react'

import { getPayloadClient } from './client'

const isPublished = { published: { equals: true } }
const isPublishedStatus = { _status: { equals: 'published' } }

export const getCategories = cache(
  unstable_cache(
    async () => {
      const payload = await getPayloadClient()
      const res = await payload.find({
        collection: 'categories',
        where: isPublished,
        sort: 'sortOrder',
        depth: 1,
        limit: 100,
      })
      return res.docs
    },
    ['categories'],
    { tags: ['categories'] },
  ),
)

export const getCategoryBySlug = cache((slug: string) =>
  unstable_cache(
    async () => {
      const payload = await getPayloadClient()
      const res = await payload.find({
        collection: 'categories',
        where: { and: [{ slug: { equals: slug } }, isPublished] },
        depth: 1,
        limit: 1,
      })
      return res.docs[0] ?? null
    },
    ['category', slug],
    { tags: ['categories'] },
  )(),
)

export const getProducts = cache((categoryId?: number) =>
  unstable_cache(
    async () => {
      const payload = await getPayloadClient()
      const res = await payload.find({
        collection: 'products',
        where: categoryId
          ? { and: [{ category: { equals: categoryId } }, isPublishedStatus] }
          : isPublishedStatus,
        sort: '-createdAt',
        depth: 1,
        limit: 100,
      })
      return res.docs
    },
    ['products', String(categoryId ?? 'all')],
    { tags: ['products'] },
  )(),
)

export const getProductBySlug = cache((slug: string) =>
  unstable_cache(
    async () => {
      const payload = await getPayloadClient()
      const res = await payload.find({
        collection: 'products',
        where: { and: [{ slug: { equals: slug } }, isPublishedStatus] },
        depth: 1,
        limit: 1,
      })
      return res.docs[0] ?? null
    },
    ['product', slug],
    { tags: ['products'] },
  )(),
)

export const getPortfolio = cache((limit = 100) =>
  unstable_cache(
    async () => {
      const payload = await getPayloadClient()
      const res = await payload.find({
        collection: 'portfolio-projects',
        where: isPublishedStatus,
        sort: '-createdAt',
        depth: 1,
        limit,
      })
      return res.docs
    },
    ['portfolio', String(limit)],
    { tags: ['portfolio'] },
  )(),
)

export const getReviews = cache((limit = 20) =>
  unstable_cache(
    async () => {
      const payload = await getPayloadClient()
      const res = await payload.find({
        collection: 'reviews',
        where: isPublished,
        sort: '-createdAt',
        depth: 1,
        limit,
      })
      return res.docs
    },
    ['reviews', String(limit)],
    { tags: ['reviews'] },
  )(),
)

export const getTeam = cache(
  unstable_cache(
    async () => {
      const payload = await getPayloadClient()
      const res = await payload.find({
        collection: 'team-members',
        where: isPublished,
        sort: 'sortOrder',
        depth: 1,
        limit: 20,
      })
      return res.docs
    },
    ['team'],
    { tags: ['team'] },
  ),
)

export const getFaq = cache(
  unstable_cache(
    async () => {
      const payload = await getPayloadClient()
      const res = await payload.find({
        collection: 'faq-items',
        where: isPublished,
        sort: 'sortOrder',
        limit: 50,
      })
      return res.docs
    },
    ['faq'],
    { tags: ['faq'] },
  ),
)

export const getProductBySlugDraft = cache(async (slug: string) => {
  const payload = await getPayloadClient()
  const res = await payload.find({
    collection: 'products',
    where: { slug: { equals: slug } },
    depth: 1,
    limit: 1,
    draft: true,
    overrideAccess: true,
  })
  return res.docs[0] ?? null
})

export const getPortfolioDraft = cache(async (limit = 100) => {
  const payload = await getPayloadClient()
  const res = await payload.find({
    collection: 'portfolio-projects',
    sort: '-createdAt',
    depth: 1,
    limit,
    draft: true,
    overrideAccess: true,
  })
  return res.docs
})

export const getSettings = cache(
  unstable_cache(
    async () => {
      const payload = await getPayloadClient()
      return payload.findGlobal({ slug: 'site-settings' })
    },
    ['settings'],
    { tags: ['settings'] },
  ),
)
