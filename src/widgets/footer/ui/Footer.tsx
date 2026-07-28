import Link from 'next/link'
import React from 'react'

import { getSettings } from '@/shared/api'
import { telHref } from '@/shared/lib'

import styles from './Footer.module.scss'

const FOOTER_LINKS = [
  { href: '/catalog', label: 'Каталог' },
  { href: '/portfolio', label: 'Портфолио' },
  { href: '/calculator', label: 'Калькулятор' },
  { href: '/faq', label: 'Вопросы и ответы' },
  { href: '/contacts', label: 'Контакты' },
  { href: '/privacy', label: 'Политика конфиденциальности' },
]

export async function Footer() {
  const settings = await getSettings()
  const year = new Date().getFullYear()

  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.brand}>
          <p className={styles.logo}>
            Closets<span className={styles.logoDot}>.</span>
          </p>
          <p className={styles.tagline}>Мебель на заказ в Минске — от идеи до установки</p>
        </div>

        <nav className={styles.nav} aria-label="Навигация в подвале">
          <ul className={styles.navList}>
            {FOOTER_LINKS.map((link) => (
              <li key={link.href}>
                <Link className={styles.link} href={link.href}>
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className={styles.contacts}>
          {settings.phones?.map((item) => (
            <a key={item.id} className={styles.phone} href={telHref(item.number)}>
              {item.number}
            </a>
          ))}
          {settings.email && (
            <a className={styles.link} href={`mailto:${settings.email}`}>
              {settings.email}
            </a>
          )}
          {settings.address && <p className={styles.muted}>{settings.address}</p>}
          {settings.workingHours && <p className={styles.muted}>{settings.workingHours}</p>}
          <div className={styles.socials}>
            {settings.socials?.telegram && (
              <a className={styles.social} href={settings.socials.telegram} aria-label="Telegram">
                Telegram
              </a>
            )}
            {settings.socials?.whatsapp && (
              <a className={styles.social} href={settings.socials.whatsapp} aria-label="WhatsApp">
                WhatsApp
              </a>
            )}
            {settings.socials?.instagram && (
              <a className={styles.social} href={settings.socials.instagram} aria-label="Instagram">
                Instagram
              </a>
            )}
          </div>
        </div>
      </div>
      <div className={styles.bottom}>
        <p>© {year} Closets. Все права защищены.</p>
      </div>
    </footer>
  )
}
