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
  const { data } = await api.get<Reminder[]>('/reminders', { params: filters })
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
