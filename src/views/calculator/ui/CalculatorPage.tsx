import React from 'react'

import { Calculator } from '@/features/cost-calculator'
import { Breadcrumbs } from '@/shared/ui'

import styles from './CalculatorPage.module.scss'

const BENEFITS = [
  'Скидка 100 BYN при заказе через калькулятор',
  'Расчёт стоимости в течение рабочего дня',
  'Бесплатный замер и 3D-проект',
]

export function CalculatorPage() {
  return (
    <div className={styles.page}>
      <div className={styles.inner}>
        <Breadcrumbs items={[{ label: 'Калькулятор' }]} />
        <div className={styles.layout}>
          <div>
            <h1 className={styles.title}>Рассчитайте стоимость мебели</h1>
            <p className={styles.subtitle}>
              Ответьте на 4 вопроса — подготовим предварительный расчёт и закрепим скидку
            </p>
            <ul className={styles.benefits}>
              {BENEFITS.map((benefit) => (
                <li className={styles.benefit} key={benefit}>
                  <span className={styles.check} aria-hidden="true">
                    ✓
                  </span>
                  {benefit}
                </li>
              ))}
            </ul>
          </div>
          <div className={styles.calculatorWrap}>
            <Calculator />
          </div>
        </div>
      </div>
    </div>
  )
}
