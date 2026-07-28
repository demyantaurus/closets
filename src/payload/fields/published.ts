import type { Field } from 'payload'

export const publishedField: Field = {
  name: 'published',
  label: 'Опубликовано',
  type: 'checkbox',
  defaultValue: true,
  index: true,
  admin: {
    position: 'sidebar',
    description: 'Снимите галочку, чтобы скрыть запись с сайта, не удаляя её.',
  },
}
