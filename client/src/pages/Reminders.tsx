import { useEffect, useState } from 'react'
import { Plus, Trash2, Bell, Check, Pencil } from 'lucide-react'
import { getBikes } from '../services/bikeService'
import {
  createReminder,
  deleteReminder,
  getReminders,
  updateReminder,
  type Reminder,
} from '../services/reminderService'
import { getApiErrorMessage } from '../utils/getApiErrorMessage'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'
import EmptyState from '../components/ui/EmptyState'
import LoadingSpinner from '../components/ui/LoadingSpinner'
import ListFilters from '../components/ui/ListFilters'

const TYPES = ['Service', 'Insurance', 'PUC', 'Custom'] as const
const inputClass =
  'w-full rounded-xl border border-border bg-bg px-4 py-3 text-sm text-text outline-none focus:border-accent'

export default function RemindersPage() {
  const [reminders, setReminders] = useState<Reminder[]>([])
  const [bikes, setBikes] = useState<{ _id: string; brand: string; model: string }[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)
  const [error, setError] = useState('')
  const [filterBike, setFilterBike] = useState('')
  const [filterType, setFilterType] = useState('')
  const [search, setSearch] = useState('')
  const [form, setForm] = useState({
    bike: '',
    type: 'Service' as (typeof TYPES)[number],
    title: '',
    dueDate: '',
    dueOdometer: '',
    notes: '',
  })

  const load = () => {
    getReminders({
      bike: filterBike || undefined,
      type: filterType || undefined,
      completed: false,
    })
      .then(setReminders)
      .catch(console.error)
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    getBikes().then((list) => {
      setBikes(list)
      if (list[0]) setForm((f) => ({ ...f, bike: list[0]._id }))
    })
  }, [])

  useEffect(() => {
    setLoading(true)
    load()
  }, [filterBike, filterType])

  const filtered = reminders.filter((r) => {
    if (!search.trim()) return true
    const q = search.toLowerCase()
    const bike = typeof r.bike === 'object' ? `${r.bike.brand} ${r.bike.model}`.toLowerCase() : ''
    return r.title.toLowerCase().includes(q) || bike.includes(q) || r.type.toLowerCase().includes(q)
  })

  const fmtDate = (d: string) =>
    new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })

  const resetForm = () => {
    setForm({
      bike: bikes[0]?._id || '',
      type: 'Service',
      title: '',
      dueDate: '',
      dueOdometer: '',
      notes: '',
    })
    setEditId(null)
    setShowForm(false)
    setError('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    const payload = {
      bike: form.bike,
      type: form.type,
      title: form.title,
      dueDate: form.dueDate,
      dueOdometer: form.dueOdometer ? Number(form.dueOdometer) : undefined,
      notes: form.notes,
    }
    try {
      if (editId) {
        await updateReminder(editId, payload)
      } else {
        await createReminder(payload)
      }
      resetForm()
      load()
    } catch (err) {
      setError(getApiErrorMessage(err))
    }
  }

  const handleEdit = (reminder: Reminder) => {
    const bikeId = typeof reminder.bike === 'object' ? reminder.bike._id : reminder.bike
    setForm({
      bike: bikeId,
      type: reminder.type,
      title: reminder.title,
      dueDate: reminder.dueDate.slice(0, 10),
      dueOdometer: reminder.dueOdometer ? String(reminder.dueOdometer) : '',
      notes: reminder.notes || '',
    })
    setEditId(reminder._id)
    setShowForm(true)
  }

  const handleComplete = async (id: string) => {
    await updateReminder(id, { completed: true })
    load()
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this reminder?')) return
    await deleteReminder(id)
    load()
  }

  const isOverdue = (date: string) => new Date(date) < new Date()

  return (
    <div className="mx-auto max-w-7xl space-y-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text sm:text-3xl">Reminders</h1>
          <p className="mt-2 text-text-muted">Service, insurance, PUC, and custom motorcycle reminders</p>
        </div>
        <Button onClick={() => { resetForm(); setShowForm(true) }}>
          <Plus size={16} /> Add Reminder
        </Button>
      </div>

      {showForm && (
        <Card>
          <h2 className="mb-4 text-sm font-semibold uppercase text-text-muted">
            {editId ? 'Edit Reminder' : 'New Reminder'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && <div className="rounded-xl bg-red-500/10 px-4 py-3 text-sm text-red-400">{error}</div>}
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-sm text-text-muted">Bike</label>
                <select value={form.bike} onChange={(e) => setForm({ ...form, bike: e.target.value })} required className={inputClass}>
                  {bikes.map((b) => (
                    <option key={b._id} value={b._id}>{b.brand} {b.model}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-1.5 block text-sm text-text-muted">Type</label>
                <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value as typeof form.type })} className={inputClass}>
                  {TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label className="mb-1.5 block text-sm text-text-muted">Title</label>
              <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required className={inputClass} placeholder="Periodic service due" />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-sm text-text-muted">Due Date</label>
                <input type="date" value={form.dueDate} onChange={(e) => setForm({ ...form, dueDate: e.target.value })} required className={inputClass} />
              </div>
              <div>
                <label className="mb-1.5 block text-sm text-text-muted">Due Odometer (optional)</label>
                <input type="number" value={form.dueOdometer} onChange={(e) => setForm({ ...form, dueOdometer: e.target.value })} className={inputClass} />
              </div>
            </div>
            <div>
              <label className="mb-1.5 block text-sm text-text-muted">Notes</label>
              <input value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} className={inputClass} />
            </div>
            <div className="flex gap-3">
              <Button type="submit">{editId ? 'Save Changes' : 'Add Reminder'}</Button>
              <Button type="button" variant="secondary" onClick={resetForm}>Cancel</Button>
            </div>
          </form>
        </Card>
      )}

      <ListFilters
        search={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search reminders..."
        bikeFilter={filterBike}
        onBikeFilterChange={setFilterBike}
        bikes={bikes}
        secondaryFilter={filterType}
        onSecondaryFilterChange={setFilterType}
        secondaryOptions={TYPES.map((t) => ({ value: t, label: t }))}
        secondaryLabel="All Types"
      />

      {loading ? (
        <LoadingSpinner label="Loading reminders..." />
      ) : filtered.length === 0 ? (
        <Card>
          <EmptyState icon={Bell} title="No reminders" description="Set service, insurance, or PUC reminders for your bikes." actionLabel="Add Reminder" actionTo="#" />
        </Card>
      ) : (
        <div className="space-y-3">
          {filtered.map((r) => {
            const bike = typeof r.bike === 'object' ? `${r.bike.brand} ${r.bike.model}` : '—'
            const overdue = isOverdue(r.dueDate)
            return (
              <Card key={r._id} className="flex flex-wrap items-center justify-between gap-4 !p-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium uppercase text-accent">{r.type}</span>
                    {overdue && <span className="rounded bg-red-500/20 px-2 py-0.5 text-xs text-red-400">Overdue</span>}
                  </div>
                  <p className="font-medium text-text">{r.title}</p>
                  <p className="text-sm text-text-muted">{bike} · Due {fmtDate(r.dueDate)}</p>
                  {r.dueOdometer && <p className="text-xs text-text-subtle">At {r.dueOdometer.toLocaleString()} km</p>}
                </div>
                <div className="flex items-center gap-2">
                  <button type="button" onClick={() => handleComplete(r._id)} className="rounded-lg bg-primary/20 p-2 text-accent hover:bg-primary/30" title="Mark complete">
                    <Check size={16} />
                  </button>
                  <button type="button" onClick={() => handleEdit(r)} className="rounded-lg p-2 text-text-muted hover:text-accent">
                    <Pencil size={16} />
                  </button>
                  <button type="button" onClick={() => handleDelete(r._id)} className="rounded-lg p-2 text-text-muted hover:text-red-400">
                    <Trash2 size={16} />
                  </button>
                </div>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
