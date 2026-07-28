import Link from 'next/link'
import React from 'react'

import styles from './Breadcrumbs.module.scss'

type Crumb = { href?: string; label: string }

export function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <nav className={styles.breadcrumbs} aria-label="Хлебные крошки">
      <ol>
        <li>
          <Link href="/">Главная</Link>
        </li>
        {items.map((item) =>
          item.href ? (
            <li key={item.label}>
              <Link href={item.href}>{item.label}</Link>
            </li>
          ) : (
            <li key={item.label} aria-current="page">
              {item.label}
            </li>
          ),
        )}
      </ol>
    </nav>
  )
}
