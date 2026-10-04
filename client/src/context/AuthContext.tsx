import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import * as authService from '../services/authService'

interface User {
  _id: string
  name: string
  email: string
  token: string
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<void>
  register: (name: string, email: string, password: string) => Promise<void>
  logout: () => void
  loading: boolean
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const stored = localStorage.getItem('m2t_user')
    if (stored) {
      setUser(JSON.parse(stored))
    }
    setLoading(false)
  }, [])

  const saveUser = (data: User) => {
    setUser(data)
    localStorage.setItem('m2t_user', JSON.stringify(data))
  }

  const login = async (email: string, password: string) => {
    const data = await authService.login(email, password)
    saveUser({ _id: data._id, name: data.name, email: data.email, token: data.token })
  }

  const register = async (name: string, email: string, password: string) => {
    const data = await authService.register(name, email, password)
    saveUser({ _id: data._id, name: data.name, email: data.email, token: data.token })
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('m2t_user')
    window.location.href = '/login'
  }

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
