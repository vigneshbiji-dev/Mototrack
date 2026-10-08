import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowRight, Mail, Lock } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import AuthLayout from '../components/AuthLayout'
import { getApiErrorMessage } from '../utils/getApiErrorMessage'
import { getEmailError } from '../utils/validateEmail'

const inputClass =
  'w-full rounded-2xl border border-white/[0.08] bg-white/[0.04] py-4 pr-4 pl-12 text-base text-white outline-none transition-all placeholder:text-text-subtle focus:border-accent/50 focus:bg-white/[0.06] focus:ring-2 focus:ring-accent/20'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    const emailError = getEmailError(email)
    if (emailError) {
      setError(emailError)
      return
    }
    setLoading(true)
    try {
      await login(email.trim(), password)
      navigate('/dashboard')
    } catch (err: unknown) {
      setError(getApiErrorMessage(err, 'Login failed'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Sign in to access your garage, fuel logs, and ride analytics."
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="rounded-2xl bg-red-500/10 px-5 py-4 text-sm text-red-400">{error}</div>
        )}

        <div className="space-y-5">
          <div>
            <label className="mb-2 block text-sm font-medium text-text-muted">Email address</label>
            <div className="relative">
              <Mail size={18} className="absolute top-1/2 left-4 -translate-y-1/2 text-text-subtle" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className={inputClass}
                placeholder="you@example.com"
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-text-muted">Password</label>
            <div className="relative">
              <Lock size={18} className="absolute top-1/2 left-4 -translate-y-1/2 text-text-subtle" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className={inputClass}
                placeholder="Enter your password"
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="group flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-accent-dark to-accent py-4 text-base font-semibold text-white shadow-lg shadow-accent/25 transition-all hover:shadow-accent/40 hover:brightness-110 disabled:opacity-50"
        >
          {loading ? 'Signing in...' : 'Sign In'}
          {!loading && (
            <ArrowRight
              size={18}
              className="transition-transform group-hover:translate-x-1"
            />
          )}
        </button>

        <p className="text-center text-base text-text-muted">
          Don't have an account?{' '}
          <Link to="/register" className="font-medium text-accent hover:underline">
            Create one free
          </Link>
        </p>
      </form>
    </AuthLayout>
  )
}
