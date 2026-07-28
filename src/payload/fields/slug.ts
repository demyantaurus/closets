import type { Field } from 'payload'

import { slugify } from '../utils/slugify'

export const slugField = (source: string): Field => ({
  name: 'slug',
  type: 'text',
  unique: true,
  index: true,
  admin: {
    position: 'sidebar',
    description: 'Заполняется автоматически из названия',
  },
  hooks: {
    beforeValidate: [
      ({ value, data }) => {
        if (typeof value === 'string' && value.length > 0) return slugify(value)
        const sourceValue = data?.[source]
        return typeof sourceValue === 'string' ? slugify(sourceValue) : value
      },
    ],
  },
})
