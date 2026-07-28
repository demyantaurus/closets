export function formatPrice(value: number): string {
  return `от ${new Intl.NumberFormat('ru-BY').format(value)} BYN`
}
