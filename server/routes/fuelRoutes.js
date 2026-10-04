import express from 'express'
import protect from '../middleware/authMiddleware.js'
import {
  createFuelLog,
  getFuelLogs,
  getFuelLogById,
  updateFuelLog,
  deleteFuelLog,
} from '../controllers/fuelController.js'

const router = express.Router()

router.use(protect)

router.route('/').get(getFuelLogs).post(createFuelLog)
router.route('/:id').get(getFuelLogById).put(updateFuelLog).delete(deleteFuelLog)

export default router
