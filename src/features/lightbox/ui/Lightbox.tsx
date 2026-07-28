'use client'

import { AnimatePresence, motion } from 'framer-motion'
import Image from 'next/image'
import React, { useCallback, useEffect, useState } from 'react'
import { createPortal } from 'react-dom'

import type { ImageProps } from '@/shared/lib'

import styles from './Lightbox.module.scss'

type LightboxProps = {
  images: ImageProps[]
  initialIndex: number
  open: boolean
  onClose: () => void
}

export function Lightbox({ images, initialIndex, open, onClose }: LightboxProps) {
  const [index, setIndex] = useState(initialIndex)
  const [wasOpen, setWasOpen] = useState(open)

  if (open !== wasOpen) {
    setWasOpen(open)
    if (open) setIndex(initialIndex)
  }

  const prev = useCallback(
    () => setIndex((i) => (i - 1 + images.length) % images.length),
    [images.length],
  )
  const next = useCallback(() => setIndex((i) => (i + 1) % images.length), [images.length])

  useEffect(() => {
    if (!open) return
    function onKey(event: KeyboardEvent) {
      if (event.key === 'Escape') onClose()
      if (event.key === 'ArrowLeft') prev()
      if (event.key === 'ArrowRight') next()
    }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [open, onClose, prev, next])

  if (typeof document === 'undefined') return null
  const image = images[index]

  return createPortal(
    <AnimatePresence>
      {open && image && (
        <motion.div
          className={styles.overlay}
          role="dialog"
          aria-modal="true"
          aria-label="Просмотр галереи"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <button className={styles.close} aria-label="Закрыть" onClick={onClose}>
            <svg width="22" height="22" viewBox="0 0 20 20" aria-hidden="true">
              <path
                d="M5 5l10 10M15 5L5 15"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </button>

          <p className={styles.counter} aria-live="polite">
            {index + 1} / {images.length}
          </p>

          {images.length > 1 && (
            <>
              <button
                className={`${styles.arrow} ${styles.arrowLeft}`}
                aria-label="Предыдущее фото"
                onClick={(event) => {
                  event.stopPropagation()
                  prev()
                }}
              >
                ←
              </button>
              <button
                className={`${styles.arrow} ${styles.arrowRight}`}
                aria-label="Следующее фото"
                onClick={(event) => {
                  event.stopPropagation()
                  next()
                }}
              >
                →
              </button>
            </>
          )}

          <motion.div
            key={index}
            className={styles.imageWrap}
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            drag={images.length > 1 ? 'x' : false}
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.2}
            onDragEnd={(_, info) => {
              if (info.offset.x < -60) next()
              if (info.offset.x > 60) prev()
            }}
            onClick={(event) => event.stopPropagation()}
          >
            <Image
              className={styles.image}
              src={image.src}
              alt={image.alt}
              width={image.width}
              height={image.height}
              sizes="100vw"
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  )
}
