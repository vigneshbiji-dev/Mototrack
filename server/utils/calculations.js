export const calculateDistance = (currentOdometer, previousOdometer) => {
  if (currentOdometer == null || previousOdometer == null) return null
  const distance = currentOdometer - previousOdometer
  return distance > 0 ? distance : null
}

// Typical motorcycle range — rejects bad odometer data (e.g. 2000 km/L)
export const MIN_PLAUSIBLE_MILEAGE = 8
export const MAX_PLAUSIBLE_MILEAGE = 120
export const MAX_PLAUSIBLE_DISTANCE_KM = 1500

export const calculateMileage = (distance, fuelQuantity) => {
  if (!distance || !fuelQuantity || fuelQuantity <= 0) return null
  if (distance > MAX_PLAUSIBLE_DISTANCE_KM) return null
  const mileage = distance / fuelQuantity
  if (mileage < MIN_PLAUSIBLE_MILEAGE || mileage > MAX_PLAUSIBLE_MILEAGE) return null
  return Math.round(mileage * 10) / 10
}

export const calculateTotalFuelCost = (fuelPrice, quantity) => {
  if (fuelPrice == null || quantity == null) return null
  return fuelPrice * quantity
}

export const calculateCostPerKm = (totalFuelCost, distance) => {
  if (!totalFuelCost || !distance || distance <= 0) return null
  return totalFuelCost / distance
}
