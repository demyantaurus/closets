import { describe, expect, it } from 'vitest'

import { absoluteUrl, pruneJsonLd, serializeJsonLd, SITE_URL } from '@/shared/lib'

describe('pruneJsonLd', () => {
  it('drops null, undefined and empty-string values', () => {
    expect(pruneJsonLd({ '@type': 'Product', name: 'Шкаф', sku: null, gtin: '' })).toEqual({
      '@type': 'Product',
      name: 'Шкаф',
    })
  })

  it('keeps @id-only reference objects', () => {
    expect(
      pruneJsonLd({ '@type': 'ContactPage', mainEntity: { '@id': 'x#organization' } }),
    ).toEqual({ '@type': 'ContactPage', mainEntity: { '@id': 'x#organization' } })
  })

  it('keeps a root @graph wrapper', () => {
    const graph = {
      '@context': 'https://schema.org',
      '@graph': [{ '@type': 'WebSite', name: 'Closets' }],
    }
    expect(pruneJsonLd(graph)).toEqual(graph)
  })

  it('drops a nested object left with only a type, keeping its parent', () => {
    const input = {
      '@type': 'Thing',
      name: 'Closets',
      address: { '@type': 'PostalAddress', streetAddress: null },
    }
    expect(pruneJsonLd(input)).toEqual({ '@type': 'Thing', name: 'Closets' })
  })

  it('drops arrays that prune to nothing, keeping the parent', () => {
    expect(pruneJsonLd({ '@type': 'Product', name: 'Шкаф', image: [null, ''] })).toEqual({
      '@type': 'Product',
      name: 'Шкаф',
    })
  })

  it('drops a bare type stub entirely', () => {
    expect(pruneJsonLd({ '@type': 'Product', image: [null, ''] })).toBeUndefined()
  })

  it('preserves zero and false', () => {
    expect(pruneJsonLd({ '@type': 'Offer', price: 0, isAccessory: false })).toEqual({
      '@type': 'Offer',
      price: 0,
      isAccessory: false,
    })
  })
})

describe('serializeJsonLd', () => {
  it('escapes angle brackets so CMS content cannot break out of the script tag', () => {
    const output = serializeJsonLd({ '@type': 'Product', name: '</script><script>alert(1)' })
    expect(output).not.toContain('</script>')
    expect(output).toContain('\\u003c/script')
  })

  it('serializes an empty object when everything is pruned', () => {
    expect(serializeJsonLd({ '@type': 'Product' })).toBe('{}')
  })
})

describe('absoluteUrl', () => {
  it('prefixes site-relative paths', () => {
    expect(absoluteUrl('/catalog')).toBe(`${SITE_URL}/catalog`)
  })

  it('adds a missing leading slash', () => {
    expect(absoluteUrl('catalog')).toBe(`${SITE_URL}/catalog`)
  })

  it('leaves absolute urls untouched', () => {
    expect(absoluteUrl('https://cdn.example.com/a.jpg')).toBe('https://cdn.example.com/a.jpg')
  })
})
