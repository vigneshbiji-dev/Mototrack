import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, Bike, Fuel, Wrench, Receipt, Pencil } from 'lucide-react'
import { getBikeSummary, type BikeSummary } from '../services/bikeService'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'
import LoadingSpinner from '../components/ui/LoadingSpinner'
import StatCard from '../components/ui/StatCard'

export default function BikeDetail() {
  const { id } = useParams()
  const [data, setData] = useState<BikeSummary | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!id) return
    getBikeSummary(id)
      .then(setData)
      .catch(() => setError('Could not load bike details'))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) return <LoadingSpinner label="Loading bike details..." />
  if (error || !data) {
    return (
      <div className="mx-auto max-w-xl space-y-4">
        <p className="text-red-400">{error || 'Bike not found'}</p>
        <Button to="/garage" variant="secondary">
          Back to garage
        </Button>
      </div>
    )
  }

  const { bike, stats, lastService, schedule, serviceReminder: reminder } = data
  const fmtDate = (d: string) =>
    new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })

  return (
    <div className="mx-auto max-w-7xl space-y-8">
      <div className="flex flex-wrap items-center gap-4">
        <Link to="/garage" className="inline-flex items-center gap-2 text-sm text-text-muted hover:text-accent">
          <ArrowLeft size={16} /> Back to garage
        </Link>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="overflow-hidden p-0 lg:col-span-1">
          <div className="flex h-52 items-center justify-center bg-gradient-to-br from-primary/20 to-bg">
            {bike.imageUrl ? (
              <img src={bike.imageUrl} alt={`${bike.brand} ${bike.model}`} className="h-full w-full object-cover" />
            ) : (
              <Bike size={56} className="text-accent/40" strokeWidth={1} />
            )}
          </div>
          <div className="p-6">
            <p className="text-xs font-medium uppercase tracking-wide text-text-muted">{bike.brand}</p>
            <h1 className="mt-1 text-2xl font-bold text-text">{bike.model}</h1>
            <dl className="mt-4 space-y-2 text-sm text-text-muted">
              <div className="flex justify-between">
                <dt>Year</dt>
                <dd className="text-text">{bike.year}</dd>
              </div>
              {bike.registrationNumber && (
                <div className="flex justify-between">
                  <dt>Registration</dt>
                  <dd className="text-text">{bike.registrationNumber}</dd>
                </div>
              )}
              {bike.engineCapacity && (
                <div className="flex justify-between">
                  <dt>Engine</dt>
                  <dd className="text-text">{bike.engineCapacity} cc</dd>
                </div>
              )}
              <div className="flex justify-between">
                <dt>Fuel type</dt>
                <dd className="text-text">{bike.fuelType || 'Petrol'}</dd>
              </div>
              <div className="flex justify-between">
                <dt>Odometer</dt>
                <dd className="font-medium text-accent">{bike.currentOdometer?.toLocaleString('en-IN')} km</dd>
              </div>
            </dl>
            <Button to={`/garage/edit/${bike._id}`} variant="secondary" className="mt-6 w-full">
              <Pencil size={16} /> Edit bike
            </Button>
          </div>
        </Card>

        <div className="space-y-6 lg:col-span-2">
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard label="Fuel spent" value={`₹${stats.totalFuel.toLocaleString('en-IN')}`} icon={Fuel} />
            <StatCard label="Service cost" value={`₹${stats.totalService.toLocaleString('en-IN')}`} icon={Wrench} />
            <StatCard label="Expenses" value={`₹${stats.totalExpenses.toLocaleString('en-IN')}`} icon={Receipt} />
            <StatCard label="Total ownership" value={`₹${stats.totalOwnership.toLocaleString('en-IN')}`} icon={Bike} />
          </div>

          <Card>
            <h2 className="text-sm font-semibold uppercase tracking-wide text-text-muted">Service reminder</h2>
            {reminder?.verified && reminder.recommendedKm != null ? (
              <div className="mt-4 space-y-2 text-sm">
                <p className="text-text">
                  Next target:{' '}
                  <span className="font-semibold">{reminder.recommendedKm.toLocaleString('en-IN')} km</span>
                </p>
                {reminder.kmRemaining != null && (
                  <p className={reminder.status === 'overdue' ? 'text-red-400' : 'text-accent'}>
                    {reminder.status === 'overdue'
                      ? `${reminder.kmOverdueBy?.toLocaleString('en-IN')} km overdue`
                      : `${reminder.kmRemaining.toLocaleString('en-IN')} km remaining`}
                  </p>
                )}
                {reminder.intervalLabel && (
                  <p className="text-text-muted">Interval: {reminder.intervalLabel} (whichever comes first)</p>
                )}
              </div>
            ) : (
              <p className="mt-4 text-sm text-text-muted">
                {schedule?.verified === false
                  ? 'This model is in the M2T catalog — official interval not verified yet.'
                  : 'No manufacturer schedule matched. Check brand/model spelling matches the catalog.'}
              </p>
            )}
            {schedule?.verified && schedule.source && (
              <p className="mt-2 text-xs text-text-subtle">Source: {schedule.source}</p>
            )}
          </Card>

          <Card>
            <h2 className="text-sm font-semibold uppercase tracking-wide text-text-muted">Last service</h2>
            {lastService ? (
              <p className="mt-3 text-sm text-text">
                {lastService.serviceType} · {fmtDate(lastService.date)}
                {lastService.odometer != null && ` · ${lastService.odometer.toLocaleString('en-IN')} km`}
                {' · '}₹{lastService.totalCost.toLocaleString('en-IN')}
              </p>
            ) : (
              <p className="mt-3 text-sm text-text-muted">No service records yet for this bike.</p>
            )}
          </Card>

          <div className="flex flex-wrap gap-3">
            <Button to="/fuel/add">Add fuel</Button>
            <Button to="/service/add" variant="secondary">
              Add service
            </Button>
            <Button to="/expenses/add" variant="secondary">
              Add expense
            </Button>
            <Button to="/reminders" variant="secondary">
              Reminders
            </Button>
          </div>

          <p className="text-xs text-text-subtle">
            {stats.fuelCount} fuel logs · {stats.serviceCount} service records · {stats.expenseCount} expenses
          </p>
        </div>
      </div>
    </div>
  )
}
