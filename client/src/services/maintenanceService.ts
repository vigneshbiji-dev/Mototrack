import api from './api'

export interface SmartServiceReminder {
  bikeId: string
  brand: string
  model: string
  currentOdometer: number
  scheduleFound: boolean
  verified: boolean
  status: 'overdue' | 'due_soon' | 'upcoming' | 'up_to_date' | 'no_schedule'
  message?: string
  serviceLabel?: string
  recommendedKm?: number | null
  recommendedDate?: string | null
  kmRemaining?: number | null
  daysRemaining?: number | null
  kmOverdueBy?: number | null
  intervalLabel?: string
  schedule?: {
    manufacturer: string
    model: string
    verified: boolean
    source: string
    sourceUrl: string
    notes?: string
    serviceIntervalKm?: number
    serviceIntervalMonths?: number
  } | null
  lastService?: {
    date: string
    odometer: number
    serviceType: string
  } | null
}

export interface SmartRemindersResponse {
  items: SmartServiceReminder[]
  grouped: {
    overdue: SmartServiceReminder[]
    due_soon: SmartServiceReminder[]
    upcoming: SmartServiceReminder[]
    up_to_date: SmartServiceReminder[]
    no_schedule: SmartServiceReminder[]
  }
}

export interface MaintenanceCatalogEntry {
  _id: string
  manufacturer: string
  model: string
  market: string
  verified: boolean
  serviceIntervalKm?: number
  serviceIntervalMonths?: number
  firstService?: { km?: number; months?: number }
  recurringService?: { km?: number; months?: number }
  source?: string
  sourceUrl?: string
  notes?: string
}

export const getSmartReminders = async () => {
  const { data } = await api.get<SmartRemindersResponse>('/maintenance/smart-reminders')
  return data
}

export const getMaintenanceCatalog = async () => {
  const { data } = await api.get<MaintenanceCatalogEntry[]>('/maintenance/catalog')
  return data
}
