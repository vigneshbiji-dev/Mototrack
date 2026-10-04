import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Trash2, Receipt, Pencil } from 'lucide-react'
import { getExpenses, deleteExpense, type Expense } from '../services/expenseService'
import { getBikes } from '../services/bikeService'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'
import EmptyState from '../components/ui/EmptyState'
import LoadingSpinner from '../components/ui/LoadingSpinner'
import ListFilters from '../components/ui/ListFilters'

const CATEGORIES = ['Accessories', 'Parts', 'Tyres', 'Insurance', 'Cleaning', 'Modification', 'Repair', 'Other']

export default function ExpensesPage() {
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [bikes, setBikes] = useState<{ _id: string; brand: string; model: string }[]>([])
  const [filterBike, setFilterBike] = useState('')
  const [filterCategory, setFilterCategory] = useState('')
  const [search, setSearch] = useState('')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const [loading, setLoading] = useState(true)

  const load = () => {
    getExpenses({
      bike: filterBike || undefined,
      category: filterCategory || undefined,
      search: search || undefined,
      from: dateFrom || undefined,
      to: dateTo || undefined,
    })
      .then(setExpenses)
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
  }, [filterBike, filterCategory, search, dateFrom, dateTo])

  const totalSpending = expenses.reduce((s, e) => s + (e.amount || 0), 0)

  const fmtDate = (d: string) =>
    new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this expense?')) return
    await deleteExpense(id)
    load()
  }

  return (
    <div className="mx-auto max-w-7xl space-y-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text sm:text-3xl">Expenses</h1>
          <p className="mt-2 text-text-muted">Track accessories, insurance, and ownership spending</p>
        </div>
        <Button to="/expenses/add">
          <Plus size={16} /> Add Expense
        </Button>
      </div>

      <Card>
        <p className="text-xs text-text-muted uppercase">Total Spending</p>
        <p className="mt-2 text-3xl font-bold text-text">₹{totalSpending.toLocaleString('en-IN')}</p>
      </Card>

      <ListFilters
        search={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search description, store..."
        bikeFilter={filterBike}
        onBikeFilterChange={setFilterBike}
        bikes={bikes}
        secondaryFilter={filterCategory}
        onSecondaryFilterChange={setFilterCategory}
        secondaryOptions={CATEGORIES.map((c) => ({ value: c, label: c }))}
        secondaryLabel="All Categories"
        dateFrom={dateFrom}
        dateTo={dateTo}
        onDateFromChange={setDateFrom}
        onDateToChange={setDateTo}
      />

      {loading ? (
        <LoadingSpinner label="Loading expenses..." />
      ) : expenses.length === 0 ? (
        <Card>
          <EmptyState icon={Receipt} title="No expenses yet" description="Track helmets, insurance, mods, and more." actionLabel="Add Expense" actionTo="/expenses/add" />
        </Card>
      ) : (
        <div className="space-y-3">
          {expenses.map((exp) => {
            const bike = typeof exp.bike === 'object' ? `${exp.bike.brand} ${exp.bike.model}` : '—'
            return (
              <Card key={exp._id} className="flex flex-wrap items-center justify-between gap-4 !p-4">
                <div>
                  <p className="text-xs font-medium text-accent uppercase">{exp.category}</p>
                  <p className="font-medium text-text">{exp.description || exp.storeName || 'Expense'}</p>
                  <p className="text-sm text-text-muted">{bike} · {fmtDate(exp.date)}</p>
                  {exp.storeName && <p className="text-xs text-text-subtle">{exp.storeName}</p>}
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-lg font-semibold text-text">₹{exp.amount.toLocaleString('en-IN')}</span>
                  <Link to={`/expenses/edit/${exp._id}`} className="text-text-muted hover:text-accent"><Pencil size={16} /></Link>
                  <button type="button" onClick={() => handleDelete(exp._id)} className="text-text-muted hover:text-red-400"><Trash2 size={16} /></button>
                </div>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
