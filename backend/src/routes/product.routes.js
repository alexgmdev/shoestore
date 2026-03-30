import { Router } from 'express'
import { protect, adminOnly } from '../middleware/auth.middleware.js'
import {
  getProducts, getProduct, trackWhatsAppClick,
  createProduct, updateProduct, deleteProduct
} from '../controllers/productController.js'

const router = Router()

router.get('/', getProducts)
router.get('/:slug', getProduct)
router.post('/track-whatsapp', trackWhatsAppClick)  // público (log lead)

// Rutas admin protegidas
router.post('/', protect, adminOnly, createProduct)
router.put('/:id', protect, adminOnly, updateProduct)
router.delete('/:id', protect, adminOnly, deleteProduct)

export default router