'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React, { useEffect, useState } from 'react'

import { CallbackButton } from '@/features/lead-form'
import { MobileMenu } from '@/features/mobile-menu'
import { telHref } from '@/shared/lib'
import { ArrowIcon } from '@/shared/ui'

import styles from './Header.module.scss'

type NavLink = { href: string; label: string }

type Banner = { text: string; link: string }

export function HeaderClient({
  links,
  phone,
  banner,
}: {
  links: NavLink[]
  phone?: string
  banner?: Banner | null
}) {
  const [scrolled, setScrolled] = useState(false)
  const [bannerClosed, setBannerClosed] = useState(false)
  const pathname = usePathname()
  const transparent = pathname === '/' && !scrolled
  const showBanner = Boolean(banner) && !bannerClosed && !scrolled

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 24)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={`${styles.header} ${transparent ? styles.transparent : styles.solid}`}
      style={{ '--header-height': showBanner ? '104px' : '64px' } as React.CSSProperties}
    >
      {banner && (
        <div className={`${styles.banner} ${showBanner ? '' : styles.bannerHidden}`}>
          <Link className={styles.bannerLink} href={banner.link} tabIndex={showBanner ? 0 : -1}>
            {banner.text}
            <ArrowIcon size={14} />
          </Link>
          <button
            type="button"
            className={styles.bannerClose}
            aria-label="Скрыть баннер"
            tabIndex={showBanner ? 0 : -1}
            onClick={() => setBannerClosed(true)}
          >
            <svg width="14" height="14" viewBox="0 0 20 20" aria-hidden="true">
              <path
                d="M5 5l10 10M15 5L5 15"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>
      )}
      <div className={styles.inner}>
        <Link className={styles.logo} href="/" aria-label="Closets — на главную">
          Closets<span className={styles.logoDot}>.</span>
        </Link>

        <nav className={styles.nav} aria-label="Основная навигация">
          <ul className={styles.navList}>
            {links.map((link) => (
              <li key={link.href}>
                <Link
                  className={styles.navLink}
                  href={link.href}
                  aria-current={pathname === link.href ? 'page' : undefined}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className={styles.actions}>
          {phone && (
            <a className={styles.phone} href={telHref(phone)}>
              {phone}
            </a>
          )}
          <div className={styles.callback}>
            <CallbackButton variant="outline" />
          </div>
          <MobileMenu links={links} phone={phone} />
        </div>
      </div>
    </header>
  )
}
