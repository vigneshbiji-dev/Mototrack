import Bike from '../models/Bike.js'
import MaintenanceSchedule from '../models/MaintenanceSchedule.js'
import { getSmartRemindersForUser } from '../services/serviceReminderService.js'
import { findScheduleForBike } from '../services/maintenanceMatchService.js'

export const getCatalog = async (_req, res) => {
  try {
    const schedules = await MaintenanceSchedule.find({ active: true, market: 'India' }).sort({
      manufacturer: 1,
      model: 1,
    })
    res.json(schedules)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const getSmartReminders = async (req, res) => {
  try {
    const bikes = await Bike.find({ owner: req.user }).sort({ createdAt: -1 })
    const data = await getSmartRemindersForUser(bikes)
    res.json(data)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const matchScheduleForBike = async (req, res) => {
  try {
    const bike = await Bike.findOne({ _id: req.params.bikeId, owner: req.user })
    if (!bike) return res.status(404).json({ message: 'Bike not found' })

    const schedule = await findScheduleForBike(bike.brand, bike.model)
    res.json({ bike: { _id: bike._id, brand: bike.brand, model: bike.model }, schedule })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}
