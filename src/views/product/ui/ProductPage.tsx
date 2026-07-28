import { draftMode } from 'next/headers'
import { notFound } from 'next/navigation'
import React from 'react'

import { CallbackButton } from '@/features/lead-form'
import { getProductBySlug, getProductBySlugDraft } from '@/shared/api'
import { formatPrice, imageProps, isMedia, type ImageProps } from '@/shared/lib'
import { Breadcrumbs, RefreshRouteOnSave, RichText } from '@/shared/ui'

import { ProductGallery } from './ProductGallery'
import styles from './ProductPage.module.scss'

export async function ProductPage({ slug }: { slug: string }) {
  const { isEnabled: draft } = await draftMode()
  const product = draft ? await getProductBySlugDraft(slug) : await getProductBySlug(slug)
  if (!product) notFound()

  const category =
    typeof product.category === 'object' && product.category !== null
      ? product.category
      : null

  const images = (product.gallery ?? [])
    .filter(isMedia)
    .map((media) => imageProps(media, 'gallery'))
    .filter((img): img is ImageProps => img !== null)

  return (
    <div className={styles.page}>
      {draft && <RefreshRouteOnSave />}
      <div className={styles.inner}>
        <Breadcrumbs
          items={[
            { href: '/catalog', label: 'Каталог' },
            ...(category
              ? [{ href: `/catalog/${category.slug}`, label: category.name }]
              : []),
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
