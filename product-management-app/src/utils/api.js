import { normalizeProduct, normalizedDefaults } from './normalizeProduct'

const apiBase = import.meta.env.DEV ? '/api/dummyjson' : 'https://dummyjson.com'

async function getJson(url) {
  const response = await fetch(url)
  if (!response.ok) {
    throw new Error(`Request failed (${response.status})`)
  }
  return response.json()
}

export async function fetchProducts() {
  const data = await getJson(`${apiBase}/products?limit=0`)
  if (!Array.isArray(data.products)) {
    throw new Error('The product response was not in the expected format.')
  }
  return data.products.map(normalizeProduct)
}

export async function fetchCategories() {
  const data = await getJson(`${apiBase}/products/categories`)
  if (!Array.isArray(data)) {
    throw new Error('The category response was not in the expected format.')
  }
  return data.map((category) => typeof category === 'string'
    ? { slug: category, name: category.replaceAll('-', ' ') }
    : category)
}

export async function fetchFeaturedProducts() {
  const data = await getJson(`${apiBase}/products?sortBy=rating&order=desc&limit=4`)
  if (!Array.isArray(data.products)) {
    throw new Error('The featured product response was not in the expected format.')
  }
  return data.products.map(normalizeProduct)
}

export { normalizedDefaults }
