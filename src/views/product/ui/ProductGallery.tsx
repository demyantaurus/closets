'use client'

import Image from 'next/image'
import React, { useState } from 'react'

import { Lightbox } from '@/features/lightbox'
import type { ImageProps } from '@/shared/lib'

import styles from './ProductGallery.module.scss'

export function ProductGallery({ images, name }: { images: ImageProps[]; name: string }) {
  const [open, setOpen] = useState(false)
  const [index, setIndex] = useState(0)

  if (images.length === 0) return null
  const [main, ...thumbs] = images

  return (
    <div className={styles.gallery}>
      <button
        type="button"
        className={styles.main}
        aria-label={`Открыть галерею: ${name}`}
        onClick={() => {
          setIndex(0)
          setOpen(true)
        }}
      >
        <Image
          className={styles.mainImage}
          src={main.src}
          alt={main.alt}
          fill
          priority
          fetchPriority="high"
          sizes="(max-width: 1024px) 100vw, 55vw"
          placeholder={main.blurDataURL ? 'blur' : undefined}
          blurDataURL={main.blurDataURL}
        />
      </button>
      {thumbs.length > 0 && (
        <div className={styles.thumbs}>
          {thumbs.map((image, i) => (
            <button
              key={image.src}
              type="button"
              className={styles.thumb}
              aria-label={`Фото ${i + 2}`}
              onClick={() => {
                setIndex(i + 1)
                setOpen(true)
              }}
            >
              <Image
                className={styles.thumbImage}
                src={image.src}
                alt={image.alt}
                fill
                sizes="120px"
              />
            </button>
          ))}
        </div>
      )}
      <Lightbox images={images} initialIndex={index} open={open} onClose={() => setOpen(false)} />
    </div>
  )
}
