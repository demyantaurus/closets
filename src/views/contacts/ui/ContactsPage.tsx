import React from 'react'

import { LeadForm } from '@/features/lead-form'
import { getSettings } from '@/shared/api'
import { telHref } from '@/shared/lib'
import { Breadcrumbs } from '@/shared/ui'

import { ContactMap } from './ContactMap'
import styles from './ContactsPage.module.scss'

export async function ContactsPage() {
  const { phones, email, address, workingHours } = await getSettings()

  return (
    <div className={styles.page}>
      <div className={styles.inner}>
        <Breadcrumbs items={[{ label: 'Контакты' }]} />
        <h1 className={styles.title}>Контакты</h1>

        <div className={styles.layout}>
          <div className={styles.details}>
            <dl className={styles.list}>
              {phones?.length ? (
                <div className={styles.row}>
                  <dt>Телефоны</dt>
                  <dd>
                    {phones.map((item) => (
                      <a key={item.id} className={styles.phone} href={telHref(item.number)}>
                        {item.number}
                      </a>
                    ))}
                  </dd>
                </div>
              ) : null}
              {email && (
                <div className={styles.row}>
                  <dt>Email</dt>
                  <dd>
                    <a className={styles.link} href={`mailto:${email}`}>
                      {email}
                    </a>
                  </dd>
                </div>
              )}
              {address && (
                <div className={styles.row}>
                  <dt>Адрес</dt>
                  <dd>{address}</dd>
                </div>
              )}
              {workingHours && (
                <div className={styles.row}>
                  <dt>Часы работы</dt>
                  <dd>{workingHours}</dd>
                </div>
              )}
            </dl>

            <div className={styles.map}>
              <ContactMap address={address} />
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
