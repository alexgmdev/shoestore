import 'dotenv/config'
import mongoose from 'mongoose'
import User from './models/User.js'
import Product from './models/Product.js'
import Settings from './models/Settings.js'
import Category from './models/Category.js'

await mongoose.connect(process.env.MONGO_URI)

// Limpiar colecciones
await Promise.all([User.deleteMany(), Product.deleteMany(), Settings.deleteMany()])

// Crear admin
await User.create({
  name: 'Administrador',
  email: 'admin@shoestore.com',
  password: 'Admin123!',
  role: 'admin'
})

// Crear settings
await Settings.create({
  whatsappNumber: '573001234567',
  storeName: 'ShoeStore',
  storeEmail: 'contacto@shoestore.com',
  storeAddress: 'Cali, Valle del Cauca, Colombia'
})

// Crear productos de ejemplo
await Product.insertMany([
  {
    name: 'Air Classic Negro',
    description: 'Zapatilla urbana con suela de goma y diseño minimalista. Perfecta para el día a día.',
    price: 180000,
    images: ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800'],
    category: 'Urbano',
    sizes: ['38', '39', '40', '41', '42', '43'],
    stock: 15,
    slug: 'air-classic-negro'
  },
  {
    name: 'Runner Pro Blanco',
    description: 'Zapatilla de running con tecnología de amortiguación avanzada y corte bajo.',
    price: 220000,
    images: ['https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=800'],
    category: 'Running',
    sizes: ['37', '38', '39', '40', '41', '42'],
    stock: 8,
    slug: 'runner-pro-blanco'
  },
  {
    name: 'Street Boot Cuero',
    description: 'Bota de cuero genuino con suela antideslizante. Estilo urbano con durabilidad premium.',
    price: 350000,
    images: ['https://images.unsplash.com/photo-1608256246200-53e635b5b65f?w=800'],
    category: 'Botas',
    sizes: ['39', '40', '41', '42', '43'],
    stock: 5,
    slug: 'street-boot-cuero'
  }
])

//categorias
await Category.deleteMany()
await Category.insertMany([
  { name: 'Urbano', order: 1 },
  { name: 'Running', order: 2 },
  { name: 'Botas', order: 3 },
  { name: 'Casual', order: 4 }
])
console.log('✅ Categorías creadas')

console.log('✅ Seed completado')
console.log('📧 Admin: admin@shoestore.com')
console.log('🔑 Password: Admin123!')

await mongoose.disconnect()