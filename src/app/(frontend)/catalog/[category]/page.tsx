import type { Metadata } from 'next'
import React from 'react'

import { getCategoryBySlug } from '@/shared/api'
import { CategoryPage } from '@/views/category'

type Props = { params: Promise<{ category: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category: slug } = await params
  const category = await getCategoryBySlug(slug)
  if (!category) return {}
  return {
    title: category.seo?.title ?? `${category.name} на заказ в Минске`,
    description: category.seo?.description ?? category.description ?? undefined,
  }
}

export default async function Page({ params }: Props) {
  const { category } = await params
  return <CategoryPage slug={category} />
}
