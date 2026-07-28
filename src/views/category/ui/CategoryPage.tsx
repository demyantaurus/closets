import { notFound } from 'next/navigation'
import React from 'react'

import { ProductCard } from '@/entities/product'
import { getCategoryBySlug, getProducts } from '@/shared/api'
import { Breadcrumbs, RevealGroup, RevealItem } from '@/shared/ui'

import styles from './CategoryPage.module.scss'

export async function CategoryPage({ slug }: { slug: string }) {
  const category = await getCategoryBySlug(slug)
  if (!category) notFound()
  const products = await getProducts(category.id)

  return (
    <div className={styles.page}>
      <div className={styles.inner}>
        <Breadcrumbs
          items={[{ href: '/catalog', label: 'Каталог' }, { label: category.name }]}
        />
        <h1 className={styles.title}>{category.name}</h1>
        {category.description && <p className={styles.subtitle}>{category.description}</p>}
        {products.length > 0 ? (
          <RevealGroup className={styles.grid}>
            {products.map((product) => (
              <RevealItem key={product.id}>
                <ProductCard product={product} categorySlug={slug} />
              </RevealItem>
            ))}
          </RevealGroup>
        ) : (
          <p className={styles.empty}>В этой категории пока нет товаров.</p>
        )}
      </div>
    </div>
  )
}
