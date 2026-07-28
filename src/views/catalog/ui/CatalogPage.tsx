import React from 'react'

import { CategoryCard } from '@/entities/category'
import { getCategories } from '@/shared/api'
import { absoluteUrl, WEBSITE_ID } from '@/shared/lib'
import { Breadcrumbs, JsonLd, RevealGroup, RevealItem } from '@/shared/ui'

import styles from './CatalogPage.module.scss'

export async function CatalogPage() {
  const categories = await getCategories()

  const url = absoluteUrl('/catalog')
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    '@id': `${url}#collection`,
    name: 'Каталог мебели',
    url,
    description: 'Каталог корпусной мебели на заказ: шкафы-купе, гардеробные, кухни, прихожие',
    isPartOf: { '@id': WEBSITE_ID },
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: categories.length,
      itemListElement: categories.map((category, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: category.name,
        url: absoluteUrl(`/catalog/${category.slug}`),
      })),
    },
  }

  return (
    <div className={styles.page}>
      <JsonLd data={jsonLd} />
      <div className={styles.inner}>
        <Breadcrumbs items={[{ label: 'Каталог' }]} />
        <h1 className={styles.title}>Каталог мебели</h1>
        <p className={styles.subtitle}>Выберите направление — покажем варианты и цены</p>
        <RevealGroup className={styles.grid}>
          {categories.map((category) => (
            <RevealItem key={category.id}>
              <CategoryCard category={category} />
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </div>
  )
}
