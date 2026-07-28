import { draftMode } from 'next/headers'
import React from 'react'

import { PortfolioGallery } from '@/widgets/portfolio-gallery'
import { getCategories, getPortfolio, getPortfolioDraft } from '@/shared/api'
import { Breadcrumbs, RefreshRouteOnSave } from '@/shared/ui'

import styles from './PortfolioPage.module.scss'

export async function PortfolioPage() {
  const { isEnabled: draft } = await draftMode()
  const [projects, categories] = await Promise.all([
    draft ? getPortfolioDraft() : getPortfolio(),
    getCategories(),
  ])

  return (
    <div className={styles.page}>
      {draft && <RefreshRouteOnSave />}
      <div className={styles.inner}>
        <Breadcrumbs items={[{ label: 'Портфолио' }]} />
        <h1 className={styles.title}>Наши работы</h1>
        <p className={styles.subtitle}>
          Реальные проекты, которые мы спроектировали, изготовили и установили
        </p>
        <PortfolioGallery projects={projects} categories={categories} />
      </div>
    </div>
  )
}
