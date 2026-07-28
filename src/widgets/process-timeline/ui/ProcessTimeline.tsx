'use client'

import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import React, { useRef } from 'react'

import { RevealGroup, RevealItem, SectionHeading } from '@/shared/ui'

import styles from './ProcessTimeline.module.scss'

const STEPS = [
  { title: 'Заявка', text: 'Оставьте заявку или пройдите калькулятор — перезвоним за 15 минут.' },
  { title: 'Замер', text: 'Бесплатно приедем, измерим помещение и обсудим пожелания.' },
  { title: '3D-проект', text: 'Подготовим визуализацию и точную смету. Правки — бесплатно.' },
  { title: 'Производство', text: 'Изготовим мебель на собственном производстве за 14–21 день.' },
  { title: 'Доставка и монтаж', text: 'Привезём, соберём и уберём за собой. Гарантия 2 года.' },
]

export function ProcessTimeline() {
  const ref = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start 0.8', 'end 0.6'],
  })
  const scaleY = useTransform(scrollYProgress, [0, 1], [0, 1])

  return (
    <section className={styles.section} aria-labelledby="process-title">
      <div className={styles.inner}>
        <SectionHeading
          kicker="Как мы работаем"
          title="Пять шагов до новой мебели"
          onDark
        />
        <div className={styles.timeline} ref={ref}>
          <div className={styles.track} aria-hidden="true">
            <motion.span
              className={styles.trackFill}
              style={reduced ? { scaleY: 1 } : { scaleY }}
            />
          </div>
          <RevealGroup className={styles.steps}>
            {STEPS.map((step, index) => (
              <RevealItem className={styles.step} key={step.title}>
                <span className={styles.node} aria-hidden="true">
                  {index + 1}
                </span>
                <div>
                  <h3 className={styles.stepTitle}>{step.title}</h3>
                  <p className={styles.stepText}>{step.text}</p>
                </div>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </div>
    </section>
  )
}
