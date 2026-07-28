import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

import type { Product } from '@/shared/api'
import { formatPrice, imageProps, isMedia } from '@/shared/lib'

import styles from './ProductCard.module.scss'

export function ProductCard({ product, categorySlug }: { product: Product; categorySlug: string }) {
  const first = product.gallery?.find(isMedia)
  const image = imageProps(first, 'card')
  return (
    <Link className={styles.card} href={`/catalog/${categorySlug}/${product.slug}`}>
      <span className={styles.imageWrap}>
        {image && (
          <Image
            className={styles.image}
            src={image.src}
            alt={image.alt}
            fill
            sizes="(min-width: 1920px) 288px, (min-width: 1280px) 25vw, (min-width: 1024px) 33vw, (min-width: 480px) 50vw, 100vw"
            placeholder={image.blurDataURL ? 'blur' : undefined}
            blurDataURL={image.blurDataURL}
          />
        )}
      </span>
      <span className={styles.body}>
        <span className={styles.name}>{product.name}</span>
        {typeof product.priceFrom === 'number' && (
          <span className={styles.price}>{formatPrice(product.priceFrom)}</span>
        )}
      </span>
    </Link>
  )
}
