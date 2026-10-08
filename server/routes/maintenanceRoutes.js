import express from 'express'
import protect from '../middleware/authMiddleware.js'
import {
  getCatalog,
  getSmartReminders,
  matchScheduleForBike,
} from '../controllers/maintenanceController.js'

const router = express.Router()

router.get('/catalog', getCatalog)
router.use(protect)
router.get('/smart-reminders', getSmartReminders)
router.get('/match/:bikeId', matchScheduleForBike)

export default router
