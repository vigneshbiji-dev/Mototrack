import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Trash2, Bell, Check, Pencil } from 'lucide-react'
import { getBikes } from '../services/bikeService'
import {
  createReminder,
  deleteReminder,
  getReminders,
  updateReminder,
  type Reminder,
} from '../services/reminderService'
import {
  getSmartReminders,
  getMaintenanceCatalog,
  type SmartServiceReminder,
  type MaintenanceCatalogEntry,
} from '../services/maintenanceService'
import { getApiErrorMessage } from '../utils/getApiErrorMessage'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'
import EmptyState from '../components/ui/EmptyState'
import LoadingSpinner from '../components/ui/LoadingSpinner'
import ListFilters from '../components/ui/ListFilters'
import SmartServiceCard from '../components/SmartServiceCard'

const TYPES = ['Insurance', 'PUC', 'Custom', 'Service'] as const
const inputClass =
  'w-full rounded-xl border border-border bg-bg px-4 py-3 text-sm text-text outline-none focus:border-accent'

function ReminderSection({
  title,
  emoji,
  items,
  empty,
}: {
  title: string
  emoji: string
  items: SmartServiceReminder[]
  empty?: string
}) {
  if (items.length === 0) {
    return empty ? (
      <div>
        <h2 className="mb-3 text-sm font-semibold tracking-wide text-text-muted uppercase">
          {emoji} {title}
        </h2>
        <p className="text-sm text-text-subtle">{empty}</p>
      </div>
    ) : null
  }
  return (
    <div className="space-y-3">
      <h2 className="text-sm font-semibold tracking-wide text-text-muted uppercase">
        {emoji} {title}
      </h2>
      {items.map((item) => (
        <SmartServiceCard key={item.bikeId} item={item} />
      ))}
    </div>
  )
}

export default function RemindersPage() {
  const [smart, setSmart] = useState<{ grouped: Record<string, SmartServiceReminder[]> } | null>(null)
  const [catalog, setCatalog] = useState<MaintenanceCatalogEntry[]>([])
  const [reminders, setReminders] = useState<Reminder[]>([])
  const [bikes, setBikes] = useState<{ _id: string; brand: string; model: string }[]>([])
  const [smartLoading, setSmartLoading] = useState(true)
  const [customLoading, setCustomLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)
  const [error, setError] = useState('')
  const [filterBike, setFilterBike] = useState('')
  const [filterType, setFilterType] = useState('')
  const [search, setSearch] = useState('')
  const [form, setForm] = useState({
    bike: '',
    type: 'Insurance' as (typeof TYPES)[number],
    title: '',
    dueDate: '',
    dueOdometer: '',
    notes: '',
  })

  const loadCustom = useCallback(async () => {
    setCustomLoading(true)
    try {
      const data = await getReminders({
        bike: filterBike || undefined,
        type: filterType || undefined,
        completed: false,
      })
      setReminders(data)
    } catch (e) {
      console.error(e)
      setError(getApiErrorMessage(e, 'Failed to load custom reminders'))
    } finally {
      setCustomLoading(false)
    }
  }, [filterBike, filterType])

  const loadSmart = useCallback(async () => {
    setSmartLoading(true)
    try {
      const [smartData, catalogData] = await Promise.all([
        getSmartReminders(),
        getMaintenanceCatalog(),
      ])
      setSmart(smartData)
      setCatalog(catalogData)
    } catch (e) {
      console.error(e)
    } finally {
      setSmartLoading(false)
    }
  }, [])

  useEffect(() => {
    getBikes().then((list) => {
      setBikes(list)
      if (list[0]) setForm((f) => ({ ...f, bike: list[0]._id }))
    })
    loadSmart()
    loadCustom()
  }, [loadSmart, loadCustom])

  useEffect(() => {
    loadCustom()
  }, [loadCustom])

  const openForm = () => {
    setError('')
    setEditId(null)
    setShowForm(true)
  }

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
      type: 'Insurance',
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
    if (!form.bike) {
      setError('Add a motorcycle in My Garage before creating reminders.')
      return
    }
    const payload = {
      bike: form.bike,
      type: form.type,
      title: form.title.trim(),
      dueDate: form.dueDate,
      dueOdometer: form.dueOdometer ? Number(form.dueOdometer) : undefined,
      notes: form.notes.trim(),
    }
    try {
      if (editId) await updateReminder(editId, payload)
      else await createReminder(payload)
      resetForm()
      await loadCustom()
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
    setError('')
  }

  const handleComplete = async (id: string) => {
    await updateReminder(id, { completed: true })
    await loadCustom()
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this reminder?')) return
    await deleteReminder(id)
    await loadCustom()
  }

  const grouped = smart?.grouped

  return (
    <div className="mx-auto max-w-7xl space-y-10">
      <div>
        <h1 className="text-2xl font-bold text-text sm:text-3xl">Reminders</h1>
        <p className="mt-2 max-w-2xl text-text-muted">
          Smart service targets from manufacturer schedules, plus your own insurance, PUC, and custom alerts.
        </p>
      </div>

      {/* Custom reminders — prominent, works even if smart API fails */}
      <Card className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-text">Custom reminders</h2>
            <p className="text-sm text-text-muted">Insurance renewal, PUC, tyre change, or anything you want to track.</p>
          </div>
          <Button type="button" onClick={openForm} disabled={bikes.length === 0}>
            <Plus size={16} /> Add reminder
          </Button>
        </div>

        {bikes.length === 0 && (
          <div className="rounded-xl border border-border bg-bg px-4 py-3 text-sm text-text-muted">
            You need at least one bike in{' '}
            <Link to="/garage/add" className="text-accent hover:underline">
              My Garage
            </Link>{' '}
            before adding custom reminders.
          </div>
        )}

        {showForm && bikes.length > 0 && (
          <form onSubmit={handleSubmit} className="space-y-4 rounded-xl border border-border bg-bg p-4">
            <h3 className="text-sm font-semibold uppercase text-text-muted">
              {editId ? 'Edit reminder' : 'New reminder'}
            </h3>
            {error && <div className="rounded-xl bg-red-500/10 px-4 py-3 text-sm text-red-400">{error}</div>}
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-sm text-text-muted">Bike</label>
                <select
                  value={form.bike}
                  onChange={(e) => setForm({ ...form, bike: e.target.value })}
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
              <div>
                <label className="mb-1.5 block text-sm text-text-muted">Type</label>
                <select
                  value={form.type}
                  onChange={(e) => setForm({ ...form, type: e.target.value as typeof form.type })}
                  className={inputClass}
                >
                  {TYPES.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <label className="mb-1.5 block text-sm text-text-muted">Title</label>
              <input
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                required
                className={inputClass}
                placeholder="e.g. Insurance renewal, PUC expiry"
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-sm text-text-muted">Due date</label>
                <input
                  type="date"
                  value={form.dueDate}
                  onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
                  required
                  className={inputClass}
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm text-text-muted">Due odometer (optional)</label>
                <input
                  type="number"
                  min={0}
                  value={form.dueOdometer}
                  onChange={(e) => setForm({ ...form, dueOdometer: e.target.value })}
                  className={inputClass}
                  placeholder="km"
                />
              </div>
            </div>
            <div>
              <label className="mb-1.5 block text-sm text-text-muted">Notes (optional)</label>
              <input
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
                className={inputClass}
                placeholder="Policy number, service centre, etc."
              />
            </div>
            <div className="flex gap-3">
              <Button type="submit">{editId ? 'Save changes' : 'Save reminder'}</Button>
              <Button type="button" variant="secondary" onClick={resetForm}>
                Cancel
              </Button>
            </div>
          </form>
        )}

        <ListFilters
          search={search}
          onSearchChange={setSearch}
          searchPlaceholder="Search by title or bike..."
          bikeFilter={filterBike}
          onBikeFilterChange={setFilterBike}
          bikes={bikes}
          secondaryFilter={filterType}
          onSecondaryFilterChange={setFilterType}
          secondaryOptions={TYPES.map((t) => ({ value: t, label: t }))}
          secondaryLabel="All types"
        />

        {customLoading ? (
          <LoadingSpinner label="Loading custom reminders..." />
        ) : filtered.length === 0 ? (
          <EmptyState
            icon={Bell}
            title="No custom reminders yet"
            description="Create insurance, PUC, or custom alerts for your bikes. They appear here with edit and complete actions."
            actionLabel={bikes.length > 0 ? 'Add your first reminder' : undefined}
            onAction={bikes.length > 0 ? openForm : undefined}
          />
        ) : (
          <div className="space-y-3">
            {filtered.map((r) => {
              const bike = typeof r.bike === 'object' ? `${r.bike.brand} ${r.bike.model}` : '—'
              const overdue = new Date(r.dueDate) < new Date()
              return (
                <div
                  key={r._id}
                  className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-border bg-panel p-4"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium uppercase text-accent">{r.type}</span>
                      {overdue && (
                        <span className="rounded bg-red-500/20 px-2 py-0.5 text-xs text-red-400">Overdue</span>
                      )}
                    </div>
                    <p className="font-medium text-text">{r.title}</p>
                    <p className="text-sm text-text-muted">
                      {bike} · Due {fmtDate(r.dueDate)}
                    </p>
                    {r.dueOdometer != null && (
                      <p className="text-xs text-text-subtle">At {r.dueOdometer.toLocaleString()} km</p>
                    )}
                    {r.notes && <p className="text-xs text-text-subtle">{r.notes}</p>}
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleComplete(r._id)}
                      className="rounded-lg bg-primary/20 p-2 text-accent hover:bg-primary/30"
                      title="Mark complete"
                    >
                      <Check size={16} />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleEdit(r)}
                      className="rounded-lg p-2 text-text-muted hover:text-accent"
                      title="Edit"
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(r._id)}
                      className="rounded-lg p-2 text-text-muted hover:text-red-400"
                      title="Delete"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </Card>

      {/* Smart service reminders */}
      <div>
        <h2 className="mb-4 text-lg font-semibold text-text">Smart service reminders</h2>
        {smartLoading ? (
          <LoadingSpinner label="Calculating service schedules..." />
        ) : (
          <div className="space-y-8">
            <ReminderSection title="Overdue" emoji="🔴" items={grouped?.overdue || []} />
            <ReminderSection title="Due soon" emoji="🟡" items={grouped?.due_soon || []} />
            <ReminderSection title="Upcoming" emoji="🟢" items={grouped?.upcoming || []} />
            <ReminderSection
              title="Up to date"
              emoji="✓"
              items={grouped?.up_to_date || []}
              empty="Recent service on file — status shows here when you're within the manufacturer interval."
            />
            {(grouped?.no_schedule?.length || 0) > 0 && (
              <ReminderSection title="No verified schedule" emoji="ℹ️" items={grouped?.no_schedule || []} />
            )}
          </div>
        )}
      </div>

      <Card>
        <h2 className="mb-4 text-sm font-semibold uppercase text-text-muted">Maintenance catalog (10 models)</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-border text-xs text-text-muted uppercase">
                <th className="py-2 pr-4">#</th>
                <th className="py-2 pr-4">Manufacturer</th>
                <th className="py-2 pr-4">Model</th>
                <th className="py-2 pr-4">Interval</th>
                <th className="py-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {catalog.map((row, i) => (
                <tr key={row._id} className="border-b border-border/50">
                  <td className="py-2 pr-4 text-text-muted">{i + 1}</td>
                  <td className="py-2 pr-4">{row.manufacturer}</td>
                  <td className="py-2 pr-4">{row.model}</td>
                  <td className="py-2 pr-4 text-text-muted">
                    {row.verified
                      ? row.recurringService
                        ? `${row.recurringService.km?.toLocaleString('en-IN')} km / ${row.recurringService.months} mo`
                        : `${row.serviceIntervalKm?.toLocaleString('en-IN')} km / ${row.serviceIntervalMonths} mo`
                      : 'Pending verification'}
                  </td>
                  <td className="py-2">
                    <span className={row.verified ? 'text-emerald-400' : 'text-text-subtle'}>
                      {row.verified ? 'Verified' : 'Catalog only'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
