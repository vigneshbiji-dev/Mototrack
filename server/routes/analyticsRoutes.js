import express from 'express'
import protect from '../middleware/authMiddleware.js'
import { getDashboard } from '../controllers/analyticsController.js'

const router = express.Router()

router.use(protect)
router.get('/dashboard', getDashboard)

export default router
