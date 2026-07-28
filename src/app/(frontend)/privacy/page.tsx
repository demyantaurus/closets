import type { Metadata } from 'next'
import React from 'react'

import { PrivacyPage } from '@/views/privacy'

export const metadata: Metadata = {
  title: 'Политика конфиденциальности',
  robots: { index: false },
}

export default function Page() {
  return <PrivacyPage />
}
