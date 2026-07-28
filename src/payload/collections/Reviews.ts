import type { CollectionConfig } from 'payload'

import { isStaff, publishedOrStaff } from '../access'
import { publishedField } from '../fields/published'
import { revalidateAfterChange, revalidateAfterDelete } from '../hooks/revalidate'

export const Reviews: CollectionConfig = {
  slug: 'reviews',
  labels: {
    singular: 'Отзыв',
    plural: 'Отзывы',
  },
  admin: {
    useAsTitle: 'authorName',
    group: 'Контент',
    defaultColumns: ['authorName', 'rating', 'published'],
  },
  access: {
    read: publishedOrStaff,
    create: isStaff,
    update: isStaff,
    delete: isStaff,
  },
  hooks: {
    afterChange: [revalidateAfterChange('reviews')],
    afterDelete: [revalidateAfterDelete('reviews')],
  },
  fields: [
    {
      name: 'authorName',
      label: 'Имя автора',
      type: 'text',
      required: true,
    },
    {
      name: 'text',
      label: 'Текст отзыва',
      type: 'textarea',
      required: true,
    },
    {
      name: 'rating',
      label: 'Оценка',
      type: 'number',
      required: true,
      min: 1,
      max: 5,
      defaultValue: 5,
    },
    {
      name: 'photo',
      label: 'Фото',
      type: 'upload',
      relationTo: 'media',
    },
    publishedField,
  ],
}
