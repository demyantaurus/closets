import React from 'react'

import type { Review } from '@/shared/api'

import styles from './ReviewCard.module.scss'

export function ReviewCard({ review }: { review: Review }) {
  return (
    <figure className={styles.card}>
      <div
        className={styles.stars}
        role="img"
        aria-label={`Оценка ${review.rating} из 5`}
      >
        {Array.from({ length: 5 }, (_, i) => (
          <span key={i} className={i < review.rating ? styles.starFilled : styles.star} aria-hidden="true">
            ★
          </span>
        ))}
      </div>
      <blockquote className={styles.text}>{review.text}</blockquote>
      <figcaption className={styles.author}>{review.authorName}</figcaption>
    </figure>
  )
}
