import api from './api'

export interface ServiceLogInput {
  bike: string
  serviceType: string
  date?: string
  odometer?: number
  description?: string
  partsCost?: number
  labourCost?: number
}

export interface ServiceLog {
  _id: string
  bike: { _id: string; brand: string; model: string } | string
  serviceType: string
  date: string
  odometer?: number
  description?: string
  partsCost: number
  labourCost: number
  totalCost: number
  createdAt: string
}

export interface ServiceFilters {
  bike?: string
  serviceType?: string
  search?: string
  from?: string
  to?: string
}

export const getServiceLogs = async (filters: ServiceFilters = {}) => {
  const { data } = await api.get<ServiceLog[]>('/services', { params: filters })
  return data
}

export const getServiceLogById = async (id: string) => {
  const { data } = await api.get<ServiceLog>(`/services/${id}`)
  return data
}

export const createServiceLog = async (log: ServiceLogInput) => {
  const { data } = await api.post<ServiceLog>('/services', log)
  return data
}

export const updateServiceLog = async (id: string, log: Partial<ServiceLogInput>) => {
  const { data } = await api.put<ServiceLog>(`/services/${id}`, log)
  return data
}

export const deleteServiceLog = async (id: string) => {
  const { data } = await api.delete(`/services/${id}`)
  return data
}
