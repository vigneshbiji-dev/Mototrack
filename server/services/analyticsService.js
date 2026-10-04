import Bike from '../models/Bike.js'
import FuelLog from '../models/FuelLog.js'
import ServiceLog from '../models/ServiceLog.js'
import Expense from '../models/Expense.js'
import Reminder from '../models/Reminder.js'
import { getUserBikeIds } from '../utils/bikeOwnership.js'
import { computeFuelMileageStats } from '../services/mileageService.js'

const sum = (arr, key) => arr.reduce((s, item) => s + (item[key] || 0), 0)

const buildBikeComparison = (bikes, fuelLogs, serviceLogs, expenses) =>
  bikes.map((bike) => {
    const bikeId = bike._id.toString()
    const bikeFuel = fuelLogs.filter((l) => (l.bike?._id?.toString() || l.bike?.toString()) === bikeId)
    const bikeService = serviceLogs.filter((l) => (l.bike?._id?.toString() || l.bike?.toString()) === bikeId)
    const bikeExpenses = expenses.filter((l) => (l.bike?._id?.toString() || l.bike?.toString()) === bikeId)

    const fuel = sum(bikeFuel, 'totalAmount')
    const service = sum(bikeService, 'totalCost')
    const expenseTotal = sum(bikeExpenses, 'amount')
    const { averageMileage, totalDistance } = computeFuelMileageStats(bikeFuel)

    return {
      _id: bike._id,
      brand: bike.brand,
      model: bike.model,
      fuel,
      service,
      expenses: expenseTotal,
      total: fuel + service + expenseTotal,
      averageMileage,
      totalDistance,
      costPerKm: totalDistance > 0 ? fuel / totalDistance : null,
      serviceCount: bikeService.length,
      fuelFillCount: bikeFuel.length,
    }
  })

export const getDashboardAnalytics = async (userId) => {
  const bikeIds = await getUserBikeIds(userId)
  const bikes = await Bike.find({ owner: userId }).sort({ createdAt: -1 })

  const [fuelLogs, serviceLogs, expenses, upcomingReminders] = await Promise.all([
    FuelLog.find({ bike: { $in: bikeIds } }).populate('bike', 'brand model').sort({ date: -1 }),
    ServiceLog.find({ bike: { $in: bikeIds } }).populate('bike', 'brand model').sort({ date: -1 }),
    Expense.find({ bike: { $in: bikeIds } }).populate('bike', 'brand model').sort({ date: -1 }),
    Reminder.find({ owner: userId, completed: false }).populate('bike', 'brand model').sort({ dueDate: 1 }).limit(1),
  ])

  const totalFuelCost = sum(fuelLogs, 'totalAmount')
  const totalServiceCost = sum(serviceLogs, 'totalCost')
  const totalExpenses = sum(expenses, 'amount')
  const totalOwnershipCost = totalFuelCost + totalServiceCost + totalExpenses

  const { averageMileage, totalDistance } = computeFuelMileageStats(fuelLogs)
  const costPerKm = totalDistance > 0 ? totalFuelCost / totalDistance : null
  const totalFuelQuantity = sum(fuelLogs, 'quantity')

  const now = new Date()
  const monthlyFuel = []
  const monthlyOwnership = []
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
    const monthStart = new Date(d.getFullYear(), d.getMonth(), 1)
    const monthEnd = new Date(d.getFullYear(), d.getMonth() + 1, 0, 23, 59, 59)
    const label = d.toLocaleString('en', { month: 'short' })

    const fuelAmt = fuelLogs
      .filter((l) => l.date >= monthStart && l.date <= monthEnd)
      .reduce((s, l) => s + (l.totalAmount || 0), 0)
    const serviceAmt = serviceLogs
      .filter((l) => l.date >= monthStart && l.date <= monthEnd)
      .reduce((s, l) => s + (l.totalCost || 0), 0)
    const expenseAmt = expenses
      .filter((l) => l.date >= monthStart && l.date <= monthEnd)
      .reduce((s, l) => s + (l.amount || 0), 0)

    monthlyFuel.push({ month: label, amount: fuelAmt })
    monthlyOwnership.push({
      month: label,
      fuel: fuelAmt,
      service: serviceAmt,
      expenses: expenseAmt,
      total: fuelAmt + serviceAmt + expenseAmt,
    })
  }

  const lastService = serviceLogs[0] || null
  const nextReminder = upcomingReminders[0] || null

  const activity = [
    ...fuelLogs.map((log) => ({
      type: 'fuel',
      title: 'Fuel Added',
      bike: log.bike ? `${log.bike.brand} ${log.bike.model}` : 'Unknown',
      detail: `${log.quantity} L • ₹${log.totalAmount?.toFixed(0)}`,
      date: log.date,
      amount: log.totalAmount,
    })),
    ...serviceLogs.map((log) => ({
      type: 'service',
      title: log.serviceType,
      bike: log.bike ? `${log.bike.brand} ${log.bike.model}` : 'Unknown',
      detail: log.odometer ? `${log.odometer.toLocaleString()} km` : '',
      date: log.date,
      amount: log.totalCost,
    })),
    ...expenses.map((log) => ({
      type: 'expense',
      title: log.description || log.category,
      bike: log.bike ? `${log.bike.brand} ${log.bike.model}` : 'Unknown',
      detail: log.storeName || log.category,
      date: log.date,
      amount: log.amount,
    })),
  ]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 8)

  const bikeAnalytics = buildBikeComparison(bikes, fuelLogs, serviceLogs, expenses)

  const serviceByType = {}
  serviceLogs.forEach((log) => {
    serviceByType[log.serviceType] = (serviceByType[log.serviceType] || 0) + (log.totalCost || 0)
  })

  const expenseByCategory = {}
  expenses.forEach((log) => {
    expenseByCategory[log.category] = (expenseByCategory[log.category] || 0) + (log.amount || 0)
  })

  return {
    totalBikes: bikes.length,
    totalFuelCost,
    totalServiceCost,
    totalExpenses,
    totalOwnershipCost,
    averageMileage,
    costPerKm,
    totalDistance,
    totalFuelQuantity,
    serviceCount: serviceLogs.length,
    expenseCount: expenses.length,
    monthlyFuel,
    monthlyOwnership,
    lastService: lastService
      ? { date: lastService.date, serviceType: lastService.serviceType, totalCost: lastService.totalCost }
      : null,
    nextReminder: nextReminder
      ? {
          title: nextReminder.title,
          type: nextReminder.type,
          dueDate: nextReminder.dueDate,
          bike: nextReminder.bike ? `${nextReminder.bike.brand} ${nextReminder.bike.model}` : '',
        }
      : null,
    recentActivity: activity,
    bikeAnalytics,
    bikeComparison: bikeAnalytics,
    serviceByType,
    expenseByCategory,
    bikes: bikes.map((b) => ({
      _id: b._id,
      brand: b.brand,
      model: b.model,
      year: b.year,
      engineCapacity: b.engineCapacity,
      currentOdometer: b.currentOdometer,
      fuelType: b.fuelType,
      imageUrl: b.imageUrl,
    })),
  }
}
