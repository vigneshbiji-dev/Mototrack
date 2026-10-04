import express from 'express'
import protect from '../middleware/authMiddleware.js'
import {
  createServiceLog,
  getServiceLogs,
  getServiceLogById,
  updateServiceLog,
  deleteServiceLog,
} from '../controllers/serviceController.js'

const router = express.Router()

router.use(protect)

router.route('/').get(getServiceLogs).post(createServiceLog)
router.route('/:id').get(getServiceLogById).put(updateServiceLog).delete(deleteServiceLog)

export default router
