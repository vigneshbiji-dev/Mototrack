import Reminder from '../models/Reminder.js'
import { verifyBikeOwnership } from '../utils/bikeOwnership.js'
import { applyDateRange } from '../utils/queryFilters.js'

export const createReminder = async (req, res) => {
  try {
    const bike = await verifyBikeOwnership(req.body.bike, req.user)
    if (!bike) return res.status(404).json({ message: 'Bike not found' })

    const { type, title, dueDate, dueOdometer, notes } = req.body
    if (!type || !title || !dueDate) {
      return res.status(400).json({ message: 'Type, title, and due date are required' })
    }

    const reminder = await Reminder.create({
      owner: req.user,
      bike: bike._id,
      type,
      title,
      dueDate,
      dueOdometer,
      notes,
    })

    const populated = await reminder.populate('bike', 'brand model')
    res.status(201).json(populated)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const getReminders = async (req, res) => {
  try {
    const filter = { owner: req.user }
    if (req.query.bike) {
      const bike = await verifyBikeOwnership(req.query.bike, req.user)
      if (!bike) return res.status(403).json({ message: 'Not authorized for this bike' })
      filter.bike = req.query.bike
    }
    if (req.query.type) filter.type = req.query.type
    if (req.query.completed === 'true') filter.completed = true
    if (req.query.completed === 'false') filter.completed = false
    applyDateRange(filter, req.query.from, req.query.to)

    const reminders = await Reminder.find(filter)
      .populate('bike', 'brand model')
      .sort({ dueDate: 1 })

    res.json(reminders)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const getUpcomingReminders = async (req, res) => {
  try {
    const now = new Date()
    const in30Days = new Date()
    in30Days.setDate(in30Days.getDate() + 30)

    const reminders = await Reminder.find({
      owner: req.user,
      completed: false,
      dueDate: { $lte: in30Days },
    })
      .populate('bike', 'brand model')
      .sort({ dueDate: 1 })
      .limit(5)

    res.json(reminders)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const updateReminder = async (req, res) => {
  try {
    const reminder = await Reminder.findOne({ _id: req.params.id, owner: req.user })
    if (!reminder) return res.status(404).json({ message: 'Reminder not found' })

    if (req.body.bike) {
      const bike = await verifyBikeOwnership(req.body.bike, req.user)
      if (!bike) return res.status(404).json({ message: 'Bike not found' })
      reminder.bike = bike._id
    }

    ;['type', 'title', 'dueDate', 'dueOdometer', 'notes', 'completed'].forEach((field) => {
      if (req.body[field] !== undefined) reminder[field] = req.body[field]
    })

    const updated = await reminder.save()
    const populated = await updated.populate('bike', 'brand model')
    res.json(populated)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const deleteReminder = async (req, res) => {
  try {
    const reminder = await Reminder.findOne({ _id: req.params.id, owner: req.user })
    if (!reminder) return res.status(404).json({ message: 'Reminder not found' })
    await reminder.deleteOne()
    res.json({ message: 'Reminder deleted' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}
