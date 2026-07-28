'use client'

import React, { useMemo, useState } from 'react'

import { ProjectCard } from '@/entities/portfolio-project'
import type { Category, PortfolioProject } from '@/shared/api'
import { imageProps, isMedia, type ImageProps } from '@/shared/lib'
import { Lightbox } from '@/features/lightbox'

import styles from './PortfolioGallery.module.scss'

type PortfolioGalleryProps = {
  projects: PortfolioProject[]
  categories?: Category[]
}

export function PortfolioGallery({ projects, categories }: PortfolioGalleryProps) {
  const [activeCategory, setActiveCategory] = useState<number | null>(null)
  const [lightboxImages, setLightboxImages] = useState<ImageProps[]>([])
  const [lightboxOpen, setLightboxOpen] = useState(false)

  const filtered = useMemo(() => {
    if (activeCategory === null) return projects
    return projects.filter((project) => {
      const id =
        typeof project.category === 'object' && project.category !== null
          ? project.category.id
          : project.category
      return id === activeCategory
    })
  }, [projects, activeCategory])

  function openProject(project: PortfolioProject) {
    const images = (project.gallery ?? [])
      .filter(isMedia)
      .map((media) => imageProps(media, 'gallery'))
      .filter((img): img is ImageProps => img !== null)
    if (images.length === 0) return
    setLightboxImages(images)
    setLightboxOpen(true)
  }

  return (
    <div>
      {categories && categories.length > 0 && (
        <div className={styles.filters} role="group" aria-label="Фильтр по категориям">
          <button
            type="button"
            className={`${styles.chip} ${activeCategory === null ? styles.chipActive : ''}`}
            aria-pressed={activeCategory === null}
            onClick={() => setActiveCategory(null)}
          >
            Все работы
          </button>
          {categories.map((category) => (
            <button
              key={category.id}
              type="button"
              className={`${styles.chip} ${activeCategory === category.id ? styles.chipActive : ''}`}
              aria-pressed={activeCategory === category.id}
              onClick={() => setActiveCategory(category.id)}
            >
              {category.name}
            </button>
          ))}
        </div>
      )}

      <ul className={styles.grid}>
        {filtered.map((project) => (
          <li key={project.id}>
            <ProjectCard project={project} onOpen={() => openProject(project)} />
          </li>
        ))}
      </ul>

      {filtered.length === 0 && (
        <p className={styles.empty}>В этой категории пока нет работ.</p>
      )}

      <Lightbox
        images={lightboxImages}
        initialIndex={0}
        open={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
      />
    </div>
  )
}
