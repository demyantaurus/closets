'use client'

import React, { useRef } from 'react'

import { ReviewCard } from '@/entities/review'
import type { Review } from '@/shared/api'
import { SectionHeading } from '@/shared/ui'

import styles from './ReviewsSlider.module.scss'

export function ReviewsSlider({ reviews }: { reviews: Review[] }) {
  const trackRef = useRef<HTMLUListElement>(null)

  function scrollByCard(direction: 1 | -1) {
    const track = trackRef.current
    if (!track) return
    const card = track.querySelector('li')
    const width = card ? card.getBoundingClientRect().width + 20 : 340
    track.scrollBy({ left: direction * width, behavior: 'smooth' })
  }

  if (reviews.length === 0) return null

  return (
    <section className={styles.section} aria-labelledby="reviews-title">
      <div className={styles.inner}>
        <div className={styles.head}>
          <SectionHeading kicker="Отзывы" title="Что говорят клиенты" />
          <div className={styles.arrows}>
            <button
              type="button"
              className={styles.arrow}
              aria-label="Предыдущие отзывы"
              onClick={() => scrollByCard(-1)}
            >
              ←
            </button>
            <button
              type="button"
              className={styles.arrow}
              aria-label="Следующие отзывы"
              onClick={() => scrollByCard(1)}
            >
              →
            </button>
          </div>
        </div>

        <ul className={styles.track} ref={trackRef}>
          {reviews.map((review) => (
            <li className={styles.slide} key={review.id}>
              <ReviewCard review={review} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
