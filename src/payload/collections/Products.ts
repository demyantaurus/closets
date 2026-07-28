import type { CollectionConfig } from 'payload'

import { isStaff, publishedStatusOrStaff } from '../access'
import { seoFields } from '../fields/seo'
import { slugField } from '../fields/slug'
import { revalidateAfterChange, revalidateAfterDelete } from '../hooks/revalidate'

export const Products: CollectionConfig = {
  slug: 'products',
  labels: {
    singular: 'Товар',
    plural: 'Товары',
  },
  admin: {
    useAsTitle: 'name',
    group: 'Каталог',
    defaultColumns: ['name', 'category', 'priceFrom', '_status'],
    livePreview: {
      url: async ({ data, req }) => {
        const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL ?? 'http://localhost:3000'
        const categoryId =
          typeof data.category === 'object' && data.category !== null
            ? data.category.id
            : data.category
        let path = '/catalog'
        if (categoryId && data.slug) {
          const category = await req.payload
            .findByID({ collection: 'categories', id: categoryId, depth: 0 })
            .catch(() => null)
          if (category) path = `/catalog/${category.slug}/${data.slug}`
        }
        return `${serverUrl}/next/preview?path=${encodeURIComponent(path)}`
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
    afterChange: [revalidateAfterChange('products')],
    afterDelete: [revalidateAfterDelete('products')],
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
      name: 'category',
      label: 'Категория',
      type: 'relationship',
      relationTo: 'categories',
      required: true,
    },
    {
      name: 'priceFrom',
      label: 'Цена от (BYN)',
      type: 'number',
      min: 0,
    },
    {
      name: 'description',
      label: 'Описание',
      type: 'richText',
    },
    {
      name: 'gallery',
      label: 'Галерея',
      type: 'upload',
      relationTo: 'media',
      hasMany: true,
    },
    {
      name: 'specs',
      label: 'Характеристики',
      type: 'array',
      fields: [
        {
          name: 'name',
          label: 'Название',
          type: 'text',
          required: true,
        },
        {
          name: 'value',
          label: 'Значение',
          type: 'text',
          required: true,
        },
      ],
    },
    seoFields,
  ],
}
