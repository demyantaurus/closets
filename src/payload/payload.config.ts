import { postgresAdapter } from '@payloadcms/db-postgres'
import { nodemailerAdapter } from '@payloadcms/email-nodemailer'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { en } from '@payloadcms/translations/languages/en'
import { ru } from '@payloadcms/translations/languages/ru'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { Categories } from './collections/Categories'
import { FaqItems } from './collections/FaqItems'
import { Leads } from './collections/Leads'
import { Media } from './collections/Media'
import { PortfolioProjects } from './collections/PortfolioProjects'
import { Products } from './collections/Products'
import { Reviews } from './collections/Reviews'
import { TeamMembers } from './collections/TeamMembers'
import { Users } from './collections/Users'
import { SiteSettings } from './globals/SiteSettings'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

const email = process.env.SMTP_HOST
  ? nodemailerAdapter({
      defaultFromAddress: process.env.SMTP_USER ?? 'noreply@localhost',
      defaultFromName: 'Closets',
      transportOptions: {
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT ?? 465),
        secure: Number(process.env.SMTP_PORT ?? 465) === 465,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      },
    })
  : undefined

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname, '..'),
    },
    meta: {
      titleSuffix: ' — Closets',
    },
    components: {
      beforeDashboard: ['/payload/components/BeforeDashboard#BeforeDashboard'],
      graphics: {
        Logo: '/payload/components/Logo#Logo',
        Icon: '/payload/components/Logo#Icon',
      },
    },
  },
  collections: [
    Categories,
    Products,
    PortfolioProjects,
    Reviews,
    TeamMembers,
    FaqItems,
    Leads,
    Media,
    Users,
  ],
  globals: [SiteSettings],
  editor: lexicalEditor(),
  email,
  i18n: {
    supportedLanguages: { en, ru },
    fallbackLanguage: 'ru',
  },
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URL || '',
    },
  }),
  sharp,
  upload: {
    limits: {
      fileSize: 10 * 1024 * 1024,
    },
  },
  plugins: [],
})
