import api from './api'

export interface ReminderInput {
  bike: string
  type: 'Service' | 'Insurance' | 'PUC' | 'Custom'
  title: string
  dueDate: string
  dueOdometer?: number
  notes?: string
}

export interface Reminder {
  _id: string
  bike: { _id: string; brand: string; model: string } | string
  type: ReminderInput['type']
  title: string
  dueDate: string
  dueOdometer?: number
  notes?: string
  completed: boolean
  createdAt: string
}

export interface ReminderFilters {
  bike?: string
  type?: string
  completed?: boolean
  from?: string
  to?: string
}

export const getReminders = async (filters: ReminderFilters = {}) => {
  const params: Record<string, string> = {}
  if (filters.bike) params.bike = filters.bike
  if (filters.type) params.type = filters.type
  if (filters.from) params.from = filters.from
  if (filters.to) params.to = filters.to
  if (filters.completed !== undefined) params.completed = String(filters.completed)

  const { data } = await api.get<Reminder[]>('/reminders', { params })
  return data
}

export const getUpcomingReminders = async () => {
  const { data } = await api.get<Reminder[]>('/reminders/upcoming')
  return data
}

export const createReminder = async (reminder: ReminderInput) => {
  const { data } = await api.post<Reminder>('/reminders', reminder)
  return data
}

export const updateReminder = async (id: string, reminder: Partial<ReminderInput & { completed: boolean }>) => {
  const { data } = await api.put<Reminder>(`/reminders/${id}`, reminder)
  return data
}

export const deleteReminder = async (id: string) => {
  const { data } = await api.delete(`/reminders/${id}`)
  return data
}
