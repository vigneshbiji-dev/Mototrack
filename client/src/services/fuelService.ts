import api from './api'

export interface FuelLogInput {
  bike: string
  fuelType?: string
  date?: string
  fuelPrice: number
  quantity: number
  fuelStation?: string
  location?: string
  paymentMethod?: string
  cardName?: string
  cardLast4?: string
  odometer: number
  meterMileage?: number
  drivingStyle?: string
}

export interface FuelLog {
  _id: string
  bike: { _id: string; brand: string; model: string } | string
  fuelType?: string
  date?: string
  fuelPrice: number
  quantity: number
  totalAmount: number
  fuelStation?: string
  location?: string
  paymentMethod?: string
  cardName?: string
  cardLast4?: string
  odometer?: number
  meterMileage?: number
  drivingStyle?: string
  calculatedMileage?: number
  createdAt: string
}

export interface FuelFilters {
  bike?: string
  search?: string
  from?: string
  to?: string
}

export const getFuelLogs = async (filters: string | FuelFilters = {}) => {
  const params = typeof filters === 'string' ? { bike: filters } : filters
  const { data } = await api.get<FuelLog[]>('/fuel', { params })
  return data
}

export const createFuelLog = async (log: FuelLogInput) => {
  const { data } = await api.post<FuelLog>('/fuel', log)
  return data
}

export const getFuelLogById = async (id: string) => {
  const { data } = await api.get<FuelLog>(`/fuel/${id}`)
  return data
}

export const updateFuelLog = async (id: string, log: Partial<FuelLogInput>) => {
  const { data } = await api.put<FuelLog>(`/fuel/${id}`, log)
  return data
}

export const deleteFuelLog = async (id: string) => {
  const { data } = await api.delete(`/fuel/${id}`)
  return data
}
