import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '@/services/api'

export const useCategoriesStore = defineStore('categories', () => {
  const categories = ref([])
  const loading = ref(false)

  const fetchCategories = async () => {
    loading.value = true
    try {
      const { data } = await api.get('/categories')
      categories.value = data
    } finally {
      loading.value = false
    }
  }

  const fetchAll = async () => {
    const { data } = await api.get('/categories/all')
    categories.value = data
    return data
  }

  return { categories, loading, fetchCategories, fetchAll }
})