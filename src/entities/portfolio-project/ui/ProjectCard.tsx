import Image from 'next/image'
import React from 'react'

import type { PortfolioProject } from '@/shared/api'
import { imageProps, isMedia } from '@/shared/lib'

import styles from './ProjectCard.module.scss'

type ProjectCardProps = {
  project: PortfolioProject
  onOpen?: () => void
}

export function ProjectCard({ project, onOpen }: ProjectCardProps) {
  const first = project.gallery?.find(isMedia)
  const image = imageProps(first, 'gallery')
  const categoryName =
    typeof project.category === 'object' && project.category !== null
      ? project.category.name
      : null

  return (
    <button
      type="button"
      className={styles.card}
      onClick={onOpen}
      aria-label={`Открыть галерею: ${project.title}`}
    >
      <span className={styles.imageWrap}>
        {image && (
          <Image
            className={styles.image}
            src={image.src}
            alt={image.alt}
            fill
            sizes="(min-width: 1920px) 366px, (min-width: 1280px) 33vw, (min-width: 768px) 50vw, 100vw"
            placeholder={image.blurDataURL ? 'blur' : undefined}
            blurDataURL={image.blurDataURL}
          />
        )}
        <span className={styles.overlay} aria-hidden="true" />
      </span>
      <span className={styles.body}>
        {categoryName && <span className={styles.category}>{categoryName}</span>}
        <span className={styles.title}>{project.title}</span>
      </span>
    </button>
  )
}
