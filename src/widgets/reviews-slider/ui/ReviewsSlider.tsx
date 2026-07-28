'use client'

import React, { useRef, useState } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import type { Swiper as SwiperInstance } from 'swiper/types'

import { ReviewCard } from '@/entities/review'
import type { Review } from '@/shared/api'
import { ArrowIcon, SectionHeading } from '@/shared/ui'

import 'swiper/css'
import styles from './ReviewsSlider.module.scss'

export function ReviewsSlider({ reviews }: { reviews: Review[] }) {
  const swiperRef = useRef<SwiperInstance | null>(null)
  const [edges, setEdges] = useState({ isBeginning: true, isEnd: false })

  function syncEdges(swiper: SwiperInstance) {
    setEdges({ isBeginning: swiper.isBeginning, isEnd: swiper.isEnd })
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
              disabled={edges.isBeginning}
              onClick={() => swiperRef.current?.slidePrev()}
            >
              <ArrowIcon direction="left" />
            </button>
            <button
              type="button"
              className={styles.arrow}
              aria-label="Следующие отзывы"
              disabled={edges.isEnd}
              onClick={() => swiperRef.current?.slideNext()}
            >
              <ArrowIcon />
            </button>
          </div>
        </div>

        <Swiper
          className={styles.track}
          slidesPerView="auto"
          spaceBetween={20}
          grabCursor
          watchOverflow
          keyboard={{ enabled: true }}
          onSwiper={(swiper) => {
            swiperRef.current = swiper
            syncEdges(swiper)
          }}
          onSlideChange={syncEdges}
          onResize={syncEdges}
        >
          {reviews.map((review) => (
            <SwiperSlide className={styles.slide} key={review.id}>
              <ReviewCard review={review} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  )
}
