import React from 'react'

import { getFaq } from '@/shared/api'
import { absoluteUrl, WEBSITE_ID } from '@/shared/lib'
import { Accordion, Breadcrumbs, JsonLd } from '@/shared/ui'

import styles from './FaqPage.module.scss'

export async function FaqPage() {
  const items = await getFaq()

  const url = absoluteUrl('/faq')
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    '@id': `${url}#faq`,
    name: 'Вопросы и ответы',
    url,
    isPartOf: { '@id': WEBSITE_ID },
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: { '@type': 'Answer', text: item.answer },
    })),
  }

  return (
    <div className={styles.page}>
      <JsonLd data={jsonLd} />
      <div className={styles.inner}>
        <Breadcrumbs items={[{ label: 'Вопросы и ответы' }]} />
        <h1 className={styles.title}>Вопросы и ответы</h1>
        <Accordion items={items.map((item) => ({ title: item.question, content: item.answer }))} />
      </div>
    </div>
  )
}
