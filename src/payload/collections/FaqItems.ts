import type { CollectionConfig } from 'payload'

import { isStaff, publishedOrStaff } from '../access'
import { publishedField } from '../fields/published'
import { revalidateAfterChange, revalidateAfterDelete } from '../hooks/revalidate'

export const FaqItems: CollectionConfig = {
  slug: 'faq-items',
  labels: {
    singular: 'Вопрос',
    plural: 'FAQ',
  },
  admin: {
    useAsTitle: 'question',
    group: 'Контент',
    defaultColumns: ['question', 'sortOrder', 'published'],
  },
  defaultSort: 'sortOrder',
  access: {
    read: publishedOrStaff,
    create: isStaff,
    update: isStaff,
    delete: isStaff,
  },
  hooks: {
    afterChange: [revalidateAfterChange('faq')],
    afterDelete: [revalidateAfterDelete('faq')],
  },
  fields: [
    {
      name: 'question',
      label: 'Вопрос',
      type: 'text',
      required: true,
    },
    {
      name: 'answer',
      label: 'Ответ',
      type: 'textarea',
      required: true,
    },
    {
      name: 'sortOrder',
      label: 'Порядок',
      type: 'number',
      defaultValue: 0,
      admin: {
        position: 'sidebar',
      },
    },
    publishedField,
  ],
}
