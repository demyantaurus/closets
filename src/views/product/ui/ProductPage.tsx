import { draftMode } from 'next/headers'
import { notFound } from 'next/navigation'
import React from 'react'

import { CallbackButton } from '@/features/lead-form'
import { getProductBySlug, getProductBySlugDraft } from '@/shared/api'
import {
  absoluteUrl,
  formatPrice,
  imageProps,
  isMedia,
  ORGANIZATION_ID,
  ORGANIZATION_NAME,
  richTextToPlain,
  type ImageProps,
} from '@/shared/lib'
import { Breadcrumbs, JsonLd, RefreshRouteOnSave, RichText } from '@/shared/ui'

import { ProductGallery } from './ProductGallery'
import styles from './ProductPage.module.scss'

export async function ProductPage({ slug }: { slug: string }) {
  const { isEnabled: draft } = await draftMode()
  const product = draft ? await getProductBySlugDraft(slug) : await getProductBySlug(slug)
  if (!product) notFound()

  const category =
    typeof product.category === 'object' && product.category !== null ? product.category : null

  const images = (product.gallery ?? [])
    .filter(isMedia)
    .map((media) => imageProps(media, 'gallery'))
    .filter((img): img is ImageProps => img !== null)

  const path = category ? `/catalog/${category.slug}/${product.slug}` : `/catalog`
  const url = absoluteUrl(path)

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    '@id': `${url}#product`,
    name: product.name,
    url,
    description:
      product.seo?.description ??
      richTextToPlain(product.description) ??
      `${product.name} на заказ в Минске по индивидуальным размерам.`,
    image: images.map((image) => absoluteUrl(image.src)),
    category: category?.name,
    brand: { '@type': 'Brand', name: ORGANIZATION_NAME },
    additionalProperty: product.specs?.map((spec) => ({
      '@type': 'PropertyValue',
      name: spec.name,
      value: spec.value,
    })),
    offers:
      typeof product.priceFrom === 'number'
        ? {
            '@type': 'AggregateOffer',
            priceCurrency: 'BYN',
            lowPrice: product.priceFrom,
            availability: 'https://schema.org/InStock',
            itemCondition: 'https://schema.org/NewCondition',
            url,
            seller: { '@id': ORGANIZATION_ID },
          }
        : undefined,
  }

  return (
    <div className={styles.page}>
      {draft && <RefreshRouteOnSave />}
      {!draft && <JsonLd data={jsonLd} />}
      <div className={styles.inner}>
        <Breadcrumbs
          items={[
            { href: '/catalog', label: 'Каталог' },
            ...(category ? [{ href: `/catalog/${category.slug}`, label: category.name }] : []),
            { label: product.name },
          ]}
        />

        <div className={styles.layout}>
          <ProductGallery images={images} name={product.name} />

          <div className={styles.info}>
            <h1 className={styles.title}>{product.name}</h1>
            {typeof product.priceFrom === 'number' && (
              <p className={styles.price}>{formatPrice(product.priceFrom)}</p>
            )}
            <p className={styles.priceNote}>
              Точная стоимость зависит от размеров и материалов — рассчитаем после замера
            </p>

            <div className={styles.actions}>
              <CallbackButton variant="primary" size="lg">
                Обсудить проект
              </CallbackButton>
            </div>

            {product.specs && product.specs.length > 0 && (
              <table className={styles.specs}>
                <caption className={styles.specsTitle}>Характеристики</caption>
                <tbody>
                  {product.specs.map((spec) => (
                    <tr key={spec.id}>
                      <th scope="row">{spec.name}</th>
                      <td>{spec.value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {product.description && (
          <div className={styles.description}>
            <RichText content={product.description} />
          </div>
        )}
      </div>
    </div>
  )
}
