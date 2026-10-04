import express from 'express'
import protect from '../middleware/authMiddleware.js'
import {
  createExpense,
  getExpenses,
  getExpenseById,
  updateExpense,
  deleteExpense,
} from '../controllers/expenseController.js'

const router = express.Router()

router.use(protect)

router.route('/').get(getExpenses).post(createExpense)
router.route('/:id').get(getExpenseById).put(updateExpense).delete(deleteExpense)

export default router
