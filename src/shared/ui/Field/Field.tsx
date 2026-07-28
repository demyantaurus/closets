'use client'

import React, { useId } from 'react'

import styles from './Field.module.scss'

type BaseProps = {
  label: string
  error?: string
}

type InputFieldProps = BaseProps & React.InputHTMLAttributes<HTMLInputElement>

export function InputField({ label, error, ...rest }: InputFieldProps) {
  const id = useId()
  const errorId = `${id}-error`
  return (
    <div className={styles.field}>
      <label className={styles.label} htmlFor={id}>
        {label}
      </label>
      <input
        id={id}
        className={`${styles.control} ${error ? styles.invalid : ''}`}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : undefined}
        {...rest}
      />
      {error && (
        <p className={styles.error} id={errorId}>
          {error}
        </p>
      )}
    </div>
  )
}

type TextareaFieldProps = BaseProps & React.TextareaHTMLAttributes<HTMLTextAreaElement>

export function TextareaField({ label, error, ...rest }: TextareaFieldProps) {
  const id = useId()
  const errorId = `${id}-error`
  return (
    <div className={styles.field}>
      <label className={styles.label} htmlFor={id}>
        {label}
      </label>
      <textarea
        id={id}
        className={`${styles.control} ${styles.textarea} ${error ? styles.invalid : ''}`}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : undefined}
        {...rest}
      />
      {error && (
        <p className={styles.error} id={errorId}>
          {error}
        </p>
      )}
    </div>
  )
}
