import type { Metadata } from 'next'
import React from 'react'

import { CatalogPage } from '@/views/catalog'

export const metadata: Metadata = {
  title: 'Каталог мебели на заказ',
  description:
    'Каталог корпусной мебели на заказ: шкафы-купе, гардеробные, кухни, прихожие, спальни. Цены и примеры работ.',
}

export default function Page() {
  return <CatalogPage />
}
