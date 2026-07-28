import { draftMode } from 'next/headers'
import React from 'react'

import { PortfolioGallery } from '@/widgets/portfolio-gallery'
import { getCategories, getPortfolio, getPortfolioDraft } from '@/shared/api'
import { absoluteImageUrl, absoluteUrl, isMedia, WEBSITE_ID } from '@/shared/lib'
import { Breadcrumbs, JsonLd, RefreshRouteOnSave } from '@/shared/ui'

import styles from './PortfolioPage.module.scss'

export async function PortfolioPage() {
  const { isEnabled: draft } = await draftMode()
  const [projects, categories] = await Promise.all([
    draft ? getPortfolioDraft() : getPortfolio(),
    getCategories(),
  ])

  const url = absoluteUrl('/portfolio')
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    '@id': `${url}#portfolio`,
    name: 'Наши работы',
    url,
    description: 'Реальные проекты мебели на заказ: замер, 3D-визуализация, производство и монтаж',
    isPartOf: { '@id': WEBSITE_ID },
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: projects.length,
      itemListElement: projects.map((project, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        item: {
          '@type': 'ImageObject',
          name: project.title,
          description: project.description ?? undefined,
          contentUrl: absoluteImageUrl(project.gallery?.find(isMedia), 'gallery'),
        },
      })),
    },
  }

  return (
    <div className={styles.page}>
      {draft && <RefreshRouteOnSave />}
      {!draft && <JsonLd data={jsonLd} />}
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
