import ServiceLog from '../models/ServiceLog.js'
import { verifyBikeOwnership, getUserBikeIds } from '../utils/bikeOwnership.js'
import { applyDateRange, applyTextSearch } from '../utils/queryFilters.js'

const calcTotal = (partsCost = 0, labourCost = 0) =>
  Number(partsCost || 0) + Number(labourCost || 0)

export const createServiceLog = async (req, res) => {
  try {
    const bike = await verifyBikeOwnership(req.body.bike, req.user)
    if (!bike) return res.status(404).json({ message: 'Bike not found' })

    const { serviceType, date, odometer, description, partsCost, labourCost } = req.body
    if (!serviceType) {
      return res.status(400).json({ message: 'Service type is required' })
    }

    const totalCost = calcTotal(partsCost, labourCost)

    if (odometer != null && odometer > bike.currentOdometer) {
      bike.currentOdometer = odometer
      await bike.save()
    }

    const log = await ServiceLog.create({
      bike: bike._id,
      serviceType,
      date: date || new Date(),
      odometer,
      description,
      partsCost: partsCost || 0,
      labourCost: labourCost || 0,
      totalCost,
    })

    const populated = await log.populate('bike', 'brand model')
    res.status(201).json(populated)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const getServiceLogs = async (req, res) => {
  try {
    const userBikeIds = await getUserBikeIds(req.user)
    const filter = { bike: { $in: userBikeIds } }

    if (req.query.bike) {
      if (!userBikeIds.some((id) => id.toString() === req.query.bike)) {
        return res.status(403).json({ message: 'Not authorized for this bike' })
      }
      filter.bike = req.query.bike
    }

    if (req.query.serviceType) filter.serviceType = req.query.serviceType

    applyDateRange(filter, req.query.from, req.query.to)
    applyTextSearch(filter, req.query.search, ['serviceType', 'description'])

    const logs = await ServiceLog.find(filter)
      .populate('bike', 'brand model')
      .sort({ date: -1 })

    res.json(logs)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const getServiceLogById = async (req, res) => {
  try {
    const log = await ServiceLog.findById(req.params.id).populate('bike', 'brand model')
    if (!log) return res.status(404).json({ message: 'Service log not found' })

    const bike = await verifyBikeOwnership(log.bike._id, req.user)
    if (!bike) return res.status(403).json({ message: 'Not authorized' })

    res.json(log)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const updateServiceLog = async (req, res) => {
  try {
    const log = await ServiceLog.findById(req.params.id)
    if (!log) return res.status(404).json({ message: 'Service log not found' })

    const bike = await verifyBikeOwnership(log.bike, req.user)
    if (!bike) return res.status(403).json({ message: 'Not authorized' })

    if (req.body.bike) {
      const newBike = await verifyBikeOwnership(req.body.bike, req.user)
      if (!newBike) return res.status(404).json({ message: 'Bike not found' })
      log.bike = newBike._id
    }

    const fields = ['serviceType', 'date', 'odometer', 'description', 'partsCost', 'labourCost']
    fields.forEach((f) => {
      if (req.body[f] !== undefined) log[f] = req.body[f]
    })

    log.totalCost = calcTotal(log.partsCost, log.labourCost)

    if (log.odometer != null && log.odometer > bike.currentOdometer) {
      bike.currentOdometer = log.odometer
      await bike.save()
    }

    const updated = await log.save()
    const populated = await updated.populate('bike', 'brand model')
    res.json(populated)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const deleteServiceLog = async (req, res) => {
  try {
    const log = await ServiceLog.findById(req.params.id).populate('bike')
    if (!log) return res.status(404).json({ message: 'Service log not found' })

    const bike = await verifyBikeOwnership(log.bike._id, req.user)
    if (!bike) return res.status(403).json({ message: 'Not authorized' })

    await log.deleteOne()
    res.json({ message: 'Service log deleted' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}
