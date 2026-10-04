import api from './api'

export interface ExpenseInput {
  bike: string
  category: string
  storeName?: string
  description?: string
  amount: number
  date?: string
  paymentMethod?: string
  notes?: string
}

export interface Expense {
  _id: string
  bike: { _id: string; brand: string; model: string } | string
  category: string
  storeName?: string
  description?: string
  amount: number
  date: string
  paymentMethod?: string
  notes?: string
  createdAt: string
}

export interface ExpenseFilters {
  bike?: string
  category?: string
  search?: string
  from?: string
  to?: string
}

export const getExpenses = async (filters: ExpenseFilters = {}) => {
  const { data } = await api.get<Expense[]>('/expenses', { params: filters })
  return data
}

export const getExpenseById = async (id: string) => {
  const { data } = await api.get<Expense>(`/expenses/${id}`)
  return data
}

export const createExpense = async (expense: ExpenseInput) => {
  const { data } = await api.post<Expense>('/expenses', expense)
  return data
}

export const updateExpense = async (id: string, expense: Partial<ExpenseInput>) => {
  const { data } = await api.put<Expense>(`/expenses/${id}`, expense)
  return data
}

export const deleteExpense = async (id: string) => {
  const { data } = await api.delete(`/expenses/${id}`)
  return data
}
