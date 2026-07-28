import React from 'react'

import { CategoryCard } from '@/entities/category'
import { getCategories } from '@/shared/api'
import { Breadcrumbs, RevealGroup, RevealItem } from '@/shared/ui'

import styles from './CatalogPage.module.scss'

export async function CatalogPage() {
  const categories = await getCategories()

  return (
    <div className={styles.page}>
      <div className={styles.inner}>
        <Breadcrumbs items={[{ label: 'Каталог' }]} />
        <h1 className={styles.title}>Каталог мебели</h1>
        <p className={styles.subtitle}>
          Выберите направление — покажем варианты и цены
        </p>
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
