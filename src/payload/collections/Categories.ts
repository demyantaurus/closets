import type { CollectionConfig } from 'payload'

import { isStaff, publishedOrStaff } from '../access'
import { publishedField } from '../fields/published'
import { seoFields } from '../fields/seo'
import { slugField } from '../fields/slug'
import { revalidateAfterChange, revalidateAfterDelete } from '../hooks/revalidate'

export const Categories: CollectionConfig = {
  slug: 'categories',
  labels: {
    singular: 'Категория',
    plural: 'Категории',
  },
  admin: {
    useAsTitle: 'name',
    group: 'Каталог',
    defaultColumns: ['name', 'slug', 'sortOrder', 'published'],
  },
  defaultSort: 'sortOrder',
  access: {
    read: publishedOrStaff,
    create: isStaff,
    update: isStaff,
    delete: isStaff,
  },
  hooks: {
    afterChange: [revalidateAfterChange('categories')],
    afterDelete: [revalidateAfterDelete('categories')],
  },
  fields: [
    {
      name: 'name',
      label: 'Название',
      type: 'text',
      required: true,
    },
    slugField('name'),
    {
      name: 'description',
      label: 'Описание',
      type: 'textarea',
    },
    {
      name: 'image',
      label: 'Изображение',
      type: 'upload',
      relationTo: 'media',
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
    seoFields,
  ],
}
