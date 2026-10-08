import { useEffect, useState } from 'react'
import { changePassword, getProfile, updateProfile } from '../services/authService'
import { useAuth } from '../context/AuthContext'
import { getApiErrorMessage } from '../utils/getApiErrorMessage'
import { getEmailError } from '../utils/validateEmail'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'
import LoadingSpinner from '../components/ui/LoadingSpinner'

const inputClass =
  'w-full rounded-xl border border-border bg-bg px-4 py-3 text-sm text-text outline-none focus:border-accent focus:ring-2 focus:ring-accent/20'

export default function Profile() {
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [pwSaving, setPwSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [profile, setProfile] = useState({ name: '', email: '' })
  const [passwords, setPasswords] = useState({ current: '', next: '', confirm: '' })

  useEffect(() => {
    getProfile()
      .then((data) => setProfile({ name: data.name, email: data.email }))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const handleProfileSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setMessage('')
    const emailError = getEmailError(profile.email)
    if (emailError) {
      setError(emailError)
      return
    }
    setSaving(true)
    try {
      await updateProfile({ ...profile, email: profile.email.trim() })
      setMessage('Profile updated successfully')
    } catch (err) {
      setError(getApiErrorMessage(err))
    } finally {
      setSaving(false)
    }
  }

  const handlePasswordSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setMessage('')
    if (passwords.next !== passwords.confirm) {
      setError('New passwords do not match')
      return
    }
    if (passwords.next.length < 6) {
      setError('New password must be at least 6 characters')
      return
    }
    setPwSaving(true)
    try {
      await changePassword(passwords.current, passwords.next)
      setPasswords({ current: '', next: '', confirm: '' })
      setMessage('Password changed successfully')
    } catch (err) {
      setError(getApiErrorMessage(err))
    } finally {
      setPwSaving(false)
    }
  }

  if (loading) return <LoadingSpinner label="Loading profile..." />

  return (
    <div className="mx-auto max-w-xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-text">Profile</h1>
        <p className="mt-1 text-text-muted">Manage your account information</p>
      </div>

      {(message || error) && (
        <div className={`rounded-xl px-4 py-3 text-sm ${error ? 'bg-red-500/10 text-red-400' : 'bg-primary/20 text-accent'}`}>
          {error || message}
        </div>
      )}

      <Card>
        <div className="mb-6 flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/30 text-2xl font-bold text-accent">
            {profile.name?.charAt(0)?.toUpperCase() || user?.name?.charAt(0)?.toUpperCase()}
          </div>
          <div>
            <p className="font-semibold text-text">{profile.name}</p>
            <p className="text-sm text-text-muted">{profile.email}</p>
          </div>
        </div>

        <form onSubmit={handleProfileSave} className="space-y-4">
          <h2 className="text-sm font-semibold uppercase text-text-muted">Personal Information</h2>
          <div>
            <label className="mb-1.5 block text-sm text-text-muted">Name</label>
            <input value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })} required className={inputClass} />
          </div>
          <div>
            <label className="mb-1.5 block text-sm text-text-muted">Email</label>
            <input type="email" value={profile.email} onChange={(e) => setProfile({ ...profile, email: e.target.value })} required className={inputClass} />
          </div>
          <Button type="submit" disabled={saving}>{saving ? 'Saving...' : 'Save Profile'}</Button>
        </form>
      </Card>

      <Card>
        <form onSubmit={handlePasswordSave} className="space-y-4">
          <h2 className="text-sm font-semibold uppercase text-text-muted">Change Password</h2>
          <div>
            <label className="mb-1.5 block text-sm text-text-muted">Current Password</label>
            <input type="password" value={passwords.current} onChange={(e) => setPasswords({ ...passwords, current: e.target.value })} required className={inputClass} />
          </div>
          <div>
            <label className="mb-1.5 block text-sm text-text-muted">New Password</label>
            <input type="password" value={passwords.next} onChange={(e) => setPasswords({ ...passwords, next: e.target.value })} required minLength={6} className={inputClass} />
          </div>
          <div>
            <label className="mb-1.5 block text-sm text-text-muted">Confirm New Password</label>
            <input type="password" value={passwords.confirm} onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })} required className={inputClass} />
          </div>
          <Button type="submit" disabled={pwSaving}>{pwSaving ? 'Updating...' : 'Change Password'}</Button>
        </form>
      </Card>
    </div>
  )
}
