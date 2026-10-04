import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getBikes } from '../services/bikeService'
import { createServiceLog, getServiceLogById, updateServiceLog } from '../services/serviceService'
import { getApiErrorMessage } from '../utils/getApiErrorMessage'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'

const SERVICE_TYPES = [
  'Periodic Service', 'Oil Change', 'Chain Service', 'Brake Service',
  'Tyre Replacement', 'Battery', 'Electrical', 'Engine', 'Other Repair',
]

const inputClass =
  'w-full rounded-xl border border-border bg-bg px-4 py-3 text-sm text-text outline-none transition-all focus:border-accent focus:ring-2 focus:ring-accent/20'

export default function AddService() {
  const { id } = useParams()
  const isEdit = Boolean(id)
  const navigate = useNavigate()
  const [bikes, setBikes] = useState<{ _id: string; brand: string; model: string; currentOdometer: number }[]>([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(isEdit)

  const [form, setForm] = useState({
    bike: '',
    serviceType: 'Periodic Service',
    date: new Date().toISOString().slice(0, 10),
    odometer: '',
    description: '',
    partsCost: '',
    labourCost: '',
  })

  useEffect(() => {
    const load = async () => {
      const bikeList = await getBikes()
      setBikes(bikeList)

      if (id) {
        try {
          const log = await getServiceLogById(id)
          const bikeId = typeof log.bike === 'object' ? log.bike._id : log.bike
          setForm({
            bike: bikeId,
            serviceType: log.serviceType,
            date: new Date(log.date).toISOString().slice(0, 10),
            odometer: log.odometer != null ? String(log.odometer) : '',
            description: log.description || '',
            partsCost: String(log.partsCost || 0),
            labourCost: String(log.labourCost || 0),
          })
        } catch {
          setError('Failed to load service record')
        } finally {
          setFetching(false)
        }
      } else if (bikeList[0]) {
        setForm((f) => ({ ...f, bike: bikeList[0]._id, odometer: String(bikeList[0].currentOdometer || '') }))
        setFetching(false)
      } else {
        setFetching(false)
      }
    }
    load()
  }, [id])

  const totalCost =
    form.partsCost || form.labourCost
      ? (Number(form.partsCost || 0) + Number(form.labourCost || 0)).toFixed(0)
      : '0'

  const set = (key: string, value: string) => setForm((f) => ({ ...f, [key]: value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    const payload = {
      bike: form.bike,
      serviceType: form.serviceType,
      date: form.date,
      odometer: form.odometer ? Number(form.odometer) : undefined,
      description: form.description,
      partsCost: Number(form.partsCost || 0),
      labourCost: Number(form.labourCost || 0),
    }
    try {
      if (isEdit && id) await updateServiceLog(id, payload)
      else await createServiceLog(payload)
      navigate('/service')
    } catch (err) {
      setError(getApiErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  if (fetching) return <p className="text-text-muted">Loading...</p>

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-text">{isEdit ? 'Edit Service' : 'Add Service'}</h1>
        <p className="mt-1 text-text-muted">Record maintenance work and costs</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && <div className="rounded-xl bg-red-500/10 px-4 py-3 text-sm text-red-400">{error}</div>}

        <Card className="space-y-4">
          <div>
            <label className="mb-1.5 block text-sm text-text-muted">Bike</label>
            <select value={form.bike} onChange={(e) => set('bike', e.target.value)} required className={inputClass}>
              {bikes.map((b) => (
                <option key={b._id} value={b._id}>{b.brand} {b.model}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1.5 block text-sm text-text-muted">Service Type</label>
            <select value={form.serviceType} onChange={(e) => set('serviceType', e.target.value)} className={inputClass}>
              {SERVICE_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-sm text-text-muted">Date</label>
              <input type="date" value={form.date} onChange={(e) => set('date', e.target.value)} className={inputClass} />
            </div>
            <div>
              <label className="mb-1.5 block text-sm text-text-muted">Odometer (km)</label>
              <input type="number" value={form.odometer} onChange={(e) => set('odometer', e.target.value)} className={inputClass} />
            </div>
          </div>
          <div>
            <label className="mb-1.5 block text-sm text-text-muted">Description</label>
            <textarea value={form.description} onChange={(e) => set('description', e.target.value)} rows={3} className={inputClass} placeholder="What was done..." />
          </div>
        </Card>

        <Card className="space-y-4">
          <h2 className="text-sm font-semibold text-text-muted uppercase">Costs</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-sm text-text-muted">Parts Cost (₹)</label>
              <input type="number" value={form.partsCost} onChange={(e) => set('partsCost', e.target.value)} className={inputClass} />
            </div>
            <div>
              <label className="mb-1.5 block text-sm text-text-muted">Labour Cost (₹)</label>
              <input type="number" value={form.labourCost} onChange={(e) => set('labourCost', e.target.value)} className={inputClass} />
            </div>
          </div>
          <div>
            <label className="mb-1.5 block text-sm text-text-muted">Total Cost</label>
            <div className="rounded-xl border border-border bg-primary/10 px-4 py-3 text-lg font-semibold text-accent">
              ₹{totalCost}
            </div>
            <p className="mt-1 text-xs text-text-subtle">Calculated automatically: parts + labour</p>
          </div>
        </Card>

        <div className="flex gap-3">
          <Button type="submit" disabled={loading || !form.bike}>{loading ? 'Saving...' : isEdit ? 'Save Changes' : 'Save Service'}</Button>
          <Button type="button" variant="secondary" onClick={() => navigate('/service')}>Cancel</Button>
        </div>
      </form>
    </div>
  )
}
