import { Link } from 'react-router-dom'
import { Bike } from 'lucide-react'

interface BikeCardProps {
  brand: string
  model: string
  engineCapacity?: number
  currentOdometer?: number
  fuelType?: string
  imageUrl?: string
}

export default function BikeCard({
  brand,
  model,
  engineCapacity,
  currentOdometer,
  fuelType,
  imageUrl,
}: BikeCardProps) {
  return (
    <div className="group overflow-hidden rounded-2xl border border-border bg-panel transition-all hover:border-accent/40">
      <div className="relative flex h-40 items-center justify-center overflow-hidden bg-gradient-to-br from-primary/20 to-bg">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={`${brand} ${model}`}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <Bike size={48} className="text-accent/40" strokeWidth={1} />
        )}
      </div>
      <div className="p-5">
        <p className="text-xs font-medium tracking-wide text-text-muted uppercase">{brand}</p>
        <h3 className="mt-1 text-lg font-semibold text-text">{model}</h3>
        <div className="mt-3 flex gap-4 text-xs text-text-muted">
          {engineCapacity && <span>{engineCapacity}cc</span>}
          <span>{currentOdometer?.toLocaleString()} km</span>
          {fuelType && <span>{fuelType}</span>}
        </div>
        <Link
          to="/garage"
          className="mt-4 inline-flex text-sm font-medium text-accent transition-colors group-hover:underline"
        >
          View Details →
        </Link>
      </div>
    </div>
  )
}
