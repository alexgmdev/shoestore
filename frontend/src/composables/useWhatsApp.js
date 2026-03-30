import { ref } from 'vue'
import api from '@/services/api'
import { useSettingsStore } from '@/stores/settings.store'

export function useWhatsApp() {
  const settingsStore = useSettingsStore()

  const openWhatsApp = async ({ product, selectedSize, userEmail }) => {
    const phone = settingsStore.whatsappNumber
    const productUrl = `${window.location.origin}/producto/${product.slug}`
    const sizeText = selectedSize ? `\n📏 Talla: *${selectedSize}*` : ''

    const message =
      `Hola, estoy interesado en este producto 👟\n\n` +
      `📦 Producto: *${product.name}*\n` +
      `💵 Precio: *$${product.price.toLocaleString('es-CO')} COP*` +
      `${sizeText}\n` +
      `🔗 Link: ${productUrl}`

    const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`

    // Registrar lead en backend (no bloquea la apertura)
    api.post('/products/track-whatsapp', {
      productId: product._id,
      selectedSize,
      userEmail
    }).catch(() => {})

    window.open(url, '_blank', 'noopener,noreferrer')
  }

  return { openWhatsApp }
}