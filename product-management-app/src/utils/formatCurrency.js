const currencyFormatter = new Intl.NumberFormat('en-PH', {
  style: 'currency',
  currency: 'PHP',
})

export function formatCurrency(value) {
  return currencyFormatter.format(Number(value) || 0)
}
