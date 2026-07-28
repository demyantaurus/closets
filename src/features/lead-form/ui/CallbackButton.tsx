'use client'

import React, { useState } from 'react'

import { Button, Modal } from '@/shared/ui'

import { LeadForm } from './LeadForm'
import styles from './CallbackButton.module.scss'

export function CallbackButton({
  variant = 'outline',
  size = 'md',
  children = 'Обратный звонок',
}: {
  variant?: 'primary' | 'outline' | 'ghost'
  size?: 'md' | 'lg'
  children?: React.ReactNode
}) {
  const [open, setOpen] = useState(false)
  return (
    <>
      <Button variant={variant} size={size} onClick={() => setOpen(true)}>
        {children}
      </Button>
      <Modal open={open} onClose={() => setOpen(false)} title="Заказать обратный звонок">
        <h2 className={styles.title}>Обратный звонок</h2>
        <p className={styles.subtitle}>Оставьте номер — перезвоним в течение 15 минут</p>
        <LeadForm type="callback" submitLabel="Жду звонка" />
      </Modal>
    </>
  )
}

export function FloatingCallback() {
  const [open, setOpen] = useState(false)
  return (
    <>
      <button
        type="button"
        className={styles.floating}
        aria-label="Заказать обратный звонок"
        onClick={() => setOpen(true)}
      >
        <span className={styles.pulse} aria-hidden="true" />
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2Z"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinejoin="round"
          />
        </svg>
      </button>
      <Modal open={open} onClose={() => setOpen(false)} title="Заказать обратный звонок">
        <h2 className={styles.title}>Обратный звонок</h2>
        <p className={styles.subtitle}>Оставьте номер — перезвоним в течение 15 минут</p>
        <LeadForm type="callback" submitLabel="Жду звонка" />
      </Modal>
    </>
  )
}
