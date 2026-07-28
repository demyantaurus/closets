import React from 'react'

import { LeadForm } from '@/features/lead-form'
import { Reveal } from '@/shared/ui'

import styles from './CtaBanner.module.scss'

export function CtaBanner() {
  return (
    <section className={styles.section} aria-labelledby="cta-title">
      <div className={styles.inner}>
        <Reveal className={styles.grid}>
          <div>
            <p className={styles.kicker}>Бесплатно</p>
            <h2 className={styles.title} id="cta-title">
              Закажите 3D-проект вашей мебели
            </h2>
            <p className={styles.text}>
              Дизайнер приедет на замер, обсудит пожелания и подготовит фотореалистичную
              визуализацию с точной сметой. Это ни к чему не обязывает.
            </p>
          </div>
          <div className={styles.formWrap}>
            <LeadForm type="project3d" submitLabel="Заказать 3D-проект" />
          </div>
        </Reveal>
      </div>
    </section>
  )
}
