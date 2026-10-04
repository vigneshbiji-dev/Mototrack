import api from './api'

interface AuthResponse {
  _id: string
  name: string
  email: string
  token: string
  message: string
}

export interface UserPreferences {
  currency: string
  distanceUnit: 'km' | 'mi'
  emailNotifications: boolean
  theme: 'dark' | 'light'
}

export interface UserProfile {
  _id: string
  name: string
  email: string
  preferences?: UserPreferences
  createdAt?: string
}

export const register = async (name: string, email: string, password: string) => {
  const { data } = await api.post<AuthResponse>('/auth/register', { name, email, password })
  return data
}

export const login = async (email: string, password: string) => {
  const { data } = await api.post<AuthResponse>('/auth/login', { email, password })
  return data
}

export const getProfile = async () => {
  const { data } = await api.get<UserProfile>('/auth/profile')
  return data
}

export const updateProfile = async (payload: { name?: string; email?: string }) => {
  const { data } = await api.put<UserProfile>('/auth/profile', payload)
  return data
}

export const changePassword = async (currentPassword: string, newPassword: string) => {
  const { data } = await api.put<{ message: string }>('/auth/change-password', {
    currentPassword,
    newPassword,
  })
  return data
}

export const updateSettings = async (preferences: Partial<UserPreferences>) => {
  const { data } = await api.put<{ preferences: UserPreferences }>('/auth/settings', { preferences })
  return data
}
