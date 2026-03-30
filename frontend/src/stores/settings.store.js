import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '@/services/api'

export const useSettingsStore = defineStore('settings', () => {
  const whatsappNumber = ref('573185923836')
  const storeName = ref('ShoeStore')
  const storeEmail = ref('')
  const storeAddress = ref('')
  const imageInicio = ref('https://cdn.shopify.com/s/files/1/0603/3031/1875/files/1_ff9bcd78-3d95-4f78-99ac-b858e330c6af_750x.jpg?=75&v=1706157679')

  const fetchSettings = async () => {
    try {
      const { data } = await api.get('/settings')
      whatsappNumber.value = data.whatsappNumber
      storeName.value = data.storeName
      storeEmail.value = data.storeEmail
      storeAddress.value = data.storeAddress
      imageInicio.value = data.imageInicio
    } catch {}
  }

  const updateSettings = async (payload) => {
    const { data } = await api.put('/settings', payload)
    whatsappNumber.value = data.whatsappNumber
    storeName.value = data.storeName
    storeEmail.value = data.storeEmail
    storeAddress.value = data.storeAddress
    imageInicio.value = data.imageInicio
  }

  return { whatsappNumber, storeName, storeEmail, storeAddress, imageInicio, fetchSettings, updateSettings }
})