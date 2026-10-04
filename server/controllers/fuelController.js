import FuelLog from '../models/FuelLog.js'
import { verifyBikeOwnership, getUserBikeIds } from '../utils/bikeOwnership.js'
import { recalculateMileageForBike } from '../services/mileageService.js'
import { calculateTotalFuelCost } from '../utils/calculations.js'
import { applyDateRange, applyTextSearch } from '../utils/queryFilters.js'

export const createFuelLog = async (req, res) => {
  try {
    const bike = await verifyBikeOwnership(req.body.bike, req.user)
    if (!bike) return res.status(404).json({ message: 'Bike not found' })

    const {
      fuelType,
      date,
      fuelPrice,
      quantity,
      fuelStation,
      location,
      paymentMethod,
      cardName,
      cardLast4,
      odometer,
      meterMileage,
      drivingStyle,
    } = req.body

    if (!fuelPrice || !quantity || odometer == null) {
      return res.status(400).json({ message: 'Fuel price, quantity, and odometer are required' })
    }

    const totalAmount = calculateTotalFuelCost(fuelPrice, quantity)

    const fuelLog = await FuelLog.create({
      bike: bike._id,
      fuelType: fuelType || bike.fuelType,
      date: date || new Date(),
      fuelPrice,
      quantity,
      totalAmount,
      fuelStation,
      location,
      paymentMethod,
      cardName,
      cardLast4,
      odometer: Number(odometer),
      meterMileage,
      drivingStyle,
    })

    await recalculateMileageForBike(bike._id)

    if (Number(odometer) > bike.currentOdometer) {
      bike.currentOdometer = Number(odometer)
      await bike.save()
    }

    const populated = await FuelLog.findById(fuelLog._id).populate('bike', 'brand model')
    res.status(201).json(populated)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const getFuelLogs = async (req, res) => {
  try {
    const userBikeIds = await getUserBikeIds(req.user)
    const filter = { bike: { $in: userBikeIds } }

    if (req.query.bike) {
      if (!userBikeIds.some((id) => id.toString() === req.query.bike)) {
        return res.status(403).json({ message: 'Not authorized for this bike' })
      }
      filter.bike = req.query.bike
    }

    applyDateRange(filter, req.query.from, req.query.to)
    applyTextSearch(filter, req.query.search, ['fuelStation', 'location', 'fuelType'])

    const logs = await FuelLog.find(filter)
      .populate('bike', 'brand model')
      .sort({ date: -1 })

    const bikeIds = [...new Set(logs.map((log) => log.bike._id?.toString() || log.bike.toString()))]
    await Promise.all(bikeIds.map((bikeId) => recalculateMileageForBike(bikeId)))

    const refreshed = await FuelLog.find(filter)
      .populate('bike', 'brand model')
      .sort({ date: -1 })

    res.json(refreshed)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const getFuelLogById = async (req, res) => {
  try {
    const log = await FuelLog.findById(req.params.id).populate('bike', 'brand model')
    if (!log) return res.status(404).json({ message: 'Fuel log not found' })

    const bike = await verifyBikeOwnership(log.bike._id, req.user)
    if (!bike) return res.status(403).json({ message: 'Not authorized' })

    res.json(log)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const updateFuelLog = async (req, res) => {
  try {
    const log = await FuelLog.findById(req.params.id)
    if (!log) return res.status(404).json({ message: 'Fuel log not found' })

    const bike = await verifyBikeOwnership(log.bike, req.user)
    if (!bike) return res.status(403).json({ message: 'Not authorized' })

    if (req.body.bike) {
      const newBike = await verifyBikeOwnership(req.body.bike, req.user)
      if (!newBike) return res.status(404).json({ message: 'Bike not found' })
      log.bike = newBike._id
    }

    const {
      fuelType,
      date,
      fuelPrice,
      quantity,
      fuelStation,
      location,
      paymentMethod,
      cardName,
      cardLast4,
      odometer,
      meterMileage,
      drivingStyle,
    } = req.body

    if (fuelType !== undefined) log.fuelType = fuelType
    if (date !== undefined) log.date = date
    if (fuelPrice !== undefined) log.fuelPrice = fuelPrice
    if (quantity !== undefined) log.quantity = quantity
    if (fuelStation !== undefined) log.fuelStation = fuelStation
    if (location !== undefined) log.location = location
    if (paymentMethod !== undefined) log.paymentMethod = paymentMethod
    if (cardName !== undefined) log.cardName = cardName
    if (cardLast4 !== undefined) log.cardLast4 = cardLast4
    if (odometer !== undefined) log.odometer = odometer
    if (meterMileage !== undefined) log.meterMileage = meterMileage
    if (drivingStyle !== undefined) log.drivingStyle = drivingStyle

    log.totalAmount = calculateTotalFuelCost(log.fuelPrice, log.quantity)

    const updated = await log.save()
    await recalculateMileageForBike(log.bike)

    const targetBike = await verifyBikeOwnership(log.bike, req.user)
    if (log.odometer > targetBike.currentOdometer) {
      targetBike.currentOdometer = log.odometer
      await targetBike.save()
    }

    const populated = await FuelLog.findById(updated._id).populate('bike', 'brand model')
    res.json(populated)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const deleteFuelLog = async (req, res) => {
  try {
    const log = await FuelLog.findById(req.params.id).populate('bike')
    if (!log) return res.status(404).json({ message: 'Fuel log not found' })

    const bike = await verifyBikeOwnership(log.bike._id, req.user)
    if (!bike) return res.status(403).json({ message: 'Not authorized' })

    const bikeId = log.bike._id
    await log.deleteOne()
    await recalculateMileageForBike(bikeId)
    res.json({ message: 'Fuel log deleted' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}
