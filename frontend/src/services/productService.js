import { authService } from './authService'
import { API_BASE } from './apiConfig'

const PRODUCTS_API = `${API_BASE}/products`

export const productService = {
  // Fetch all products with optional filters
  async getProducts(filters = {}) {
    const params = new URLSearchParams()
    if (filters.brand && filters.brand !== 'All') params.append('brand', filters.brand)
    if (filters.temp && filters.temp !== 'All') params.append('temp', filters.temp)
    if (filters.search) params.append('search', filters.search)
    if (filters.sortBy) params.append('sortBy', filters.sortBy)
    if (filters.sortOrder) params.append('sortOrder', filters.sortOrder)

    const url = `${PRODUCTS_API}${params.toString() ? '?' + params.toString() : ''}`
    const res = await fetch(url)
    if (!res.ok) {
      const err = await res.json().catch(() => ({}))
      throw new Error(err.error || 'Failed to fetch products')
    }
    return res.json()
  },

  // Create new product (Admin authenticated)
  async createProduct(productData) {
    const token = authService.getToken()
    const res = await fetch(PRODUCTS_API, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(productData),
    })

    const data = await res.json()
    if (!res.ok) {
      throw new Error(data.error || 'Failed to create product')
    }
    return data
  },

  // Update existing product
  async updateProduct(id, productData) {
    const token = authService.getToken()
    const res = await fetch(`${PRODUCTS_API}/${encodeURIComponent(id)}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(productData),
    })

    const data = await res.json()
    if (!res.ok) {
      throw new Error(data.error || 'Failed to update product')
    }
    return data
  },

  // Delete product
  async deleteProduct(id) {
    const token = authService.getToken()
    const res = await fetch(`${PRODUCTS_API}/${encodeURIComponent(id)}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    const data = await res.json()
    if (!res.ok) {
      throw new Error(data.error || 'Failed to delete product')
    }
    return data
  },
}
