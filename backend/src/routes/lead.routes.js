import { Router } from 'express'
import { protect, adminOnly } from '../middleware/auth.middleware.js'
import { getAllLeads, getLeadsByProduct } from '../controllers/leadController.js'

const router = Router()

router.use(protect, adminOnly)

router.get('/', getAllLeads)
router.get('/product/:productId', getLeadsByProduct)

export default router