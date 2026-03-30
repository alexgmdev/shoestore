import { Router } from 'express'
import { protect, adminOnly } from '../middleware/auth.middleware.js'
import {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser
} from '../controllers/userController.js'

const router = Router()

router.use(protect, adminOnly) // Todas las rutas de usuario son solo admin

router.get('/', getAllUsers)
router.get('/:id', getUserById)
router.put('/:id', updateUser)
router.delete('/:id', deleteUser)

export default router