import React from 'react'

import { getFaq } from '@/shared/api'
import { Accordion, Breadcrumbs } from '@/shared/ui'

import styles from './FaqPage.module.scss'

export async function FaqPage() {
  const items = await getFaq()

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: { '@type': 'Answer', text: item.answer },
    })),
  }

  return (
    <div className={styles.page}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className={styles.inner}>
        <Breadcrumbs items={[{ label: 'Вопросы и ответы' }]} />
        <h1 className={styles.title}>Вопросы и ответы</h1>
        <Accordion
          items={items.map((item) => ({ title: item.question, content: item.answer }))}
        />
      </div>
    </div>
  )
}
