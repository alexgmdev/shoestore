import mongoose from 'mongoose'

const settingsSchema = new mongoose.Schema({
  whatsappNumber: { type: String, default: '573001234567' }, // Colombia format
  storeName: { type: String, default: 'ShoeStore' },
  storeEmail: String,
  storeAddress: String,
  heroImages: {
  type: [String],
  default: ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=900']
}
}, { timestamps: true })

export default mongoose.model('Settings', settingsSchema)