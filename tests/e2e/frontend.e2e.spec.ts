import { expect, test } from '@playwright/test'

test.describe('Public site smoke', () => {
  test('homepage renders hero and sections', async ({ page }) => {
    await page.goto('/')
    await expect(page).toHaveTitle(/Мебель на заказ/)
    await expect(page.locator('h1')).toContainText('От идеи')
    await expect(page.getByRole('navigation', { name: 'Основная навигация' })).toBeVisible()
  })

  test('no horizontal overflow on homepage', async ({ page }) => {
    await page.goto('/')
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - window.innerWidth,
    )
    expect(overflow).toBeLessThanOrEqual(0)
  })

  test('catalog lists categories and navigates to product', async ({ page }) => {
    await page.goto('/catalog')
    await expect(page.locator('h1')).toContainText('Каталог')
    await page.getByRole('link', { name: /Шкафы-купе/ }).first().click()
    await expect(page.locator('h1')).toContainText('Шкафы-купе')
    await page.locator('a[href*="/catalog/shkafy-kupe/"]').first().click()
    await expect(page.locator('h1')).toBeVisible()
  })

  test('portfolio filter works', async ({ page }) => {
    await page.goto('/portfolio')
    await expect(page.locator('h1')).toContainText('Наши работы')
    await page.getByRole('button', { name: 'Кухни' }).click()
    await expect(page.locator('ul li').first()).toBeVisible()
  })

  test('calculator wizard reaches contact step', async ({ page }) => {
    await page.goto('/calculator')
    for (let step = 0; step < 4; step++) {
      await page.locator('label').first().click()
      await page.getByRole('button', { name: 'Далее' }).click()
    }
    await expect(page.getByLabel('Телефон')).toBeVisible()
  })

  test('faq accordion expands', async ({ page }) => {
    await page.goto('/faq')
    const trigger = page.getByRole('button', { name: /Сколько стоит замер/ })
    await trigger.click()
    await expect(trigger).toHaveAttribute('aria-expanded', 'true')
    await expect(page.getByRole('region')).toContainText('бесплатно')
  })

  test('contacts page renders form', async ({ page }) => {
    await page.goto('/contacts')
    await expect(page.getByLabel('Ваше имя')).toBeVisible()
    await expect(page.getByLabel('Телефон')).toBeVisible()
  })
})
