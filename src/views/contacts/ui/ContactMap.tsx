'use client'

import React, { useState } from 'react'

import styles from './ContactMap.module.scss'

const EMBED_SRC = 'https://yandex.by/map-widget/v1/?ll=27.561831%2C53.902284&z=12'
const MAP_URL = 'https://yandex.by/maps/?ll=27.561831%2C53.902284&z=12'

export function ContactMap({ address }: { address?: string | null }) {
  const [loaded, setLoaded] = useState(false)

  if (loaded) {
    return (
      <iframe
        className={styles.frame}
        src={EMBED_SRC}
        title="Карта: как нас найти"
        loading="lazy"
        allowFullScreen
      />
    )
  }

  return (
    <a
      className={styles.preview}
      href={MAP_URL}
      target="_blank"
      rel="noreferrer"
      onClick={(event) => {
        event.preventDefault()
        setLoaded(true)
      }}
    >
      <span className={styles.pin} aria-hidden="true" />
      <span className={styles.label}>Показать карту</span>
      {address && <span className={styles.address}>{address}</span>}
    </a>
  )
}
