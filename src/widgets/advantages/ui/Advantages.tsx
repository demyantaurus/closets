import React from 'react'

import { RevealGroup, RevealItem, SectionHeading } from '@/shared/ui'

import styles from './Advantages.module.scss'

const ITEMS = [
  {
    title: 'Бесплатный замер и 3D-проект',
    text: 'Выезжаем на замер по Минску и области, готовим фотореалистичную визуализацию.',
  },
  {
    title: 'Рассрочка 6–36 месяцев',
    text: 'Оформляем рассрочку без переплат — мебель сегодня, оплата частями.',
  },
  {
    title: 'Гарантия 2 года',
    text: 'Официальная гарантия на все изделия и фурнитуру, сервисная поддержка.',
  },
  {
    title: 'Собственное производство',
    text: 'Современное оборудование и контроль качества на каждом этапе.',
  },
]

export function Advantages() {
  return (
    <section className={styles.section} aria-labelledby="advantages-title">
      <div className={styles.inner}>
        <SectionHeading
          kicker="Почему мы"
          title="Работаем так, как хотели бы для себя"
        />
        <RevealGroup className={styles.grid}>
          {ITEMS.map((item, index) => (
            <RevealItem className={styles.card} key={item.title}>
              <span className={styles.number} aria-hidden="true">
                0{index + 1}
              </span>
              <h3 className={styles.cardTitle}>{item.title}</h3>
              <p className={styles.cardText}>{item.text}</p>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  )
}
