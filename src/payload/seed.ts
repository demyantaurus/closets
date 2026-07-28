import 'dotenv/config'
import { getPayload } from 'payload'
import sharp from 'sharp'

import config from './payload.config'
import { makeHeroImage } from './utils/hero-image'

const palette = [
  ['#b08d57', '#7a5c43'],
  ['#2a2826', '#4a453f'],
  ['#8a9a8b', '#5c6b5d'],
  ['#a3846b', '#6e563f'],
  ['#94867a', '#615850'],
  ['#b5a48c', '#8c7a5f'],
]

async function makeImage(paletteIndex: number): Promise<Buffer> {
  const [from, to] = palette[paletteIndex % palette.length]
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="1200">
    <defs>
      <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="${from}"/>
        <stop offset="1" stop-color="${to}"/>
      </linearGradient>
    </defs>
    <rect width="1600" height="1200" fill="url(#g)"/>
    <circle cx="1250" cy="350" r="420" fill="rgba(255,255,255,0.08)"/>
  </svg>`
  return sharp(Buffer.from(svg)).jpeg({ quality: 88 }).toBuffer()
}

const richText = (text: string) => ({
  root: {
    type: 'root',
    children: [
      {
        type: 'paragraph',
        version: 1,
        children: [{ type: 'text', text, version: 1 }],
      },
    ],
    direction: null,
    format: '' as const,
    indent: 0,
    version: 1,
  },
})

async function run(): Promise<void> {
  const payload = await getPayload({ config })
  const context = { disableRevalidate: true, disableNotifications: true }

  const existing = await payload.find({ collection: 'categories', limit: 1 })
  if (existing.totalDocs > 0) {
    payload.logger.info('Seed skipped: categories already exist')
    process.exit(0)
  }

  const admin = await payload.find({ collection: 'users', limit: 1 })
  if (admin.totalDocs === 0) {
    await payload.create({
      collection: 'users',
      data: {
        email: 'admin@closets.local',
        password: 'admin1234',
        name: 'Администратор',
        role: 'admin',
      },
      context,
    })
    payload.logger.info('Admin user created: admin@closets.local / admin1234')
  }

  async function createMedia(alt: string, paletteIndex: number) {
    const data = await makeImage(paletteIndex)
    return payload.create({
      collection: 'media',
      data: { alt },
      file: {
        data,
        mimetype: 'image/jpeg',
        name: `seed-${paletteIndex}-${Date.now()}.jpg`,
        size: data.length,
      },
      context,
    })
  }

  const categoriesData = [
    { name: 'Шкафы-купе', description: 'Встроенные и корпусные шкафы-купе по вашим размерам' },
    { name: 'Гардеробные', description: 'Гардеробные комнаты и системы хранения' },
    { name: 'Кухни', description: 'Кухонные гарнитуры под заказ' },
    { name: 'Прихожие', description: 'Мебель для прихожих любой планировки' },
    { name: 'Спальни', description: 'Кровати, шкафы и комоды для спальни' },
  ]

  const categories = []
  for (const [i, item] of categoriesData.entries()) {
    const image = await createMedia(item.name, i)
    categories.push(
      await payload.create({
        collection: 'categories',
        data: { ...item, image: image.id, sortOrder: i },
        context,
      }),
    )
  }

  const productsData = [
    { name: 'Шкаф-купе «Милан»', category: 0, priceFrom: 1450, text: 'Трёхдверный шкаф-купе с зеркальными фасадами и подсветкой.' },
    { name: 'Шкаф-купе «Осло»', category: 0, priceFrom: 1180, text: 'Компактный двухдверный шкаф-купе для спальни.' },
    { name: 'Гардеробная «Лофт»', category: 1, priceFrom: 2300, text: 'Открытая гардеробная система в стиле лофт.' },
    { name: 'Гардеробная «Классика»', category: 1, priceFrom: 2900, text: 'Угловая гардеробная с распашными фасадами.' },
    { name: 'Кухня «Скандинавия»', category: 2, priceFrom: 3200, text: 'Светлая кухня с матовыми фасадами и деревянной столешницей.' },
    { name: 'Кухня «Модерн»', category: 2, priceFrom: 3800, text: 'Глянцевая кухня до потолка со встроенной техникой.' },
    { name: 'Прихожая «Компакт»', category: 3, priceFrom: 890, text: 'Прихожая для небольших квартир с зеркалом и обувницей.' },
    { name: 'Прихожая «Семейная»', category: 3, priceFrom: 1350, text: 'Вместительная прихожая с антресолями.' },
    { name: 'Спальня «Венеция»', category: 4, priceFrom: 2600, text: 'Комплект: кровать, шкаф и две тумбы.' },
    { name: 'Спальня «Минимал»', category: 4, priceFrom: 2100, text: 'Лаконичный спальный гарнитур в светлых тонах.' },
  ]

  for (const [i, item] of productsData.entries()) {
    const image = await createMedia(item.name, i)
    await payload.create({
      collection: 'products',
      data: {
        name: item.name,
        category: categories[item.category].id,
        priceFrom: item.priceFrom,
        description: richText(item.text),
        gallery: [image.id],
        specs: [
          { name: 'Материал корпуса', value: 'ЛДСП Egger' },
          { name: 'Фурнитура', value: 'Blum' },
          { name: 'Срок изготовления', value: '14–21 день' },
        ],
        _status: 'published',
      },
      context,
    })
  }

  const portfolioData = [
    { title: 'Шкаф-купе в спальню, ул. Немига', category: 0 },
    { title: 'Гардеробная в квартире на Победителей', category: 1 },
    { title: 'Кухня в ЖК «Минск Мир»', category: 2 },
    { title: 'Прихожая в частном доме, Боровляны', category: 3 },
    { title: 'Спальня в скандинавском стиле', category: 4 },
    { title: 'Встроенный шкаф в детскую', category: 0 },
  ]

  for (const [i, item] of portfolioData.entries()) {
    const image = await createMedia(item.title, i)
    await payload.create({
      collection: 'portfolio-projects',
      data: {
        title: item.title,
        category: categories[item.category].id,
        description: 'Проект выполнен под ключ: замер, 3D-визуализация, производство и монтаж.',
        gallery: [image.id],
        _status: 'published',
      },
      context,
    })
  }

  const reviewsData = [
    { authorName: 'Елена', text: 'Заказывали шкаф-купе в спальню. Сделали быстро, качество отличное!', rating: 5 },
    { authorName: 'Дмитрий', text: 'Кухня получилась именно такой, как на 3D-проекте. Рекомендую.', rating: 5 },
    { authorName: 'Ольга', text: 'Спасибо за гардеробную! Продумали каждую полочку.', rating: 5 },
    { authorName: 'Андрей', text: 'Хорошая цена и вежливые мастера. Монтаж занял один день.', rating: 4 },
    { authorName: 'Наталья', text: 'Прихожая супер, всё поместилось. Отдельное спасибо дизайнеру.', rating: 5 },
  ]

  for (const item of reviewsData) {
    await payload.create({
      collection: 'reviews',
      data: { ...item, published: true },
      context,
    })
  }

  const teamData = [
    { name: 'Сергей Ковалёв', role: 'Руководитель производства' },
    { name: 'Анна Лебедева', role: 'Дизайнер-проектировщик' },
    { name: 'Игорь Мартынов', role: 'Мастер по монтажу' },
  ]

  for (const [i, item] of teamData.entries()) {
    const photo = await createMedia(item.name, i + 2)
    await payload.create({
      collection: 'team-members',
      data: { ...item, photo: photo.id, sortOrder: i },
      context,
    })
  }

  const faqData = [
    { question: 'Сколько стоит замер?', answer: 'Выезд замерщика по Минску и в радиусе 30 км — бесплатно.' },
    { question: 'Какой срок изготовления мебели?', answer: 'В среднем 14–21 рабочий день с момента утверждения проекта.' },
    { question: 'Есть ли рассрочка?', answer: 'Да, рассрочка от 6 до 36 месяцев без переплат.' },
    { question: 'Какая гарантия на мебель?', answer: 'Гарантия 2 года на все изделия и фурнитуру.' },
    { question: 'Делаете ли вы 3D-проект?', answer: 'Да, 3D-визуализация бесплатна при заказе.' },
    { question: 'Работаете ли вы с юридическими лицами?', answer: 'Да, работаем с организациями по безналичному расчёту.' },
  ]

  for (const [i, item] of faqData.entries()) {
    await payload.create({
      collection: 'faq-items',
      data: { ...item, sortOrder: i },
      context,
    })
  }

  const heroData = await makeHeroImage()
  const heroMedia = await payload.create({
    collection: 'media',
    data: { alt: 'Шкафы-купе на заказ — интерьер' },
    file: {
      data: heroData,
      mimetype: 'image/jpeg',
      name: `hero-${Date.now()}.jpg`,
      size: heroData.length,
    },
    context,
  })

  await payload.updateGlobal({
    slug: 'site-settings',
    data: {
      heroImage: heroMedia.id,
      phones: [{ number: '+375 (29) 123-45-67' }, { number: '+375 (17) 123-45-67' }],
      email: 'info@closets.by',
      address: 'г. Минск, ул. Примерная, 10, офис 5',
      workingHours: 'Пн–Пт 9:00–19:00, Сб 10:00–16:00',
      socials: {
        telegram: 'https://t.me/closets_by',
        viber: 'viber://chat?number=%2B375291234567',
        whatsapp: 'https://wa.me/375291234567',
        instagram: 'https://instagram.com/closets.by',
      },
      discountBanner: {
        enabled: true,
        text: 'Скидка 100 BYN при заказе через калькулятор',
      },
    },
    context,
  })

  payload.logger.info('Seed completed')
  process.exit(0)
}

void run().catch((error) => {
  console.error(error)
  process.exit(1)
})
