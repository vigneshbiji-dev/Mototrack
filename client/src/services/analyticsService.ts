import api from './api'

export interface BikeComparison {
  _id: string
  brand: string
  model: string
  fuel: number
  service: number
  expenses: number
  total: number
  averageMileage: number | null
  totalDistance: number | null
  costPerKm: number | null
  serviceCount: number
  fuelFillCount: number
}

export interface DashboardData {
  totalBikes: number
  totalFuelCost: number
  totalServiceCost: number
  totalExpenses: number
  totalOwnershipCost: number
  averageMileage: number | null
  costPerKm: number | null
  totalDistance: number | null
  totalFuelQuantity: number | null
  serviceCount: number
  expenseCount: number
  monthlyFuel: { month: string; amount: number }[]
  monthlyOwnership: { month: string; fuel: number; service: number; expenses: number; total: number }[]
  lastService: { date: string; serviceType: string; totalCost: number } | null
  nextReminder: { title: string; type: string; dueDate: string; bike: string } | null
  recentActivity: {
    type: string
    title: string
    bike: string
    detail: string
    date: string
    amount: number
  }[]
  bikeAnalytics: BikeComparison[]
  bikeComparison: BikeComparison[]
  serviceByType: Record<string, number>
  expenseByCategory: Record<string, number>
  bikes: {
    _id: string
    brand: string
    model: string
    year: number
    engineCapacity?: number
    currentOdometer: number
    fuelType: string
    imageUrl?: string
  }[]
}

export const getDashboard = async (): Promise<DashboardData> => {
  const { data } = await api.get('/analytics/dashboard')
  return data
}
