import type { CollectionConfig } from 'payload'

import { isStaff, publishedOrStaff } from '../access'
import { publishedField } from '../fields/published'
import { revalidateAfterChange, revalidateAfterDelete } from '../hooks/revalidate'

export const TeamMembers: CollectionConfig = {
  slug: 'team-members',
  labels: {
    singular: 'Сотрудник',
    plural: 'Команда',
  },
  admin: {
    useAsTitle: 'name',
    group: 'Контент',
    defaultColumns: ['name', 'role', 'sortOrder', 'published'],
  },
  defaultSort: 'sortOrder',
  access: {
    read: publishedOrStaff,
    create: isStaff,
    update: isStaff,
    delete: isStaff,
  },
  hooks: {
    afterChange: [revalidateAfterChange('team')],
    afterDelete: [revalidateAfterDelete('team')],
  },
  fields: [
    {
      name: 'name',
      label: 'Имя',
      type: 'text',
      required: true,
    },
    {
      name: 'role',
      label: 'Должность',
      type: 'text',
      required: true,
    },
    {
      name: 'photo',
      label: 'Фото',
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
  ],
}
