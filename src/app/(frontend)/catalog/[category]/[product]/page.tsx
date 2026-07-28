import type { Metadata } from 'next'
import React from 'react'

import { getProductBySlug } from '@/shared/api'
import { imageProps, isMedia } from '@/shared/lib'
import { ProductPage } from '@/views/product'

type Props = { params: Promise<{ category: string; product: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { product: slug } = await params
  const product = await getProductBySlug(slug)
  if (!product) return {}
  const image = imageProps(product.gallery?.find(isMedia), 'gallery')
  return {
    title: product.seo?.title ?? `${product.name} — цена, фото`,
    description:
      product.seo?.description ??
      `${product.name} на заказ в Минске. Бесплатный замер и 3D-проект.`,
    openGraph: image
      ? { images: [{ url: image.src, width: image.width, height: image.height }] }
      : undefined,
  }
}

export default async function Page({ params }: Props) {
  const { product } = await params
  return <ProductPage slug={product} />
}
