import type { Metadata } from 'next'
import React from 'react'

import { FaqPage } from '@/views/faq'

export const metadata: Metadata = {
  title: 'Вопросы и ответы',
  description:
    'Ответы на частые вопросы о заказе мебели: сроки, замер, рассрочка, гарантия, 3D-проект.',
}

export default function Page() {
  return <FaqPage />
}
