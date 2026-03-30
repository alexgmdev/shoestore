import mongoose from 'mongoose'

const settingsSchema = new mongoose.Schema({
  whatsappNumber: { type: String, default: '573001234567' }, // Colombia format
  storeName: { type: String, default: 'ShoeStore' },
  storeEmail: String,
  storeAddress: String,
  imageInicio: { type: String, default: 'https://cdn.shopify.com/s/files/1/0603/3031/1875/files/3_fd9d795a-401a-4576-8be8-77746b0374c0_1920x.jpg?=75&v=1706157678' }
}, { timestamps: true })

export default mongoose.model('Settings', settingsSchema)