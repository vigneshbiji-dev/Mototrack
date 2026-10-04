import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getBikes } from '../services/bikeService'
import { createFuelLog, getFuelLogById, getFuelLogs, updateFuelLog } from '../services/fuelService'
import { getApiErrorMessage } from '../utils/getApiErrorMessage'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'

const inputClass =
  'w-full rounded-xl border border-border bg-bg px-4 py-3 text-sm text-text outline-none transition-all focus:border-accent focus:ring-2 focus:ring-accent/20'

export default function AddFuel() {
  const { id } = useParams()
  const isEdit = Boolean(id)
  const navigate = useNavigate()
  const [bikes, setBikes] = useState<{ _id: string; brand: string; model: string; fuelType: string; currentOdometer: number }[]>([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(isEdit)
  const [lastFillOdometer, setLastFillOdometer] = useState<number | null>(null)

  const [form, setForm] = useState({
    bike: '',
    fuelType: 'Petrol',
    fuelPrice: '',
    quantity: '',
    fuelStation: '',
    location: '',
    paymentMethod: 'Cash',
    cardName: '',
    cardLast4: '',
    odometer: '',
    meterMileage: '',
    drivingStyle: 'Mixed',
    date: new Date().toISOString().slice(0, 16),
  })

  const loadLastFill = async (bikeId: string, excludeId?: string) => {
    const logs = await getFuelLogs(bikeId)
    const previous = logs
      .filter((log) => log._id !== excludeId)
      .sort((a, b) => new Date(b.date || b.createdAt).getTime() - new Date(a.date || a.createdAt).getTime())[0]
    setLastFillOdometer(previous?.odometer ?? null)
  }

  useEffect(() => {
    const load = async () => {
      const bikeList = await getBikes()
      setBikes(bikeList)

      if (id) {
        try {
          const log = await getFuelLogById(id)
          const bikeId = typeof log.bike === 'object' ? log.bike._id : log.bike
          setForm({
            bike: bikeId,
            fuelType: log.fuelType || 'Petrol',
            fuelPrice: String(log.fuelPrice),
            quantity: String(log.quantity),
            fuelStation: log.fuelStation || '',
            location: log.location || '',
            paymentMethod: log.paymentMethod || 'Cash',
            cardName: log.cardName || '',
            cardLast4: log.cardLast4 || '',
            odometer: String(log.odometer ?? ''),
            meterMileage: log.meterMileage ? String(log.meterMileage) : '',
            drivingStyle: log.drivingStyle || 'Mixed',
            date: log.date
              ? new Date(log.date).toISOString().slice(0, 16)
              : new Date().toISOString().slice(0, 16),
          })
          await loadLastFill(bikeId, id)
        } catch {
          setError('Failed to load fuel log')
        } finally {
          setFetching(false)
        }
      } else if (bikeList[0]) {
        setForm((f) => ({
          ...f,
          bike: bikeList[0]._id,
          fuelType: bikeList[0].fuelType,
          odometer: '',
        }))
        await loadLastFill(bikeList[0]._id)
        setFetching(false)
      } else {
        setFetching(false)
      }
    }
    load()
  }, [id])

  const totalAmount =
    form.fuelPrice && form.quantity
      ? (Number(form.fuelPrice) * Number(form.quantity)).toFixed(2)
      : '—'

  const set = (key: string, value: string) => setForm((f) => ({ ...f, [key]: value }))

  const handleBikeChange = async (bikeId: string) => {
    const bike = bikes.find((b) => b._id === bikeId)
    setForm((f) => ({
      ...f,
      bike: bikeId,
      fuelType: bike?.fuelType || f.fuelType,
      odometer: '',
    }))
    await loadLastFill(bikeId, id)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    const payload = {
      bike: form.bike,
      fuelType: form.fuelType,
      date: form.date,
      fuelPrice: Number(form.fuelPrice),
      quantity: Number(form.quantity),
      fuelStation: form.fuelStation,
      location: form.location,
      paymentMethod: form.paymentMethod,
      cardName: form.cardName,
      cardLast4: form.cardLast4,
      odometer: Number(form.odometer),
      meterMileage: form.meterMileage ? Number(form.meterMileage) : undefined,
      drivingStyle: form.drivingStyle,
    }
    try {
      if (isEdit && id) {
        await updateFuelLog(id, payload)
      } else {
        await createFuelLog(payload)
      }
      navigate('/fuel')
    } catch (err) {
      setError(getApiErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  if (fetching) {
    return <p className="text-text-muted">Loading fuel log...</p>
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-text">
          {isEdit ? 'Edit Fuel Log' : 'Add Fuel Log'}
        </h1>
        <p className="mt-1 text-text-muted">
          {isEdit ? 'Update fuel entry and recalculate mileage' : 'Track fuel consumption and mileage'}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="rounded-xl bg-red-500/10 px-4 py-3 text-sm text-red-400">{error}</div>
        )}

        <Card>
          <h2 className="mb-4 text-sm font-semibold text-text-muted uppercase">Fuel Details</h2>
          <div className="space-y-4">
            <div>
              <label className="mb-1.5 block text-sm text-text-muted">Bike</label>
              <select
                value={form.bike}
                onChange={(e) => handleBikeChange(e.target.value)}
                required
                className={inputClass}
              >
                {bikes.map((b) => (
                  <option key={b._id} value={b._id}>
                    {b.brand} {b.model}
                  </option>
                ))}
              </select>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-sm text-text-muted">Fuel Price/L (₹)</label>
                <input type="number" step="0.01" value={form.fuelPrice} onChange={(e) => set('fuelPrice', e.target.value)} required className={inputClass} placeholder="105" />
              </div>
              <div>
                <label className="mb-1.5 block text-sm text-text-muted">Quantity (L)</label>
                <input type="number" step="0.1" value={form.quantity} onChange={(e) => set('quantity', e.target.value)} required className={inputClass} placeholder="8.5" />
              </div>
            </div>
            <div>
              <label className="mb-1.5 block text-sm text-text-muted">Total Amount</label>
              <div className="rounded-xl border border-border bg-primary/10 px-4 py-3 text-lg font-semibold text-accent">
                ₹{totalAmount}
              </div>
            </div>
          </div>
        </Card>

        <Card>
          <h2 className="mb-4 text-sm font-semibold text-text-muted uppercase">Refueling Details</h2>
          <div className="space-y-4">
            <div>
              <label className="mb-1.5 block text-sm text-text-muted">Date & Time</label>
              <input type="datetime-local" value={form.date} onChange={(e) => set('date', e.target.value)} className={inputClass} />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-sm text-text-muted">Fuel Station</label>
                <input value={form.fuelStation} onChange={(e) => set('fuelStation', e.target.value)} className={inputClass} placeholder="IOCL" />
              </div>
              <div>
                <label className="mb-1.5 block text-sm text-text-muted">Location</label>
                <input value={form.location} onChange={(e) => set('location', e.target.value)} className={inputClass} placeholder="Kollam" />
              </div>
            </div>
          </div>
        </Card>

        <Card>
          <h2 className="mb-4 text-sm font-semibold text-text-muted uppercase">Payment</h2>
          <div className="flex flex-wrap gap-3">
            {['Cash', 'Card', 'UPI'].map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => set('paymentMethod', m)}
                className={`rounded-xl border px-4 py-2 text-sm transition-all ${
                  form.paymentMethod === m
                    ? 'border-accent bg-primary/20 text-accent'
                    : 'border-border text-text-muted hover:border-accent/50'
                }`}
              >
                {m}
              </button>
            ))}
          </div>
          {form.paymentMethod === 'Card' && (
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <input value={form.cardName} onChange={(e) => set('cardName', e.target.value)} className={inputClass} placeholder="Card Name" />
              <input value={form.cardLast4} onChange={(e) => set('cardLast4', e.target.value)} maxLength={4} className={inputClass} placeholder="Last 4 digits" />
            </div>
          )}
        </Card>

        <Card>
          <h2 className="mb-4 text-sm font-semibold text-text-muted uppercase">Mileage</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-sm text-text-muted">Odometer (km)</label>
              <input
                type="number"
                value={form.odometer}
                onChange={(e) => set('odometer', e.target.value)}
                required
                min={lastFillOdometer != null ? lastFillOdometer + 1 : 0}
                placeholder={
                  lastFillOdometer != null
                    ? `Must be higher than ${lastFillOdometer.toLocaleString()} km`
                    : 'Current odometer reading'
                }
                className={inputClass}
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm text-text-muted">Meter Mileage (optional)</label>
              <input type="number" step="0.1" value={form.meterMileage} onChange={(e) => set('meterMileage', e.target.value)} className={inputClass} />
            </div>
          </div>
          <p className="mt-3 text-xs text-text-subtle">
            {lastFillOdometer != null
              ? `Last fill-up was at ${lastFillOdometer.toLocaleString()} km. M2T calculates mileage as (current odometer − last fill) ÷ litres filled.`
              : 'First fill-up has no mileage yet. From the second fill onward, M2T uses (current odometer − last fill odometer) ÷ litres filled.'}
          </p>
        </Card>

        <Card>
          <h2 className="mb-4 text-sm font-semibold text-text-muted uppercase">Riding Pattern</h2>
          <div className="flex flex-wrap gap-3">
            {['Casual', 'Mixed', 'Aggressive'].map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => set('drivingStyle', s)}
                className={`rounded-xl border px-4 py-2 text-sm transition-all ${
                  form.drivingStyle === s
                    ? 'border-accent bg-primary/20 text-accent'
                    : 'border-border text-text-muted hover:border-accent/50'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </Card>

        <div className="flex gap-3">
          <Button type="submit" disabled={loading || !form.bike}>
            {loading ? 'Saving...' : isEdit ? 'Save Changes' : 'Save Fuel Log'}
          </Button>
          <Button type="button" variant="secondary" onClick={() => navigate('/fuel')}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  )
}
