import { useEffect, useState } from 'react'
import { getProfile, updateSettings, type UserPreferences } from '../services/authService'
import { useAuth } from '../context/AuthContext'
import { getApiErrorMessage } from '../utils/getApiErrorMessage'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'
import LoadingSpinner from '../components/ui/LoadingSpinner'

const inputClass =
  'w-full rounded-xl border border-border bg-bg px-4 py-3 text-sm text-text outline-none focus:border-accent'

export default function Settings() {
  const { logout } = useAuth()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [prefs, setPrefs] = useState<UserPreferences>({
    currency: 'INR',
    distanceUnit: 'km',
    emailNotifications: true,
    theme: 'dark',
  })

  useEffect(() => {
    getProfile()
      .then((data) => {
        if (data.preferences) setPrefs(data.preferences)
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setMessage('')
    setSaving(true)
    try {
      await updateSettings(prefs)
      setMessage('Settings saved')
    } catch (err) {
      setError(getApiErrorMessage(err))
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <LoadingSpinner label="Loading settings..." />

  return (
    <div className="mx-auto max-w-xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-text">Settings</h1>
        <p className="mt-1 text-text-muted">Application preferences and account controls</p>
      </div>

      {(message || error) && (
        <div className={`rounded-xl px-4 py-3 text-sm ${error ? 'bg-red-500/10 text-red-400' : 'bg-primary/20 text-accent'}`}>
          {error || message}
        </div>
      )}

      <Card>
        <form onSubmit={handleSave} className="space-y-6">
          <div>
            <h2 className="mb-4 text-sm font-semibold uppercase text-text-muted">Preferences</h2>
            <div className="space-y-4">
              <div>
                <label className="mb-1.5 block text-sm text-text-muted">Currency</label>
                <select value={prefs.currency} onChange={(e) => setPrefs({ ...prefs, currency: e.target.value })} className={inputClass}>
                  <option value="INR">INR (₹)</option>
                  <option value="USD">USD ($)</option>
                </select>
              </div>
              <div>
                <label className="mb-1.5 block text-sm text-text-muted">Distance Unit</label>
                <select value={prefs.distanceUnit} onChange={(e) => setPrefs({ ...prefs, distanceUnit: e.target.value as 'km' | 'mi' })} className={inputClass}>
                  <option value="km">Kilometres</option>
                  <option value="mi">Miles</option>
                </select>
              </div>
              <label className="flex items-center gap-3 text-sm text-text">
                <input
                  type="checkbox"
                  checked={prefs.emailNotifications}
                  onChange={(e) => setPrefs({ ...prefs, emailNotifications: e.target.checked })}
                  className="rounded border-border accent-accent"
                />
                Email notifications (coming soon)
              </label>
            </div>
          </div>

          <Button type="submit" disabled={saving}>{saving ? 'Saving...' : 'Save Settings'}</Button>
        </form>
      </Card>

      <Card>
        <h2 className="mb-4 text-sm font-semibold uppercase text-text-muted">Session</h2>
        <p className="mb-4 text-sm text-text-muted">Sign out of your M2T account on this device.</p>
        <Button type="button" variant="secondary" onClick={logout}>Log Out</Button>
      </Card>
    </div>
  )
}
