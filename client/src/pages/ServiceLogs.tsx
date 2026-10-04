import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Trash2, Wrench, Pencil } from 'lucide-react'
import { getServiceLogs, deleteServiceLog, type ServiceLog } from '../services/serviceService'
import { getBikes } from '../services/bikeService'
import { getUpcomingReminders } from '../services/reminderService'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'
import EmptyState from '../components/ui/EmptyState'
import LoadingSpinner from '../components/ui/LoadingSpinner'
import ListFilters from '../components/ui/ListFilters'

const SERVICE_TYPES = [
  'Periodic Service', 'Oil Change', 'Chain Service', 'Brake Service',
  'Tyre Replacement', 'Battery', 'Electrical', 'Engine', 'Other Repair',
]

export default function ServiceLogs() {
  const [logs, setLogs] = useState<ServiceLog[]>([])
  const [bikes, setBikes] = useState<{ _id: string; brand: string; model: string }[]>([])
  const [nextReminder, setNextReminder] = useState<{ title: string; dueDate: string } | null>(null)
  const [loading, setLoading] = useState(true)
  const [filterBike, setFilterBike] = useState('')
  const [filterType, setFilterType] = useState('')
  const [search, setSearch] = useState('')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')

  const load = () => {
    getServiceLogs({
      bike: filterBike || undefined,
      serviceType: filterType || undefined,
      search: search || undefined,
      from: dateFrom || undefined,
      to: dateTo || undefined,
    })
      .then(setLogs)
      .catch(console.error)
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    getBikes().then(setBikes)
    getUpcomingReminders().then((r) => setNextReminder(r[0] ? { title: r[0].title, dueDate: r[0].dueDate } : null))
  }, [])

  useEffect(() => {
    setLoading(true)
    const timer = setTimeout(load, search ? 300 : 0)
    return () => clearTimeout(timer)
  }, [filterBike, filterType, search, dateFrom, dateTo])

  const totalCost = logs.reduce((s, l) => s + (l.totalCost || 0), 0)
  const lastService = logs[0]

  const fmtDate = (d: string) =>
    new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this service record?')) return
    await deleteServiceLog(id)
    load()
  }

  return (
    <div className="mx-auto max-w-7xl space-y-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text sm:text-3xl">Service & Maintenance</h1>
          <p className="mt-2 text-text-muted">Track maintenance history and service costs</p>
        </div>
        <Button to="/service/add">
          <Plus size={16} /> Add Service
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <p className="text-xs text-text-muted uppercase">Total Service Cost</p>
          <p className="mt-2 text-2xl font-bold text-text">₹{totalCost.toLocaleString('en-IN')}</p>
        </Card>
        <Card>
          <p className="text-xs text-text-muted uppercase">Last Service</p>
          <p className="mt-2 text-lg font-semibold text-text">
            {lastService ? fmtDate(lastService.date) : '—'}
          </p>
          {lastService && <p className="text-sm text-text-muted">{lastService.serviceType}</p>}
        </Card>
        <Card>
          <p className="text-xs text-text-muted uppercase">Next Reminder</p>
          {nextReminder ? (
            <>
              <p className="mt-2 text-lg font-semibold text-text">{fmtDate(nextReminder.dueDate)}</p>
              <p className="text-sm text-text-muted">{nextReminder.title}</p>
            </>
          ) : (
            <p className="mt-2 text-lg font-semibold text-text-muted">No upcoming</p>
          )}
        </Card>
      </div>

      <ListFilters
        search={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search service type, notes..."
        bikeFilter={filterBike}
        onBikeFilterChange={setFilterBike}
        bikes={bikes}
        secondaryFilter={filterType}
        onSecondaryFilterChange={setFilterType}
        secondaryOptions={SERVICE_TYPES.map((t) => ({ value: t, label: t }))}
        secondaryLabel="All Types"
        dateFrom={dateFrom}
        dateTo={dateTo}
        onDateFromChange={setDateFrom}
        onDateToChange={setDateTo}
      />

      {loading ? (
        <LoadingSpinner label="Loading service records..." />
      ) : logs.length === 0 ? (
        <Card>
          <EmptyState
            icon={Wrench}
            title="No service records yet"
            description="Log oil changes, periodic service, chain work, and more."
            actionLabel="Add Service"
            actionTo="/service/add"
          />
        </Card>
      ) : (
        <Card className="overflow-hidden p-0">
          <div className="border-b border-border px-6 py-4">
            <h2 className="text-sm font-semibold tracking-wide text-text-muted uppercase">Service History</h2>
          </div>
          <div className="divide-y divide-border">
            {logs.map((log) => {
              const bike = typeof log.bike === 'object' ? `${log.bike.brand} ${log.bike.model}` : '—'
              return (
                <div key={log._id} className="flex flex-wrap items-center justify-between gap-4 px-6 py-4 hover:bg-bg/30">
                  <div>
                    <p className="font-medium text-text">{log.serviceType}</p>
                    <p className="text-sm text-text-muted">{bike}</p>
                    <p className="text-xs text-text-subtle">
                      {fmtDate(log.date)}
                      {log.odometer ? ` · ${log.odometer.toLocaleString()} km` : ''}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="font-semibold text-accent">₹{log.totalCost.toLocaleString('en-IN')}</span>
                    <Link to={`/service/edit/${log._id}`} className="text-text-muted hover:text-accent">
                      <Pencil size={16} />
                    </Link>
                    <button type="button" onClick={() => handleDelete(log._id)} className="text-text-muted hover:text-red-400">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        </Card>
      )}
    </div>
  )
}
