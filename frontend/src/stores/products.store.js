import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '@/services/api'

export const useProductsStore = defineStore('products', () => {
  const products = ref([])
  const currentProduct = ref(null)
  const total = ref(0)
  const pages = ref(1)
  const loading = ref(false)

  const fetchProducts = async (filters = {}) => {
    loading.value = true
    try {
      const { data } = await api.get('/products', { params: filters })
      products.value = data.products
      total.value = data.total
      pages.value = data.pages
    } finally {
      loading.value = false
    }
  }

  const fetchProduct = async (slug) => {
    loading.value = true
    try {
      const { data } = await api.get(`/products/${slug}`)
      currentProduct.value = data
      return data
    } finally {
      loading.value = false
    }
  }

  return { products, currentProduct, total, pages, loading, fetchProducts, fetchProduct }
})