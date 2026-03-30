import { Router } from 'express'
import { protect, adminOnly } from '../middleware/auth.middleware.js'
import {
  getCategories,
  getAllCategories,
  createCategory,
  updateCategory,
  deleteCategory
} from '../controllers/categoryController.js'

const router = Router()

router.get('/', getCategories)                              // Público — frontend
router.get('/all', protect, adminOnly, getAllCategories)    // Admin — incluye inactivas
router.post('/', protect, adminOnly, createCategory)
router.put('/:id', protect, adminOnly, updateCategory)
router.delete('/:id', protect, adminOnly, deleteCategory)

export default router