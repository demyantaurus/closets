import type { Metadata } from 'next'
import React from 'react'

import { ContactsPage } from '@/views/contacts'

export const metadata: Metadata = {
  title: 'Контакты',
  description:
    'Контакты Closets: телефоны, адрес шоурума в Минске, часы работы и форма обратной связи.',
}

export default function Page() {
  return <ContactsPage />
}
