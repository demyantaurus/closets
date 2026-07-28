'use client'

import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import React, { useState } from 'react'

import { createLead } from '@/shared/actions'
import { leadSchema } from '@/shared/lib'
import { Button, InputField } from '@/shared/ui'

import { STEPS, useCalculatorStore } from '../model/store'
import styles from './Calculator.module.scss'

const TOTAL_STEPS = STEPS.length + 1

export function Calculator() {
  const { step, answers, setAnswer, toggleExtra, next, back } = useCalculatorStore()
  const reduced = useReducedMotion()
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errors, setErrors] = useState<Partial<Record<'name' | 'phone', string>>>({})
  const [serverError, setServerError] = useState('')

  const isContactStep = step === STEPS.length
  const current = STEPS[step]

  function isStepComplete(): boolean {
    if (isContactStep) return true
    if (current.key === 'extras') return true
    return Boolean(answers[current.key])
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    const input = {
      type: 'calculator' as const,
      name: String(form.get('name') ?? ''),
      phone: String(form.get('phone') ?? ''),
      company: String(form.get('company') ?? '') || undefined,
      details: answers as Record<string, unknown>,
    }
    const parsed = leadSchema.safeParse(input)
    if (!parsed.success) {
      const fieldErrors: typeof errors = {}
      for (const issue of parsed.error.issues) {
        const key = issue.path[0]
        if (key === 'name' || key === 'phone') fieldErrors[key] = issue.message
      }
      setErrors(fieldErrors)
      return
    }
    setErrors({})
    setStatus('loading')
    const result = await createLead(parsed.data)
    if (result.ok) {
      setStatus('success')
    } else {
      setStatus('error')
      setServerError(result.error)
    }
  }

  if (status === 'success') {
    return (
      <div className={styles.done} role="status">
        <p className={styles.doneTitle}>Заявка отправлена!</p>
        <p className={styles.doneText}>
          Мы рассчитаем стоимость и перезвоним. Скидка 100 BYN закреплена за вами.
        </p>
      </div>
    )
  }

  return (
    <div className={styles.calculator}>
      <div className={styles.progress}>
        <div
          className={styles.progressBar}
          role="progressbar"
          aria-valuenow={step + 1}
          aria-valuemin={1}
          aria-valuemax={TOTAL_STEPS}
          aria-label={`Шаг ${step + 1} из ${TOTAL_STEPS}`}
        >
          <span
            className={styles.progressFill}
            style={{ width: `${((step + 1) / TOTAL_STEPS) * 100}%` }}
          />
        </div>
        <p className={styles.progressLabel} aria-hidden="true">
          Шаг {step + 1} / {TOTAL_STEPS}
        </p>
      </div>

      <div aria-live="polite">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={reduced ? false : { opacity: 0, x: 32 }}
            animate={{ opacity: 1, x: 0 }}
            exit={reduced ? undefined : { opacity: 0, x: -32 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          >
            {!isContactStep && (
              <fieldset className={styles.fieldset}>
                <legend className={styles.stepTitle} aria-current="step">
                  {current.title}
                </legend>
                <div className={styles.options}>
                  {current.options.map((option) => {
                    const selected =
                      current.key === 'extras'
                        ? answers.extras.includes(option)
                        : answers[current.key] === option
                    return (
                      <label
                        key={option}
                        className={`${styles.option} ${selected ? styles.optionSelected : ''}`}
                      >
                        <input
                          className={styles.optionInput}
                          type={current.key === 'extras' ? 'checkbox' : 'radio'}
                          name={current.key}
                          value={option}
                          checked={selected}
                          onChange={() =>
                            current.key === 'extras'
                              ? toggleExtra(option)
                              : setAnswer(current.key, option)
                          }
                        />
                        <span>{option}</span>
                      </label>
                    )
                  })}
                </div>
              </fieldset>
            )}

            {isContactStep && (
              <form className={styles.contactForm} onSubmit={handleSubmit} noValidate>
                <p className={styles.stepTitle} aria-current="step">
                  Куда отправить расчёт?
                </p>
                <InputField label="Ваше имя" name="name" autoComplete="name" error={errors.name} required />
                <InputField
                  label="Телефон"
                  name="phone"
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel"
                  placeholder="+375 (__) ___-__-__"
                  error={errors.phone}
                  required
                />
                <input
                  type="text"
                  name="company"
                  tabIndex={-1}
                  autoComplete="off"
                  aria-hidden="true"
                  className={styles.honeypot}
                />
                <div className={styles.nav}>
                  <Button type="button" variant="ghost" onClick={back}>
                    Назад
                  </Button>
                  <Button type="submit" size="lg" disabled={status === 'loading'}>
                    {status === 'loading' ? 'Отправка…' : 'Получить расчёт и скидку'}
                  </Button>
                </div>
                <div aria-live="polite">
                  {serverError && <p className={styles.error}>{serverError}</p>}
                </div>
              </form>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {!isContactStep && (
        <div className={styles.nav}>
          {step > 0 ? (
            <Button type="button" variant="ghost" onClick={back}>
              Назад
            </Button>
          ) : (
            <span />
          )}
          <Button type="button" onClick={next} disabled={!isStepComplete()}>
            Далее
          </Button>
        </div>
      )}
    </div>
  )
}
