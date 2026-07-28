import type { CollectionConfig } from 'payload'
import path from 'path'
import sharp from 'sharp'

import { anyone, isStaff } from '../access'

export const Media: CollectionConfig = {
  slug: 'media',
  labels: {
    singular: 'Файл',
    plural: 'Медиа',
  },
  admin: {
    group: 'Контент',
  },
  access: {
    read: anyone,
    create: isStaff,
    update: isStaff,
    delete: isStaff,
  },
  fields: [
    {
      name: 'alt',
      label: 'Alt-текст',
      type: 'text',
      required: true,
    },
    {
      name: 'blurDataUrl',
      type: 'text',
      admin: {
        hidden: true,
      },
    },
  ],
  hooks: {
    beforeChange: [
      async ({ data, req }) => {
        if (req.file?.data) {
          const preview = await sharp(req.file.data)
            .resize(16)
            .webp({ quality: 20 })
            .toBuffer()
          data.blurDataUrl = `data:image/webp;base64,${preview.toString('base64')}`
        }
        return data
      },
    ],
  },
  upload: {
    staticDir: path.resolve(process.cwd(), 'uploads/media'),
    mimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/avif'],
    focalPoint: true,
    adminThumbnail: 'thumbnail',
    formatOptions: {
      format: 'webp',
      options: { quality: 80 },
    },
    imageSizes: [
      {
        name: 'thumbnail',
        width: 320,
        formatOptions: { format: 'webp', options: { quality: 75 } },
      },
      {
        name: 'card',
        width: 640,
        formatOptions: { format: 'webp', options: { quality: 75 } },
      },
      {
        name: 'gallery',
        width: 1080,
        formatOptions: { format: 'webp', options: { quality: 78 } },
      },
      {
        name: 'hero',
        width: 1920,
        formatOptions: { format: 'webp', options: { quality: 78 } },
      },
    ],
  },
}
