'use client'

import { animate, useInView, useReducedMotion } from 'framer-motion'
import React, { useEffect, useRef } from 'react'

type CounterProps = {
  to: number
  suffix?: string
  duration?: number
  className?: string
}

export function Counter({ to, suffix = '', duration = 1.8, className }: CounterProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.6 })
  const reduced = useReducedMotion()

  useEffect(() => {
    if (!inView || !ref.current) return
    if (reduced) {
      ref.current.textContent = `${to}${suffix}`
      return
    }
    const controls = animate(0, to, {
      duration,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (value) => {
        if (ref.current) ref.current.textContent = `${Math.round(value)}${suffix}`
      },
    })
    return () => controls.stop()
  }, [inView, to, suffix, duration, reduced])

  return (
    <span ref={ref} className={className}>
      0{suffix}
    </span>
  )
}
