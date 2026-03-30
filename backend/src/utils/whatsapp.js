/**
 * Genera la URL de WhatsApp con mensaje prellenado
 * @param {Object} params
 */
export const generateWhatsAppUrl = ({ phone, productName, price, size, productUrl }) => {
  const sizeText = size ? `\n📏 Talla: *${size}*` : ''
  const message = `Hola, estoy interesado en este producto 👟\n\n` +
    `📦 Producto: *${productName}*\n` +
    `💵 Precio: *$${price.toLocaleString('es-CO')} COP*` +
    `${sizeText}\n` +
    `🔗 Link: ${productUrl}`

  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`
}