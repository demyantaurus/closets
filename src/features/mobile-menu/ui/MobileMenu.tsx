'use client'

import { AnimatePresence, motion } from 'framer-motion'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React, { useEffect, useId, useState } from 'react'

import styles from './MobileMenu.module.scss'

type NavLink = { href: string; label: string }

export function MobileMenu({ links, phone }: { links: NavLink[]; phone?: string }) {
  const [open, setOpen] = useState(false)
  const panelId = useId()
  const pathname = usePathname()

  useEffect(() => {
    if (!open) return
    function onKey(event: KeyboardEvent) {
      if (event.key === 'Escape') setOpen(false)
    }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [open])

  return (
    <div className={styles.wrapper}>
      <button
        type="button"
        className={styles.burger}
        aria-expanded={open}
        aria-controls={panelId}
        aria-label={open ? 'Закрыть меню' : 'Открыть меню'}
        onClick={() => setOpen((value) => !value)}
      >
        <span className={`${styles.line} ${open ? styles.lineTopOpen : ''}`} />
        <span className={`${styles.line} ${open ? styles.lineMidOpen : ''}`} />
        <span className={`${styles.line} ${open ? styles.lineBotOpen : ''}`} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.nav
            id={panelId}
            className={styles.panel}
            aria-label="Мобильное меню"
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
          >
            <ul className={styles.list}>
              {links.map((link) => (
                <li key={link.href}>
                  <Link
                    className={styles.link}
                    href={link.href}
                    aria-current={pathname === link.href ? 'page' : undefined}
                    onClick={() => setOpen(false)}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
            {phone && (
              <a className={styles.phone} href={`tel:${phone.replace(/[^+0-9]/g, '')}`}>
                {phone}
              </a>
            )}
          </motion.nav>
        )}
      </AnimatePresence>
    </div>
  )
}
