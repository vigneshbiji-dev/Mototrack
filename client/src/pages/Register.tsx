import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowRight, Mail, Lock, User } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import AuthLayout from '../components/AuthLayout'
import { getApiErrorMessage } from '../utils/getApiErrorMessage'
import { getEmailError } from '../utils/validateEmail'

const inputClass =
  'w-full rounded-2xl border border-white/[0.08] bg-white/[0.04] py-4 pr-4 pl-12 text-base text-white outline-none transition-all placeholder:text-text-subtle focus:border-accent/50 focus:bg-white/[0.06] focus:ring-2 focus:ring-accent/20'

export default function Register() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { register } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    const emailError = getEmailError(email)
    if (emailError) {
      setError(emailError)
      return
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }

    setLoading(true)
    try {
      await register(name.trim(), email.trim(), password)
      navigate('/dashboard')
    } catch (err: unknown) {
      setError(getApiErrorMessage(err, 'Registration failed'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthLayout
      title="Create your account"
      subtitle="Join M2T and start tracking every bike in your garage."
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="rounded-2xl bg-red-500/10 px-5 py-4 text-sm text-red-400">{error}</div>
        )}

        <div className="space-y-5">
          <div>
            <label className="mb-2 block text-sm font-medium text-text-muted">Full name</label>
            <div className="relative">
              <User size={18} className="absolute top-1/2 left-4 -translate-y-1/2 text-text-subtle" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className={inputClass}
                placeholder="Your name"
              />
            </div>
          </div>

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

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-text-muted">Password</label>
              <div className="relative">
                <Lock size={18} className="absolute top-1/2 left-4 -translate-y-1/2 text-text-subtle" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  className={inputClass}
                  placeholder="Min 6 chars"
                />
              </div>
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-text-muted">Confirm</label>
              <div className="relative">
                <Lock size={18} className="absolute top-1/2 left-4 -translate-y-1/2 text-text-subtle" />
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className={inputClass}
                  placeholder="Repeat password"
                />
              </div>
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="group flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-accent-dark to-accent py-4 text-base font-semibold text-white shadow-lg shadow-accent/25 transition-all hover:shadow-accent/40 hover:brightness-110 disabled:opacity-50"
        >
          {loading ? 'Creating account...' : 'Create Account'}
          {!loading && (
            <ArrowRight
              size={18}
              className="transition-transform group-hover:translate-x-1"
            />
          )}
        </button>

        <p className="text-center text-base text-text-muted">
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-accent hover:underline">
            Sign in
          </Link>
        </p>
      </form>
    </AuthLayout>
  )
}
