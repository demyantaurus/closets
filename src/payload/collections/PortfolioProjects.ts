import type { CollectionConfig } from 'payload'

import { isStaff, publishedStatusOrStaff } from '../access'
import { seoFields } from '../fields/seo'
import { slugField } from '../fields/slug'
import { revalidateAfterChange, revalidateAfterDelete } from '../hooks/revalidate'

export const PortfolioProjects: CollectionConfig = {
  slug: 'portfolio-projects',
  labels: {
    singular: 'Проект',
    plural: 'Портфолио',
  },
  admin: {
    useAsTitle: 'title',
    group: 'Контент',
    defaultColumns: ['title', 'category', '_status'],
    livePreview: {
      url: () => {
        const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL ?? 'http://localhost:3000'
        return `${serverUrl}/next/preview?path=${encodeURIComponent('/portfolio')}`
      },
    },
  },
  versions: {
    drafts: true,
  },
  access: {
    read: publishedStatusOrStaff,
    create: isStaff,
    update: isStaff,
    delete: isStaff,
  },
  hooks: {
    afterChange: [revalidateAfterChange('portfolio')],
    afterDelete: [revalidateAfterDelete('portfolio')],
  },
  fields: [
    {
      name: 'title',
      label: 'Название',
      type: 'text',
      required: true,
    },
    slugField('title'),
    {
      name: 'category',
      label: 'Категория',
      type: 'relationship',
      relationTo: 'categories',
    },
    {
      name: 'description',
      label: 'Описание',
      type: 'textarea',
    },
    {
      name: 'gallery',
      label: 'Галерея',
      type: 'upload',
      relationTo: 'media',
      hasMany: true,
      required: true,
    },
    seoFields,
  ],
}
