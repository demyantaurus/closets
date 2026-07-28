import type { Metadata } from 'next'
import React from 'react'

import { PortfolioPage } from '@/views/portfolio'

export const metadata: Metadata = {
  title: 'Наши работы — портфолио',
  description:
    'Фотографии выполненных проектов: шкафы-купе, гардеробные, кухни и прихожие на заказ в Минске.',
}

export default function Page() {
  return <PortfolioPage />
}
