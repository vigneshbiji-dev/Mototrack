import Expense from '../models/Expense.js'
import { verifyBikeOwnership, getUserBikeIds } from '../utils/bikeOwnership.js'
import { applyDateRange, applyTextSearch } from '../utils/queryFilters.js'

export const createExpense = async (req, res) => {
  try {
    const bike = await verifyBikeOwnership(req.body.bike, req.user)
    if (!bike) return res.status(404).json({ message: 'Bike not found' })

    const { category, storeName, description, amount, date, paymentMethod, notes } = req.body
    if (!category || amount == null) {
      return res.status(400).json({ message: 'Category and amount are required' })
    }

    const expense = await Expense.create({
      bike: bike._id,
      category,
      storeName,
      description,
      amount,
      date: date || new Date(),
      paymentMethod,
      notes,
    })

    const populated = await expense.populate('bike', 'brand model')
    res.status(201).json(populated)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const getExpenses = async (req, res) => {
  try {
    const userBikeIds = await getUserBikeIds(req.user)
    const filter = { bike: { $in: userBikeIds } }

    if (req.query.bike) {
      if (!userBikeIds.some((id) => id.toString() === req.query.bike)) {
        return res.status(403).json({ message: 'Not authorized for this bike' })
      }
      filter.bike = req.query.bike
    }

    if (req.query.category) filter.category = req.query.category

    applyDateRange(filter, req.query.from, req.query.to)
    applyTextSearch(filter, req.query.search, ['description', 'storeName', 'category', 'notes'])

    const expenses = await Expense.find(filter)
      .populate('bike', 'brand model')
      .sort({ date: -1 })

    res.json(expenses)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const getExpenseById = async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id).populate('bike', 'brand model')
    if (!expense) return res.status(404).json({ message: 'Expense not found' })

    const bike = await verifyBikeOwnership(expense.bike._id, req.user)
    if (!bike) return res.status(403).json({ message: 'Not authorized' })

    res.json(expense)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const updateExpense = async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id)
    if (!expense) return res.status(404).json({ message: 'Expense not found' })

    const bike = await verifyBikeOwnership(expense.bike, req.user)
    if (!bike) return res.status(403).json({ message: 'Not authorized' })

    if (req.body.bike) {
      const newBike = await verifyBikeOwnership(req.body.bike, req.user)
      if (!newBike) return res.status(404).json({ message: 'Bike not found' })
      expense.bike = newBike._id
    }

    const fields = ['category', 'storeName', 'description', 'amount', 'date', 'paymentMethod', 'notes']
    fields.forEach((f) => {
      if (req.body[f] !== undefined) expense[f] = req.body[f]
    })

    const updated = await expense.save()
    const populated = await updated.populate('bike', 'brand model')
    res.json(populated)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const deleteExpense = async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id).populate('bike')
    if (!expense) return res.status(404).json({ message: 'Expense not found' })

    const bike = await verifyBikeOwnership(expense.bike._id, req.user)
    if (!bike) return res.status(403).json({ message: 'Not authorized' })

    await expense.deleteOne()
    res.json({ message: 'Expense deleted' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}
