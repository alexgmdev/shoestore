import mongoose from 'mongoose'

const leadSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  productName: String,
  productPrice: Number,
  selectedSize: String,
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  userEmail: String,
  ip: String
}, { timestamps: true })

export default mongoose.model('Lead', leadSchema)