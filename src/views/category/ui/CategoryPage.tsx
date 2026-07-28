import { notFound } from 'next/navigation'
import React from 'react'

import { ProductCard } from '@/entities/product'
import { getCategoryBySlug, getProducts } from '@/shared/api'
import { absoluteUrl, WEBSITE_ID } from '@/shared/lib'
import { Breadcrumbs, JsonLd, RevealGroup, RevealItem } from '@/shared/ui'

import styles from './CategoryPage.module.scss'

export async function CategoryPage({ slug }: { slug: string }) {
  const category = await getCategoryBySlug(slug)
  if (!category) notFound()
  const products = await getProducts(category.id)

  const url = absoluteUrl(`/catalog/${category.slug}`)
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    '@id': `${url}#collection`,
    name: category.name,
    url,
    description: category.seo?.description ?? category.description ?? undefined,
    isPartOf: { '@id': WEBSITE_ID },
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: products.length,
      itemListElement: products.map((product, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: product.name,
        url: absoluteUrl(`/catalog/${category.slug}/${product.slug}`),
      })),
    },
  }

  return (
    <div className={styles.page}>
      <JsonLd data={jsonLd} />
      <div className={styles.inner}>
        <Breadcrumbs items={[{ href: '/catalog', label: 'Каталог' }, { label: category.name }]} />
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
