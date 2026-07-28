import Link from 'next/link'
import React from 'react'

import styles from './not-found.module.scss'

export default function NotFound() {
  return (
    <div className={styles.page}>
      <p className={styles.code}>404</p>
      <h1 className={styles.title}>Такой страницы нет</h1>
      <p className={styles.text}>
        Возможно, она была перемещена или вы перешли по устаревшей ссылке.
      </p>
      <Link className={styles.link} href="/">
        На главную
      </Link>
    </div>
  )
}
