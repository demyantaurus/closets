import Link from 'next/link'
import React from 'react'

import { absoluteUrl } from '@/shared/lib'

import { JsonLd } from '../JsonLd/JsonLd'
import styles from './Breadcrumbs.module.scss'

type Crumb = { href?: string; label: string }

export function Breadcrumbs({ items }: { items: Crumb[] }) {
  const crumbs: Crumb[] = [{ href: '/', label: 'Главная' }, ...items]

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: crumbs.map((crumb, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: crumb.label,
      item: crumb.href ? absoluteUrl(crumb.href) : undefined,
    })),
  }

  return (
    <>
      <JsonLd data={jsonLd} />
      <nav className={styles.breadcrumbs} aria-label="Хлебные крошки">
        <ol>
          {crumbs.map((crumb) =>
            crumb.href ? (
              <li key={crumb.label}>
                <Link href={crumb.href}>{crumb.label}</Link>
              </li>
            ) : (
              <li key={crumb.label} aria-current="page">
                {crumb.label}
              </li>
            ),
          )}
        </ol>
      </nav>
    </>
  )
}
