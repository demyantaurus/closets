'use client'

import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import React, { useRef } from 'react'

import type { ImageProps } from '@/shared/lib'
import { Counter } from '@/shared/ui'

import styles from './Hero.module.scss'

const STATS = [
  { value: 12, suffix: ' лет', label: 'опыта производства' },
  { value: 500, suffix: '+', label: 'выполненных проектов' },
  { value: 2, suffix: ' года', label: 'гарантии на мебель' },
]

export function Hero({ image }: { image?: ImageProps | null }) {
  const ref = useRef<HTMLElement>(null)
  const reduced = useReducedMotion()
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  })
  const y = useTransform(scrollYProgress, [0, 1], ['0%', reduced ? '0%' : '25%'])
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, reduced ? 1 : 0])

  return (
    <section ref={ref} className={`${styles.hero} ${image ? styles.withImage : ''}`}>
      {image && (
        <div className={styles.bg} aria-hidden="true">
          <Image
            className={styles.bgImage}
            src={image.src}
            alt=""
            fill
            priority
            fetchPriority="high"
            sizes="100vw"
            placeholder={image.blurDataURL ? 'blur' : undefined}
            blurDataURL={image.blurDataURL}
          />
          <span className={styles.bgOverlay} />
        </div>
      )}
      <div className={styles.backdrop} aria-hidden="true">
        {!image && (
          <>
            <span className={styles.blobOne} />
            <span className={styles.blobTwo} />
            <svg
              className={styles.signature}
              viewBox="0 0 600 600"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g className={styles.rings} fill="none" strokeLinecap="round">
                <circle cx="300" cy="300" r="60" stroke="var(--line)" strokeWidth="1.4" />
                <circle cx="300" cy="300" r="95" stroke="var(--line)" strokeWidth="1" />
                <circle cx="300" cy="300" r="128" stroke="var(--ring-glow-strong)" strokeWidth="1.6" />
                <circle cx="300" cy="300" r="150" stroke="var(--line)" strokeWidth="1" />
                <circle cx="300" cy="300" r="184" stroke="var(--line)" strokeWidth="1.2" />
                <circle cx="300" cy="300" r="205" stroke="var(--ring-glow)" strokeWidth="1" />
                <circle cx="300" cy="300" r="238" stroke="var(--line)" strokeWidth="1" />
                <circle cx="300" cy="300" r="270" stroke="var(--ring-glow-soft)" strokeWidth="1" />
              </g>
              <g className={styles.door}>
                <g transform="translate(300,300)">
                  <rect
                    className={styles.doorPath}
                    x="-140"
                    y="-150"
                    width="280"
                    height="300"
                    rx="4"
                    fill="none"
                    stroke="var(--oak-bright)"
                    strokeWidth="2.5"
                  />
                  <line
                    className={styles.doorDivider}
                    x1="0"
                    y1="-150"
                    x2="0"
                    y2="150"
                    stroke="var(--oak-bright)"
                    strokeWidth="1.8"
                  />
                  <line
                    className={styles.doorHandle}
                    x1="-18"
                    y1="-35"
                    x2="-18"
                    y2="35"
                    stroke="var(--oak-bright)"
                    strokeWidth="6"
                    strokeLinecap="round"
                  />
                  <line
                    className={styles.doorHandle}
                    x1="18"
                    y1="-35"
                    x2="18"
                    y2="35"
                    stroke="var(--oak-bright)"
                    strokeWidth="6"
                    strokeLinecap="round"
                  />
                  <line
                    className={styles.doorLeg}
                    x1="-118"
                    y1="150"
                    x2="-118"
                    y2="172"
                    stroke="var(--oak-bright)"
                    strokeWidth="4"
                    strokeLinecap="round"
                  />
                  <line
                    className={styles.doorLeg}
                    x1="118"
                    y1="150"
                    x2="118"
                    y2="172"
                    stroke="var(--oak-bright)"
                    strokeWidth="4"
                    strokeLinecap="round"
                  />
                </g>
              </g>
            </svg>
          </>
        )}
        <span className={styles.grain} />
      </div>

      <motion.div className={styles.inner} style={{ y, opacity }}>
        <div>
          <p className={styles.kicker}>Мебель на заказ в Минске</p>
          <h1 className={styles.title}>
            <span className={styles.titleLine}>
              <span className={styles.titleInner}>От идеи</span>
            </span>
            <span className={styles.titleLine}>
              <span className={styles.titleInner}>
                до установки<span className={styles.accent}>.</span>
              </span>
            </span>
          </h1>
          <p className={styles.subtitle}>
            Шкафы-купе, гардеробные, кухни и прихожие по индивидуальным размерам.
            Бесплатный замер и 3D-проект.
          </p>
          <div className={styles.actions}>
            <Link className={styles.primaryCta} href="/calculator">
              Рассчитать стоимость
            </Link>
            <Link className={styles.secondaryCta} href="/portfolio">
              Наши работы
            </Link>
          </div>

          <dl className={styles.stats}>
            {STATS.map((stat) => (
              <div className={styles.stat} key={stat.label}>
                <dt className={styles.statLabel}>{stat.label}</dt>
                <dd className={styles.statValue}>
                  <Counter to={stat.value} suffix={stat.suffix} />
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </motion.div>

      <div className={styles.scrollHint} aria-hidden="true">
        <span className={styles.scrollDot} />
      </div>
    </section>
  )
}
