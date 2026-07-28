import type { Metadata } from 'next'
import React from 'react'

import { CalculatorPage } from '@/views/calculator'

export const metadata: Metadata = {
  title: 'Калькулятор стоимости мебели',
  description:
    'Рассчитайте предварительную стоимость мебели на заказ за 1 минуту и получите скидку 100 BYN.',
}

export default function Page() {
  return <CalculatorPage />
}
