import React from 'react'

import { CategoryCard } from '@/entities/category'
import { getCategories } from '@/shared/api'
import { RevealGroup, RevealItem, SectionHeading } from '@/shared/ui'

import styles from './FeaturedCategories.module.scss'

export async function FeaturedCategories() {
  const categories = await getCategories()

  return (
    <section className={styles.section} aria-labelledby="categories-title">
      <div className={styles.inner}>
        <SectionHeading
          kicker="Каталог"
          title="Что мы делаем"
          description="Любая корпусная мебель по вашим размерам — от эскиза до монтажа"
        />
        <RevealGroup className={styles.grid}>
          {categories.map((category) => (
            <RevealItem key={category.id}>
              <CategoryCard category={category} />
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  )
}
