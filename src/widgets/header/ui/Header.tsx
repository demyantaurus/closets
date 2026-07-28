import React from 'react'

import { getSettings } from '@/shared/api'

import { HeaderClient } from './HeaderClient'

export const NAV_LINKS = [
  { href: '/catalog', label: 'Каталог' },
  { href: '/portfolio', label: 'Портфолио' },
  { href: '/calculator', label: 'Калькулятор' },
  { href: '/faq', label: 'Вопросы' },
  { href: '/contacts', label: 'Контакты' },
]

export async function Header() {
  const settings = await getSettings()
  const phone = settings.phones?.[0]?.number ?? undefined
  const banner =
    settings.discountBanner?.enabled && settings.discountBanner.text
      ? {
          text: settings.discountBanner.text,
          link: settings.discountBanner.link ?? '/calculator',
        }
      : null
  return <HeaderClient links={NAV_LINKS} phone={phone} banner={banner} />
}
