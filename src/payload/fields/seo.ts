import type { Field } from 'payload'

export const seoFields: Field = {
  name: 'seo',
  label: 'SEO',
  type: 'group',
  fields: [
    {
      name: 'title',
      label: 'Meta title',
      type: 'text',
    },
    {
      name: 'description',
      label: 'Meta description',
      type: 'textarea',
    },
  ],
}
