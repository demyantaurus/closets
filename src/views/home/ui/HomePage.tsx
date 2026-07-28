import Link from 'next/link'
import React from 'react'

import { Advantages } from '@/widgets/advantages'
import { CtaBanner } from '@/widgets/cta-banner'
import { FeaturedCategories } from '@/widgets/featured-categories'
import { Hero } from '@/widgets/hero'
import { PortfolioGallery } from '@/widgets/portfolio-gallery'
import { ProcessTimeline } from '@/widgets/process-timeline'
import { ReviewsSlider } from '@/widgets/reviews-slider'
import { getPortfolio, getReviews, getSettings } from '@/shared/api'
import { imageProps } from '@/shared/lib'
import { ArrowIcon, SectionHeading } from '@/shared/ui'

import styles from './HomePage.module.scss'

export async function HomePage() {
  const [portfolio, reviews, settings] = await Promise.all([
    getPortfolio(6),
    getReviews(10),
    getSettings(),
  ])
  const heroImage = imageProps(settings.heroImage, 'hero')

  return (
    <>
      <Hero image={heroImage} />
      <Advantages />
      <FeaturedCategories />
      <section className={styles.portfolio} aria-labelledby="portfolio-title">
        <div className={styles.portfolioInner}>
          <div className={styles.portfolioHead}>
            <SectionHeading kicker="Портфолио" title="Наши последние работы" />
            <Link className={styles.portfolioLink} href="/portfolio">
              Все работы
              <ArrowIcon size={16} />
            </Link>
          </div>
          <PortfolioGallery projects={portfolio} />
        </div>
      </section>
      <ProcessTimeline />
      <ReviewsSlider reviews={reviews} />
      <CtaBanner />
    </>
  )
}
