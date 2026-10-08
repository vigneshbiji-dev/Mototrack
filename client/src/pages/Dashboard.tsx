import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Bike, Fuel, Gauge, IndianRupee, Plus, Wrench, Receipt } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { getDashboard, type DashboardData } from '../services/analyticsService'
import StatCard from '../components/ui/StatCard'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import BikeCard from '../components/BikeCard'
import FuelChart from '../components/FuelChart'
import EmptyState from '../components/ui/EmptyState'

function getGreeting() {
  const h = new Date().getHours()
  if (h < 12) return 'Good morning'
  if (h < 17) return 'Good afternoon'
  return 'Good evening'
}

const activityIcon = (type: string) => {
  if (type === 'service') return Wrench
  if (type === 'expense') return Receipt
  return Fuel
}

export default function Dashboard() {
  const { user } = useAuth()
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getDashboard().then(setData).catch(console.error).finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="text-text-muted">Loading dashboard...</div>
  if (!data) return <div className="text-red-400">Failed to load dashboard</div>

  const fmt = (n: number | null, suffix = '') =>
    n != null ? `${n.toFixed(suffix === 'km/L' ? 1 : 0)}${suffix ? ` ${suffix}` : ''}` : '—'

  return (
    <div className="mx-auto max-w-7xl space-y-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-medium tracking-widest text-accent uppercase">
            {getGreeting()}, {user?.name?.split(' ')[0]}
          </p>
          <h1 className="mt-2 text-2xl font-bold text-text sm:text-3xl">Your motorcycle ownership at a glance</h1>
          <p className="mt-2 text-text-muted">Fuel, service, expenses — all from your real data</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button to="/garage/add"><Plus size={16} /> Add Motorcycle</Button>
          <Button to="/fuel/add" variant="secondary"><Plus size={16} /> Add Fuel</Button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total Bikes" value={String(data.totalBikes).padStart(2, '0')} icon={Bike} />
        <StatCard label="Fuel Cost" value={`₹${data.totalFuelCost.toLocaleString('en-IN')}`} icon={Fuel} />
        <StatCard label="Service Cost" value={`₹${data.totalServiceCost.toLocaleString('en-IN')}`} icon={Wrench} />
        <StatCard label="Other Expenses" value={`₹${data.totalExpenses.toLocaleString('en-IN')}`} icon={Receipt} />
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Total Ownership" value={`₹${data.totalOwnershipCost.toLocaleString('en-IN')}`} icon={IndianRupee} />
        <StatCard label="Average Mileage" value={fmt(data.averageMileage, 'km/L')} icon={Gauge} />
        <StatCard label="Cost / KM" value={data.costPerKm != null ? `₹${data.costPerKm.toFixed(2)}` : '—'} icon={Fuel} />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <h2 className="text-sm font-semibold tracking-wide text-text-muted uppercase">Fuel Expenditure</h2>
          {data.monthlyFuel.some((m) => m.amount > 0) ? (
            <div className="mt-6"><FuelChart data={data.monthlyFuel} /></div>
          ) : (
            <p className="mt-8 py-12 text-center text-sm text-text-muted">Add fuel logs to see your spending chart</p>
          )}
        </Card>

        <Card>
          <h2 className="text-sm font-semibold tracking-wide text-text-muted uppercase">Recent Activity</h2>
          <div className="mt-4 space-y-3">
            {data.recentActivity.length === 0 ? (
              <p className="py-8 text-center text-sm text-text-muted">No activity yet</p>
            ) : (
              data.recentActivity.map((item, i) => {
                const Icon = activityIcon(item.type)
                return (
                  <div key={i} className="flex items-start gap-3 rounded-xl border border-border bg-bg p-3">
                    <div className="rounded-lg bg-primary/20 p-2">
                      <Icon size={14} className="text-accent" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-text">{item.title}</p>
                      <p className="text-xs text-text-muted">{item.bike}</p>
                      <p className="text-xs text-text-subtle">{item.detail} · ₹{item.amount?.toFixed(0)}</p>
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </Card>
      </div>

      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-text">My Garage</h2>
          <Link to="/garage" className="text-sm text-accent hover:underline">View all →</Link>
        </div>
        {data.bikes.length === 0 ? (
          <Card>
            <EmptyState icon={Bike} title="No motorcycles yet" description="Add your first bike to start tracking." actionLabel="Add Motorcycle" actionTo="/garage/add" />
          </Card>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {data.bikes.slice(0, 3).map((bike) => (
              <BikeCard key={bike._id} {...bike} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
