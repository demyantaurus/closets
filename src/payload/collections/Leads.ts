import type { CollectionConfig } from 'payload'

import { anyone, isAdmin, isStaff } from '../access'
import { notifyLead } from '../hooks/notifyLead'

function csvEscape(value: unknown): string {
  return `"${String(value ?? '').replaceAll('"', '""')}"`
}

export const Leads: CollectionConfig = {
  slug: 'leads',
  labels: {
    singular: 'Заявка',
    plural: 'Заявки',
  },
  admin: {
    useAsTitle: 'name',
    group: 'Продажи',
    defaultColumns: ['name', 'phone', 'type', 'status', 'createdAt'],
    listSearchableFields: ['name', 'phone', 'message'],
    components: {
      beforeListTable: ['/payload/components/ExportLeadsButton#ExportLeadsButton'],
    },
  },
  defaultSort: '-createdAt',
  endpoints: [
    {
      path: '/export',
      method: 'get',
      handler: async (req) => {
        if (!req.user) {
          return Response.json({ error: 'Unauthorized' }, { status: 403 })
        }
        const { docs } = await req.payload.find({
          collection: 'leads',
          sort: '-createdAt',
          limit: 10000,
          depth: 0,
        })
        const header = ['ID', 'Тип', 'Имя', 'Телефон', 'Сообщение', 'Детали', 'Статус', 'Создана']
        const rows = docs.map((lead) =>
          [
            lead.id,
            lead.type,
            lead.name,
            lead.phone,
            lead.message ?? '',
            lead.details ? JSON.stringify(lead.details) : '',
            lead.status,
            new Date(lead.createdAt).toLocaleString('ru-RU'),
          ]
            .map(csvEscape)
            .join(';'),
        )
        const csv = '\ufeff' + [header.map(csvEscape).join(';'), ...rows].join('\n')
        return new Response(csv, {
          headers: {
            'content-type': 'text/csv; charset=utf-8',
            'content-disposition': 'attachment; filename="leads.csv"',
          },
        })
      },
    },
  ],
  access: {
    create: anyone,
    read: isStaff,
    update: isStaff,
    delete: isAdmin,
  },
  hooks: {
    afterChange: [notifyLead],
  },
  fields: [
    {
      name: 'type',
      label: 'Тип заявки',
      type: 'select',
      required: true,
      options: [
        { label: 'Обратный звонок', value: 'callback' },
        { label: 'Калькулятор стоимости', value: 'calculator' },
        { label: '3D-проект', value: 'project3d' },
        { label: 'Контактная форма', value: 'contact' },
      ],
    },
    {
      name: 'name',
      label: 'Имя',
      type: 'text',
      required: true,
    },
    {
      name: 'phone',
      label: 'Телефон',
      type: 'text',
      required: true,
    },
    {
      name: 'message',
      label: 'Сообщение',
      type: 'textarea',
    },
    {
      name: 'details',
      label: 'Детали (ответы калькулятора)',
      type: 'json',
    },
    {
      name: 'status',
      label: 'Статус',
      type: 'select',
      required: true,
      defaultValue: 'new',
      options: [
        { label: 'Новая', value: 'new' },
        { label: 'В работе', value: 'inProgress' },
        { label: 'Закрыта', value: 'closed' },
      ],
      access: {
        create: ({ req }) => Boolean(req.user),
      },
      admin: {
        position: 'sidebar',
      },
    },
  ],
}
