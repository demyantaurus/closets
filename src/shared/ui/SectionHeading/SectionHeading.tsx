import React from 'react'

import styles from './SectionHeading.module.scss'

type SectionHeadingProps = {
  kicker?: string
  title: string
  description?: string
  align?: 'left' | 'center'
  onDark?: boolean
}

export function SectionHeading({
  kicker,
  title,
  description,
  align = 'left',
  onDark = false,
}: SectionHeadingProps) {
  const classes = [
    styles.heading,
    align === 'center' ? styles.center : '',
    onDark ? styles.onDark : '',
  ]
    .filter(Boolean)
    .join(' ')
  return (
    <div className={classes}>
      {kicker && <p className={styles.kicker}>{kicker}</p>}
      <h2 className={styles.title}>{title}</h2>
      {description && <p className={styles.description}>{description}</p>}
    </div>
  )
}
