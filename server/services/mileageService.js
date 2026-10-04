import FuelLog from '../models/FuelLog.js'
import {
  calculateDistance,
  calculateMileage,
  MAX_PLAUSIBLE_MILEAGE,
  MIN_PLAUSIBLE_MILEAGE,
} from '../utils/calculations.js'

const sortFuelLogsChronologically = (logs) =>
  [...logs].sort((a, b) => {
    const dateDiff = new Date(a.date || a.createdAt) - new Date(b.date || b.createdAt)
    if (dateDiff !== 0) return dateDiff
    return new Date(a.createdAt) - new Date(b.createdAt)
  })

/**
 * Tank-to-tank mileage: (current odometer − previous fill odometer) ÷ litres at this fill.
 * First fill-up never gets auto mileage — there is no prior fill to measure from.
 */
export const recalculateMileageForBike = async (bikeId) => {
  const logs = await FuelLog.find({ bike: bikeId })
  const sorted = sortFuelLogsChronologically(logs)

  let previousOdometer = null

  for (const log of sorted) {
    const calculatedMileage =
      previousOdometer != null
        ? calculateMileage(calculateDistance(log.odometer, previousOdometer), log.quantity)
        : null

    if (log.calculatedMileage !== calculatedMileage) {
      log.calculatedMileage = calculatedMileage
      await log.save()
    }

    previousOdometer = log.odometer
  }
}

const groupLogsByBike = (fuelLogs) => {
  const byBike = {}
  for (const log of fuelLogs) {
    const bikeId = log.bike?._id?.toString() || log.bike?.toString()
    if (!bikeId) continue
    if (!byBike[bikeId]) byBike[bikeId] = []
    byBike[bikeId].push(log)
  }
  return byBike
}

const resolveLogMileage = (log, previousOdometer) => {
  if (previousOdometer != null) {
    const calculated = calculateMileage(
      calculateDistance(log.odometer, previousOdometer),
      log.quantity
    )
    if (calculated != null) return { mileage: calculated, distance: log.odometer - previousOdometer }
  }

  if (
    log.meterMileage != null &&
    log.meterMileage >= MIN_PLAUSIBLE_MILEAGE &&
    log.meterMileage <= MAX_PLAUSIBLE_MILEAGE
  ) {
    return {
      mileage: log.meterMileage,
      distance: log.quantity > 0 ? log.meterMileage * log.quantity : null,
    }
  }

  return { mileage: null, distance: null }
}

/** Compute average mileage and total distance from fuel logs (no DB writes). */
export const computeFuelMileageStats = (fuelLogs) => {
  const mileageValues = []
  let totalDistance = 0

  for (const logs of Object.values(groupLogsByBike(fuelLogs))) {
    const sorted = sortFuelLogsChronologically(logs)
    let previousOdometer = null

    for (const log of sorted) {
      const { mileage, distance } = resolveLogMileage(log, previousOdometer)
      if (mileage != null) mileageValues.push(mileage)
      if (distance != null && distance > 0) totalDistance += distance
      previousOdometer = log.odometer
    }
  }

  const averageMileage =
    mileageValues.length > 0
      ? Math.round((mileageValues.reduce((a, b) => a + b, 0) / mileageValues.length) * 10) / 10
      : null

  return { averageMileage, totalDistance }
}
