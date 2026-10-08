import { Link } from 'react-router-dom'
import { Bike } from 'lucide-react'

interface BikeCardProps {
  /** Prefer `bikeId`; falls back to Mongo `_id` when spreading a bike object */
  bikeId?: string
  _id?: string
  brand: string
  model: string
  engineCapacity?: number
  currentOdometer?: number
  fuelType?: string
  imageUrl?: string
}

export default function BikeCard({
  bikeId,
  _id,
  brand,
  model,
  engineCapacity,
  currentOdometer,
  fuelType,
  imageUrl,
}: BikeCardProps) {
  const id = bikeId ?? _id
  const detailTo = id ? `/garage/${id}` : null

  return (
    <div className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-panel transition-all hover:border-accent/40">
      {detailTo ? (
        <Link to={detailTo} className="block flex-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/50">
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
          <div className="p-5 pb-3">
            <p className="text-xs font-medium tracking-wide text-text-muted uppercase">{brand}</p>
            <h3 className="mt-1 text-lg font-semibold text-text">{model}</h3>
            <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-text-muted">
              {engineCapacity != null && engineCapacity > 0 && <span>{engineCapacity} cc</span>}
              <span>{currentOdometer?.toLocaleString('en-IN') ?? '—'} km</span>
              {fuelType && <span>{fuelType}</span>}
            </div>
          </div>
        </Link>
      ) : (
        <>
          <div className="relative flex h-40 items-center justify-center overflow-hidden bg-gradient-to-br from-primary/20 to-bg">
            <Bike size={48} className="text-accent/40" strokeWidth={1} />
          </div>
          <div className="p-5 pb-3">
            <p className="text-xs font-medium tracking-wide text-text-muted uppercase">{brand}</p>
            <h3 className="mt-1 text-lg font-semibold text-text">{model}</h3>
          </div>
        </>
      )}

      <div className="mt-auto p-5 pt-0">
        {detailTo ? (
          <Link
            to={detailTo}
            className="flex w-full items-center justify-center rounded-xl border border-border bg-bg px-4 py-2.5 text-sm font-medium text-accent transition-colors hover:border-accent/60 hover:bg-accent/10"
          >
            View details
          </Link>
        ) : (
          <span className="block text-center text-sm text-text-subtle">Details unavailable</span>
        )}
      </div>
    </div>
  )
}
