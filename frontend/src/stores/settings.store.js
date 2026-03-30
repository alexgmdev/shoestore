import { defineStore } from 'pinia'
import { ref, computed } from 'vue'  // ← agrega computed aquí
import api from '@/services/api'

export const useSettingsStore = defineStore('settings', () => {
  const whatsappNumber = ref('')
  const storeName = ref('')
  const storeEmail = ref('')
  const storeAddress = ref('')
  const heroImages = ref([])
  const currentHeroIndex = ref(0)

  const currentHeroImage = computed(() =>
    heroImages.value[currentHeroIndex.value] || heroImages.value[0]
  )

  const fetchSettings = async () => {
    try {
      const { data } = await api.get('/settings')
      whatsappNumber.value = data.whatsappNumber
      storeName.value = data.storeName
      storeEmail.value = data.storeEmail
      storeAddress.value = data.storeAddress
      heroImages.value = Array.isArray(data.heroImages) && data.heroImages.length
        ? data.heroImages
        : [data.imageInicio || '']
    } catch {}
  }

  const updateSettings = async (payload) => {
    const { data } = await api.put('/settings', payload)
    whatsappNumber.value = data.whatsappNumber
    storeName.value = data.storeName
    storeEmail.value = data.storeEmail
    storeAddress.value = data.storeAddress
     heroImages.value = Array.isArray(data.heroImages) && data.heroImages.length
    ? data.heroImages
    : [data.imageInicio || ''] 
  }

  return {
    whatsappNumber, storeName, storeEmail, storeAddress,
    heroImages, currentHeroIndex, currentHeroImage,
    fetchSettings, updateSettings
  }
})