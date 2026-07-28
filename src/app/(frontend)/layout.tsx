import type { Metadata } from 'next'
import { Golos_Text, Playfair_Display } from 'next/font/google'
import React from 'react'

import { FloatingCallback } from '@/features/lead-form'
import { getSettings } from '@/shared/api'
import { Footer } from '@/widgets/footer'
import { Header } from '@/widgets/header'

import '@/shared/styles/globals.scss'
import { Metrika } from './metrika'
import styles from './layout.module.scss'

const display = Playfair_Display({
  subsets: ['latin', 'cyrillic'],
  variable: '--font-display',
})

const body = Golos_Text({
  subsets: ['latin', 'cyrillic'],
  variable: '--font-body',
})

export const dynamic = 'force-dynamic'

const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL ?? 'http://localhost:3000'

export const metadata: Metadata = {
  metadataBase: new URL(SERVER_URL),
  title: {
    default: 'Мебель на заказ в Минске — шкафы-купе, кухни, гардеробные | Closets',
    template: '%s | Closets',
  },
  description:
    'Изготовление корпусной мебели на заказ в Минске: шкафы-купе, гардеробные, кухни, прихожие. Бесплатный замер и 3D-проект, рассрочка до 36 месяцев, гарантия 2 года.',
  openGraph: {
    type: 'website',
    locale: 'ru_RU',
    siteName: 'Closets',
  },
}

export default async function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props
  const settings = await getSettings()

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: 'Closets',
    description: 'Мебель на заказ в Минске: шкафы-купе, гардеробные, кухни, прихожие',
    url: SERVER_URL,
    telephone: settings.phones?.[0]?.number,
    email: settings.email,
    address: settings.address
      ? {
          '@type': 'PostalAddress',
          streetAddress: settings.address,
          addressLocality: 'Минск',
          addressCountry: 'BY',
        }
      : undefined,
  }

  return (
    <html
      lang="ru"
      data-theme={settings.theme ?? 'premium'}
      className={`${display.variable} ${body.variable}`}
    >
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <a className={styles.skipLink} href="#main">
          Перейти к содержимому
        </a>
        <Header />
        <main id="main">{children}</main>
        <Footer />
        <FloatingCallback />
        <Metrika />
      </body>
    </html>
  )
}
