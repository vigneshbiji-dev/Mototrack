import { useEffect, useState } from 'react'
import { getDashboard, type DashboardData } from '../services/analyticsService'
import Card from '../components/ui/Card'
import StatCard from '../components/ui/StatCard'
import FuelChart from '../components/FuelChart'
import LoadingSpinner from '../components/ui/LoadingSpinner'
import { Fuel, Wrench, Receipt, IndianRupee, Gauge, Route } from 'lucide-react'

export default function Analytics() {
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getDashboard().then(setData).catch(console.error).finally(() => setLoading(false))
  }, [])

  if (loading) return <LoadingSpinner label="Loading analytics..." />
  if (!data) return <p className="text-red-400">Failed to load analytics</p>

  const fmt = (n: number | null | undefined, suffix = '') =>
    n != null ? `${n.toFixed(suffix === 'km/L' ? 1 : suffix === '/km' ? 2 : 0)}${suffix ? ` ${suffix}` : ''}` : '—'

  return (
    <div className="mx-auto max-w-7xl space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-text sm:text-3xl">Analytics</h1>
        <p className="mt-2 text-text-muted">Ownership insights from your real records</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Fuel Cost" value={`₹${data.totalFuelCost.toLocaleString('en-IN')}`} icon={Fuel} />
        <StatCard label="Service Cost" value={`₹${data.totalServiceCost.toLocaleString('en-IN')}`} icon={Wrench} />
        <StatCard label="Expenses" value={`₹${data.totalExpenses.toLocaleString('en-IN')}`} icon={Receipt} />
        <StatCard label="Total Ownership" value={`₹${data.totalOwnershipCost.toLocaleString('en-IN')}`} icon={IndianRupee} />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Average Mileage" value={fmt(data.averageMileage, 'km/L')} icon={Gauge} />
        <StatCard label="Cost / KM" value={data.costPerKm != null ? `₹${data.costPerKm.toFixed(2)}` : '—'} icon={Fuel} />
        <StatCard label="Total Distance" value={data.totalDistance != null ? `${data.totalDistance.toLocaleString('en-IN')} km` : '—'} icon={Route} />
        <StatCard label="Fuel Consumed" value={data.totalFuelQuantity != null ? `${data.totalFuelQuantity.toFixed(1)} L` : '—'} icon={Fuel} />
      </div>

      <Card>
        <h2 className="mb-4 text-sm font-semibold tracking-wide text-text-muted uppercase">Monthly Fuel Expenditure</h2>
        {data.monthlyFuel.some((m) => m.amount > 0) ? (
          <FuelChart data={data.monthlyFuel} />
        ) : (
          <p className="py-8 text-center text-sm text-text-muted">Add fuel logs to see trends</p>
        )}
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <h2 className="mb-4 text-sm font-semibold tracking-wide text-text-muted uppercase">Service by Type</h2>
          {Object.keys(data.serviceByType).length === 0 ? (
            <p className="text-sm text-text-muted">No service data yet</p>
          ) : (
            <div className="space-y-3">
              {Object.entries(data.serviceByType).map(([type, amount]) => (
                <div key={type} className="flex items-center justify-between">
                  <span className="text-sm text-text-muted">{type}</span>
                  <span className="font-medium text-text">₹{amount.toLocaleString('en-IN')}</span>
                </div>
              ))}
            </div>
          )}
          <p className="mt-4 border-t border-border pt-3 text-xs text-text-subtle">
            {data.serviceCount ?? 0} service records logged
          </p>
        </Card>

        <Card>
          <h2 className="mb-4 text-sm font-semibold tracking-wide text-text-muted uppercase">Expenses by Category</h2>
          {Object.keys(data.expenseByCategory).length === 0 ? (
            <p className="text-sm text-text-muted">No expense data yet</p>
          ) : (
            <div className="space-y-3">
              {Object.entries(data.expenseByCategory).map(([cat, amount]) => (
                <div key={cat} className="flex items-center justify-between">
                  <span className="text-sm text-text-muted">{cat}</span>
                  <span className="font-medium text-text">₹{amount.toLocaleString('en-IN')}</span>
                </div>
              ))}
            </div>
          )}
          <p className="mt-4 border-t border-border pt-3 text-xs text-text-subtle">
            {data.expenseCount ?? 0} expense records logged
          </p>
        </Card>
      </div>

      <Card>
        <h2 className="mb-6 text-sm font-semibold tracking-wide text-text-muted uppercase">Motorcycle Comparison</h2>
        {data.bikeComparison.length === 0 ? (
          <p className="text-sm text-text-muted">Add multiple bikes to compare spending and performance</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-border text-xs text-text-muted uppercase">
                  <th className="py-3 pr-4">Bike</th>
                  <th className="py-3 pr-4">Fuel</th>
                  <th className="py-3 pr-4">Service</th>
                  <th className="py-3 pr-4">Expenses</th>
                  <th className="py-3 pr-4">Total</th>
                  <th className="py-3 pr-4">Mileage</th>
                  <th className="py-3">Cost/KM</th>
                </tr>
              </thead>
              <tbody>
                {data.bikeComparison.map((bike) => (
                  <tr key={bike._id} className="border-b border-border/50">
                    <td className="py-3 pr-4 font-medium text-text">{bike.brand} {bike.model}</td>
                    <td className="py-3 pr-4">₹{bike.fuel.toLocaleString('en-IN')}</td>
                    <td className="py-3 pr-4">₹{bike.service.toLocaleString('en-IN')}</td>
                    <td className="py-3 pr-4">₹{bike.expenses.toLocaleString('en-IN')}</td>
                    <td className="py-3 pr-4 font-semibold text-accent">₹{bike.total.toLocaleString('en-IN')}</td>
                    <td className="py-3 pr-4">{bike.averageMileage != null ? `${bike.averageMileage.toFixed(1)} km/L` : '—'}</td>
                    <td className="py-3">{bike.costPerKm != null ? `₹${bike.costPerKm.toFixed(2)}` : '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      <Card>
        <h2 className="mb-4 text-sm font-semibold tracking-wide text-text-muted uppercase">Monthly Ownership Cost</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-xs text-text-muted uppercase">
                <th className="py-2">Month</th>
                <th className="py-2">Fuel</th>
                <th className="py-2">Service</th>
                <th className="py-2">Expenses</th>
                <th className="py-2">Total</th>
              </tr>
            </thead>
            <tbody>
              {data.monthlyOwnership.map((m) => (
                <tr key={m.month} className="border-b border-border/50">
                  <td className="py-2 text-text-muted">{m.month}</td>
                  <td className="py-2">₹{m.fuel.toFixed(0)}</td>
                  <td className="py-2">₹{m.service.toFixed(0)}</td>
                  <td className="py-2">₹{m.expenses.toFixed(0)}</td>
                  <td className="py-2 font-semibold text-accent">₹{m.total.toFixed(0)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
