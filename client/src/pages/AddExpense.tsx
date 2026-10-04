import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getBikes } from '../services/bikeService'
import { createExpense, getExpenseById, updateExpense } from '../services/expenseService'
import { getApiErrorMessage } from '../utils/getApiErrorMessage'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'

const CATEGORIES = ['Accessories', 'Parts', 'Tyres', 'Insurance', 'Cleaning', 'Modification', 'Repair', 'Other']

const inputClass =
  'w-full rounded-xl border border-border bg-bg px-4 py-3 text-sm text-text outline-none transition-all focus:border-accent focus:ring-2 focus:ring-accent/20'

export default function AddExpense() {
  const { id } = useParams()
  const isEdit = Boolean(id)
  const navigate = useNavigate()
  const [bikes, setBikes] = useState<{ _id: string; brand: string; model: string }[]>([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(isEdit)

  const [form, setForm] = useState({
    bike: '',
    category: 'Accessories',
    storeName: '',
    description: '',
    amount: '',
    date: new Date().toISOString().slice(0, 10),
    paymentMethod: 'Cash',
    notes: '',
  })

  useEffect(() => {
    const load = async () => {
      const bikeList = await getBikes()
      setBikes(bikeList)

      if (id) {
        try {
          const exp = await getExpenseById(id)
          const bikeId = typeof exp.bike === 'object' ? exp.bike._id : exp.bike
          setForm({
            bike: bikeId,
            category: exp.category,
            storeName: exp.storeName || '',
            description: exp.description || '',
            amount: String(exp.amount),
            date: new Date(exp.date).toISOString().slice(0, 10),
            paymentMethod: exp.paymentMethod || 'Cash',
            notes: exp.notes || '',
          })
        } catch {
          setError('Failed to load expense')
        } finally {
          setFetching(false)
        }
      } else if (bikeList[0]) {
        setForm((f) => ({ ...f, bike: bikeList[0]._id }))
        setFetching(false)
      } else {
        setFetching(false)
      }
    }
    load()
  }, [id])

  const set = (key: string, value: string) => setForm((f) => ({ ...f, [key]: value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    const payload = {
      bike: form.bike,
      category: form.category,
      storeName: form.storeName,
      description: form.description,
      amount: Number(form.amount),
      date: form.date,
      paymentMethod: form.paymentMethod,
      notes: form.notes,
    }
    try {
      if (isEdit && id) await updateExpense(id, payload)
      else await createExpense(payload)
      navigate('/expenses')
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
        <h1 className="text-2xl font-bold text-text">{isEdit ? 'Edit Expense' : 'Add Expense'}</h1>
        <p className="mt-1 text-text-muted">Record ownership spending beyond service</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && <div className="rounded-xl bg-red-500/10 px-4 py-3 text-sm text-red-400">{error}</div>}

        <Card className="space-y-4">
          <div>
            <label className="mb-1.5 block text-sm text-text-muted">Bike</label>
            <select value={form.bike} onChange={(e) => set('bike', e.target.value)} required className={inputClass}>
              {bikes.map((b) => <option key={b._id} value={b._id}>{b.brand} {b.model}</option>)}
            </select>
          </div>
          <div>
            <label className="mb-1.5 block text-sm text-text-muted">Category</label>
            <select value={form.category} onChange={(e) => set('category', e.target.value)} className={inputClass}>
              {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-sm text-text-muted">Store / Shop</label>
              <input value={form.storeName} onChange={(e) => set('storeName', e.target.value)} className={inputClass} placeholder="MotoGear" />
            </div>
            <div>
              <label className="mb-1.5 block text-sm text-text-muted">Date</label>
              <input type="date" value={form.date} onChange={(e) => set('date', e.target.value)} className={inputClass} />
            </div>
          </div>
          <div>
            <label className="mb-1.5 block text-sm text-text-muted">Item / Description</label>
            <input value={form.description} onChange={(e) => set('description', e.target.value)} className={inputClass} placeholder="Crash Guard, Helmet..." />
          </div>
          <div>
            <label className="mb-1.5 block text-sm text-text-muted">Amount (₹)</label>
            <input type="number" value={form.amount} onChange={(e) => set('amount', e.target.value)} required className={inputClass} />
          </div>
          <div>
            <label className="mb-1.5 block text-sm text-text-muted">Payment Method</label>
            <select value={form.paymentMethod} onChange={(e) => set('paymentMethod', e.target.value)} className={inputClass}>
              {['Cash', 'Card', 'UPI', 'Other'].map((m) => <option key={m} value={m}>{m}</option>)}
            </select>
          </div>
          <div>
            <label className="mb-1.5 block text-sm text-text-muted">Notes</label>
            <textarea value={form.notes} onChange={(e) => set('notes', e.target.value)} rows={2} className={inputClass} />
          </div>
        </Card>

        <div className="flex gap-3">
          <Button type="submit" disabled={loading || !form.bike}>{loading ? 'Saving...' : isEdit ? 'Save Changes' : 'Save Expense'}</Button>
          <Button type="button" variant="secondary" onClick={() => navigate('/expenses')}>Cancel</Button>
        </div>
      </form>
    </div>
  )
}
