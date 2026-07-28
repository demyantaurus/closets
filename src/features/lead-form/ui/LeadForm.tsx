'use client'

import React, { useState } from 'react'

import { createLead } from '@/shared/actions'
import { leadSchema } from '@/shared/lib'
import { Button, InputField, TextareaField } from '@/shared/ui'

import styles from './LeadForm.module.scss'

type LeadFormProps = {
  type: 'callback' | 'contact' | 'project3d'
  withMessage?: boolean
  submitLabel?: string
  onSuccess?: () => void
}

type FieldErrors = Partial<Record<'name' | 'phone', string>>

export function LeadForm({
  type,
  withMessage = false,
  submitLabel = 'Отправить',
  onSuccess,
}: LeadFormProps) {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errors, setErrors] = useState<FieldErrors>({})
  const [serverError, setServerError] = useState('')

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    const input = {
      type,
      name: String(form.get('name') ?? ''),
      phone: String(form.get('phone') ?? ''),
      message: String(form.get('message') ?? '') || undefined,
      company: String(form.get('company') ?? '') || undefined,
    }
    const parsed = leadSchema.safeParse(input)
    if (!parsed.success) {
      const fieldErrors: FieldErrors = {}
      for (const issue of parsed.error.issues) {
        const key = issue.path[0]
        if (key === 'name' || key === 'phone') fieldErrors[key] = issue.message
      }
      setErrors(fieldErrors)
      return
    }
    setErrors({})
    setServerError('')
    setStatus('loading')
    const result = await createLead(parsed.data)
    if (result.ok) {
      setStatus('success')
      onSuccess?.()
    } else {
      setStatus('error')
      setServerError(result.error)
    }
  }

  if (status === 'success') {
    return (
      <p className={styles.success} role="status">
        Спасибо! Мы свяжемся с вами в ближайшее время.
      </p>
    )
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit} noValidate>
      <InputField
        label="Ваше имя"
        name="name"
        autoComplete="name"
        error={errors.name}
        required
      />
      <InputField
        label="Телефон"
        name="phone"
        type="tel"
        inputMode="tel"
        placeholder="+375 (__) ___-__-__"
        autoComplete="tel"
        error={errors.phone}
        required
      />
      {withMessage && <TextareaField label="Сообщение" name="message" />}
      <input
        type="text"
        name="company"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className={styles.honeypot}
      />
      <Button type="submit" size="lg" disabled={status === 'loading'}>
        {status === 'loading' ? 'Отправка…' : submitLabel}
      </Button>
      <p className={styles.note}>
        Нажимая кнопку, вы соглашаетесь с{' '}
        <a href="/privacy" target="_blank">
          политикой конфиденциальности
        </a>
      </p>
      <div aria-live="polite">
        {serverError && <p className={styles.error}>{serverError}</p>}
      </div>
    </form>
  )
}
