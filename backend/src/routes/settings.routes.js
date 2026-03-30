import { Router } from 'express'
import { protect, adminOnly } from '../middleware/auth.middleware.js'
import { getSettings, updateSettings } from '../controllers/settingsController.js'

const router = Router()

router.get('/', getSettings)                            // Público (frontend lo necesita)
router.put('/', protect, adminOnly, updateSettings)     // Solo admin puede editar

export default router