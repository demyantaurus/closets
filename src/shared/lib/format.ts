export function formatPrice(value: number): string {
  return `от ${new Intl.NumberFormat('ru-BY').format(value)} BYN`
}

export function telHref(number: string): string {
  return `tel:${number.replace(/[^+0-9]/g, '')}`
}
