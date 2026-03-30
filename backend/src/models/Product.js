import mongoose from 'mongoose'

const productSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  price: { type: Number, required: true, min: 0 },
  images: [{ type: String }],          // URLs de imágenes
  category: { type: String, required: true },
  sizes: [{ type: String }],           // ['36','37','38','39','40','41','42']
  stock: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
  views: { type: Number, default: 0 },
  whatsappClicks: { type: Number, default: 0 },
  slug: { type: String, unique: true }
}, { timestamps: true })

// Auto-generar slug
productSchema.pre('save', function(next) {
  if (this.isModified('name')) {
    this.slug = this.name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '')
  }
  next()
})

export default mongoose.model('Product', productSchema)