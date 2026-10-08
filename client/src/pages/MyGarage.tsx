import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Trash2, Pencil, Bike } from 'lucide-react'
import { getBikes, deleteBike } from '../services/bikeService'
import type { BikeInput } from '../services/bikeService'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'
import BikeCard from '../components/BikeCard'
import EmptyState from '../components/ui/EmptyState'
import LoadingSpinner from '../components/ui/LoadingSpinner'
import ListFilters from '../components/ui/ListFilters'

type BikeData = BikeInput & { _id: string }

export default function MyGarage() {
  const [bikes, setBikes] = useState<BikeData[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  const load = () => {
    getBikes()
      .then(setBikes)
      .catch(console.error)
      .finally(() => setLoading(false))
  }

  useEffect(load, [])

  const filtered = bikes.filter((bike) => {
    if (!search.trim()) return true
    const q = search.toLowerCase()
    return (
      bike.brand.toLowerCase().includes(q) ||
      bike.model.toLowerCase().includes(q) ||
      bike.registrationNumber?.toLowerCase().includes(q) ||
      bike.fuelType?.toLowerCase().includes(q)
    )
  })

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete ${name}?`)) return
    await deleteBike(id)
    load()
  }

  return (
    <div className="mx-auto max-w-7xl space-y-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text sm:text-3xl">My Garage</h1>
          <p className="mt-2 text-text-muted">Manage all your motorcycles</p>
        </div>
        <Button to="/garage/add">
          <Plus size={16} /> Add Motorcycle
        </Button>
      </div>

      {bikes.length > 0 && (
        <ListFilters search={search} onSearchChange={setSearch} searchPlaceholder="Search brand, model, registration..." />
      )}

      {loading ? (
        <LoadingSpinner label="Loading garage..." />
      ) : bikes.length === 0 ? (
        <Card>
          <EmptyState
            icon={Bike}
            title="Your garage is empty"
            description="Add your Triumph, Honda, Yamaha — track each one separately."
            actionLabel="Add Motorcycle"
            actionTo="/garage/add"
          />
        </Card>
      ) : filtered.length === 0 ? (
        <Card><p className="py-8 text-center text-text-muted">No bikes match your search</p></Card>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((bike) => (
            <div key={bike._id} className="relative flex flex-col">
              <BikeCard {...bike} />
              <div className="pointer-events-none absolute top-3 right-3 z-10 flex gap-1">
                <Link
                  to={`/garage/edit/${bike._id}`}
                  className="pointer-events-auto rounded-lg bg-bg/90 p-2 text-text-muted shadow-sm transition-colors hover:text-accent"
                  aria-label="Edit bike"
                >
                  <Pencil size={16} />
                </Link>
                <button
                  type="button"
                  onClick={() => handleDelete(bike._id, `${bike.brand} ${bike.model}`)}
                  className="pointer-events-auto rounded-lg bg-bg/90 p-2 text-text-muted shadow-sm transition-colors hover:text-red-400"
                  aria-label="Delete bike"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
