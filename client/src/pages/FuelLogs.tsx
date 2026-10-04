import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Trash2, Fuel, Pencil } from 'lucide-react'
import { getFuelLogs, deleteFuelLog, type FuelLog } from '../services/fuelService'
import { getBikes } from '../services/bikeService'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'
import EmptyState from '../components/ui/EmptyState'
import LoadingSpinner from '../components/ui/LoadingSpinner'
import ListFilters from '../components/ui/ListFilters'

export default function FuelLogsPage() {
  const [logs, setLogs] = useState<FuelLog[]>([])
  const [bikes, setBikes] = useState<{ _id: string; brand: string; model: string }[]>([])
  const [loading, setLoading] = useState(true)
  const [filterBike, setFilterBike] = useState('')
  const [search, setSearch] = useState('')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')

  const load = () => {
    getFuelLogs({
      bike: filterBike || undefined,
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
  }, [])

  useEffect(() => {
    setLoading(true)
    const timer = setTimeout(load, search ? 300 : 0)
    return () => clearTimeout(timer)
  }, [filterBike, search, dateFrom, dateTo])

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this fuel log?')) return
    await deleteFuelLog(id)
    load()
  }

  const fmtDate = (d: string) =>
    new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })

  return (
    <div className="mx-auto max-w-7xl space-y-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text sm:text-3xl">Fuel Logs</h1>
          <p className="mt-2 text-text-muted">Track your fuel consumption and mileage</p>
        </div>
        <Button to="/fuel/add">
          <Plus size={16} /> Add Fuel
        </Button>
      </div>

      <ListFilters
        search={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search station, location..."
        bikeFilter={filterBike}
        onBikeFilterChange={setFilterBike}
        bikes={bikes}
        dateFrom={dateFrom}
        dateTo={dateTo}
        onDateFromChange={setDateFrom}
        onDateToChange={setDateTo}
      />

      {loading ? (
        <LoadingSpinner label="Loading fuel logs..." />
      ) : logs.length === 0 ? (
        <Card>
          <EmptyState
            icon={Fuel}
            title="No fuel logs yet"
            description="Add your first fill-up to start tracking mileage and costs."
            actionLabel="Add Fuel"
            actionTo="/fuel/add"
          />
        </Card>
      ) : (
        <Card className="overflow-hidden p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-border bg-bg/50 text-xs tracking-wide text-text-muted uppercase">
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4">Bike</th>
                  <th className="px-6 py-4">Station</th>
                  <th className="px-6 py-4">Qty</th>
                  <th className="px-6 py-4">Price/L</th>
                  <th className="px-6 py-4">Total</th>
                  <th className="px-6 py-4">Mileage</th>
                  <th className="px-6 py-4"></th>
                </tr>
              </thead>
              <tbody>
                {logs.map((log) => {
                  const bike =
                    typeof log.bike === 'object'
                      ? `${log.bike.brand} ${log.bike.model}`
                      : '—'
                  return (
                    <tr key={log._id} className="border-b border-border/50 hover:bg-bg/30">
                      <td className="px-6 py-4 text-text-muted">{fmtDate(log.date || log.createdAt)}</td>
                      <td className="px-6 py-4 font-medium text-text">{bike}</td>
                      <td className="px-6 py-4 text-text-muted">{log.fuelStation || '—'}</td>
                      <td className="px-6 py-4">{log.quantity} L</td>
                      <td className="px-6 py-4">₹{log.fuelPrice}</td>
                      <td className="px-6 py-4 font-medium text-accent">₹{log.totalAmount?.toFixed(0)}</td>
                      <td className="px-6 py-4">
                        {log.calculatedMileage != null
                          ? `${log.calculatedMileage.toFixed(1)} km/L`
                          : log.meterMileage != null
                            ? `${log.meterMileage.toFixed(1)} km/L`
                            : '—'}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Link to={`/fuel/edit/${log._id}`} className="text-text-muted hover:text-accent" aria-label="Edit">
                            <Pencil size={16} />
                          </Link>
                          <button type="button" onClick={() => handleDelete(log._id)} className="text-text-muted hover:text-red-400" aria-label="Delete">
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  )
}
