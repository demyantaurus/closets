import React from 'react'

import { LeadForm } from '@/features/lead-form'
import { getSettings } from '@/shared/api'
import { Breadcrumbs } from '@/shared/ui'

import styles from './ContactsPage.module.scss'

export async function ContactsPage() {
  const settings = await getSettings()

  return (
    <div className={styles.page}>
      <div className={styles.inner}>
        <Breadcrumbs items={[{ label: 'Контакты' }]} />
        <h1 className={styles.title}>Контакты</h1>

        <div className={styles.layout}>
          <div className={styles.details}>
            <dl className={styles.list}>
              {settings.phones && settings.phones.length > 0 && (
                <div className={styles.row}>
                  <dt>Телефоны</dt>
                  <dd>
                    {settings.phones.map((item) => (
                      <a
                        key={item.id}
                        className={styles.phone}
                        href={`tel:${item.number.replace(/[^+0-9]/g, '')}`}
                      >
                        {item.number}
                      </a>
                    ))}
                  </dd>
                </div>
              )}
              {settings.email && (
                <div className={styles.row}>
                  <dt>Email</dt>
                  <dd>
                    <a className={styles.link} href={`mailto:${settings.email}`}>
                      {settings.email}
                    </a>
                  </dd>
                </div>
              )}
              {settings.address && (
                <div className={styles.row}>
                  <dt>Адрес</dt>
                  <dd>{settings.address}</dd>
                </div>
              )}
              {settings.workingHours && (
                <div className={styles.row}>
                  <dt>Часы работы</dt>
                  <dd>{settings.workingHours}</dd>
                </div>
              )}
            </dl>

            <div className={styles.map}>
              <iframe
                className={styles.mapFrame}
                src="https://yandex.by/map-widget/v1/?ll=27.561831%2C53.902284&z=12"
                title="Карта: как нас найти"
                loading="lazy"
                allowFullScreen
              />
            </div>
          </div>

          <div className={styles.formWrap}>
            <h2 className={styles.formTitle}>Напишите нам</h2>
            <p className={styles.formSubtitle}>Ответим в течение рабочего дня</p>
            <LeadForm type="contact" withMessage submitLabel="Отправить сообщение" />
          </div>
        </div>
      </div>
    </div>
  )
}
