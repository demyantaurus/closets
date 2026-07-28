import type { GlobalConfig } from 'payload'

import { anyone, isStaff } from '../access'
import { revalidateGlobal } from '../hooks/revalidate'

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  label: 'Настройки сайта',
  admin: {
    group: 'Система',
  },
  access: {
    read: anyone,
    update: isStaff,
  },
  hooks: {
    afterChange: [revalidateGlobal('settings')],
  },
  fields: [
    {
      name: 'theme',
      label: 'Тема оформления',
      type: 'select',
      required: true,
      defaultValue: 'premium',
      options: [
        { label: 'Премиум (тёмная, шоурум)', value: 'premium' },
        { label: 'Светлая (маркетплейс)', value: 'bright' },
      ],
      admin: {
        description: 'Меняет цвета, шрифты заголовков и форму кнопок на всём сайте.',
      },
    },
    {
      name: 'heroImage',
      label: 'Фон первого экрана (главная)',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description:
          'Фотография на весь первый экран главной страницы. Без неё показывается градиентный фон.',
      },
    },
    {
      name: 'phones',
      label: 'Телефоны',
      type: 'array',
      fields: [
        {
          name: 'number',
          label: 'Номер',
          type: 'text',
          required: true,
        },
      ],
    },
    {
      name: 'email',
      label: 'Email',
      type: 'email',
    },
    {
      name: 'address',
      label: 'Адрес',
      type: 'text',
    },
    {
      name: 'workingHours',
      label: 'Часы работы',
      type: 'text',
    },
    {
      name: 'socials',
      label: 'Мессенджеры и соцсети',
      type: 'group',
      fields: [
        { name: 'telegram', type: 'text' },
        { name: 'viber', type: 'text' },
        { name: 'whatsapp', type: 'text' },
        { name: 'instagram', type: 'text' },
      ],
    },
    {
      name: 'discountBanner',
      label: 'Баннер со скидкой',
      type: 'group',
      fields: [
        {
          name: 'enabled',
          label: 'Показывать',
          type: 'checkbox',
          defaultValue: false,
        },
        {
          name: 'text',
          label: 'Текст',
          type: 'text',
        },
        {
          name: 'link',
          label: 'Ссылка',
          type: 'text',
          defaultValue: '/calculator',
        },
      ],
    },
  ],
}
