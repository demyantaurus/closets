'use client'

import { motion, useReducedMotion } from 'framer-motion'
import React from 'react'

import { fadeUp, staggerChildren, viewportOnce } from '../../lib/motion'

type RevealProps = {
  children: React.ReactNode
  className?: string
  delay?: number
  as?: 'div' | 'section' | 'li'
}

export function Reveal({ children, className, delay = 0, as = 'div' }: RevealProps) {
  const reduced = useReducedMotion()
  const Component = motion[as]
  return (
    <Component
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={viewportOnce}
      variants={reduced ? undefined : fadeUp}
      transition={{ delay }}
    >
      {children}
    </Component>
  )
}

export function RevealGroup({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  const reduced = useReducedMotion()
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={viewportOnce}
      variants={reduced ? undefined : staggerChildren}
    >
      {children}
    </motion.div>
  )
}

export function RevealItem({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  const reduced = useReducedMotion()
  return (
    <motion.div className={className} variants={reduced ? undefined : fadeUp}>
      {children}
    </motion.div>
  )
}
