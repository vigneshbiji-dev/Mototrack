import { Search } from 'lucide-react'

const selectClass =
  'rounded-xl border border-border bg-bg px-3 py-2 text-sm text-text outline-none focus:border-accent'

interface FilterOption {
  value: string
  label: string
}

interface ListFiltersProps {
  search: string
  onSearchChange: (value: string) => void
  searchPlaceholder?: string
  bikeFilter?: string
  onBikeFilterChange?: (value: string) => void
  bikes?: { _id: string; brand: string; model: string }[]
  secondaryFilter?: string
  onSecondaryFilterChange?: (value: string) => void
  secondaryOptions?: FilterOption[]
  secondaryLabel?: string
  dateFrom?: string
  dateTo?: string
  onDateFromChange?: (value: string) => void
  onDateToChange?: (value: string) => void
}

export default function ListFilters({
  search,
  onSearchChange,
  searchPlaceholder = 'Search...',
  bikeFilter,
  onBikeFilterChange,
  bikes = [],
  secondaryFilter,
  onSecondaryFilterChange,
  secondaryOptions = [],
  secondaryLabel = 'All',
  dateFrom,
  dateTo,
  onDateFromChange,
  onDateToChange,
}: ListFiltersProps) {
  return (
    <div className="flex flex-wrap gap-3">
      <div className="relative min-w-[200px] flex-1">
        <Search size={16} className="absolute top-1/2 left-3 -translate-y-1/2 text-text-muted" />
        <input
          type="search"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder={searchPlaceholder}
          className={`${selectClass} w-full pl-9`}
        />
      </div>
      {onBikeFilterChange && (
        <select value={bikeFilter} onChange={(e) => onBikeFilterChange(e.target.value)} className={selectClass}>
          <option value="">All Bikes</option>
          {bikes.map((b) => (
            <option key={b._id} value={b._id}>
              {b.brand} {b.model}
            </option>
          ))}
        </select>
      )}
      {onSecondaryFilterChange && (
        <select value={secondaryFilter} onChange={(e) => onSecondaryFilterChange(e.target.value)} className={selectClass}>
          <option value="">{secondaryLabel}</option>
          {secondaryOptions.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      )}
      {onDateFromChange && (
        <input type="date" value={dateFrom} onChange={(e) => onDateFromChange(e.target.value)} className={selectClass} />
      )}
      {onDateToChange && (
        <input type="date" value={dateTo} onChange={(e) => onDateToChange(e.target.value)} className={selectClass} />
      )}
    </div>
  )
}
