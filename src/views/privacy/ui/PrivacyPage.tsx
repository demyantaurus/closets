import React from 'react'

import { Breadcrumbs } from '@/shared/ui'

import styles from './PrivacyPage.module.scss'

export function PrivacyPage() {
  return (
    <div className={styles.page}>
      <div className={styles.inner}>
        <Breadcrumbs items={[{ label: 'Политика конфиденциальности' }]} />
        <h1 className={styles.title}>Политика конфиденциальности</h1>
        <div className={styles.content}>
          <p>
            Оставляя заявку на сайте, вы даёте согласие на обработку персональных данных
            (имя, номер телефона) в целях обратной связи и подготовки расчёта стоимости.
          </p>
          <p>
            Данные не передаются третьим лицам, за исключением случаев, предусмотренных
            законодательством Республики Беларусь, и хранятся не дольше, чем это необходимо
            для обработки обращения.
          </p>
          <p>
            Вы можете запросить удаление своих данных, направив письмо на адрес электронной
            почты, указанный в разделе «Контакты».
          </p>
        </div>
      </div>
    </div>
  )
}
