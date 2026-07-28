import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

import type { Category } from '@/shared/api'
import { imageProps } from '@/shared/lib'

import styles from './CategoryCard.module.scss'

export function CategoryCard({ category }: { category: Category }) {
  const image = imageProps(category.image, 'card')
  return (
    <Link className={styles.card} href={`/catalog/${category.slug}`}>
      <span className={styles.imageWrap}>
        {image && (
          <Image
            className={styles.image}
            src={image.src}
            alt={image.alt}
            fill
            sizes="(min-width: 1920px) 366px, (max-width: 768px) 50vw, 25vw"
            placeholder={image.blurDataURL ? 'blur' : undefined}
            blurDataURL={image.blurDataURL}
          />
        )}
      </span>
      <span className={styles.body}>
        <span className={styles.name}>{category.name}</span>
        <span className={styles.arrow} aria-hidden="true">
          →
        </span>
      </span>
    </Link>
  )
}
