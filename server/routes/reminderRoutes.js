import express from 'express'
import protect from '../middleware/authMiddleware.js'
import {
  createReminder,
  getReminders,
  getUpcomingReminders,
  updateReminder,
  deleteReminder,
} from '../controllers/reminderController.js'

const router = express.Router()

router.use(protect)

router.get('/upcoming', getUpcomingReminders)
router.route('/').get(getReminders).post(createReminder)
router.route('/:id').put(updateReminder).delete(deleteReminder)

export default router
