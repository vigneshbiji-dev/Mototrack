import { Link } from 'react-router-dom'
import { Wrench, ExternalLink } from 'lucide-react'
import type { SmartServiceReminder } from '../services/maintenanceService'
import Button from './ui/Button'

const statusStyles = {
  overdue: { badge: 'SERVICE OVERDUE', badgeClass: 'text-red-400 bg-red-500/15', border: 'border-red-500/40' },
  due_soon: { badge: 'SERVICE DUE SOON', badgeClass: 'text-amber-400 bg-amber-500/15', border: 'border-amber-500/40' },
  upcoming: { badge: 'SERVICE DUE', badgeClass: 'text-accent bg-primary/20', border: 'border-accent/30' },
  up_to_date: { badge: 'UP TO DATE', badgeClass: 'text-emerald-400 bg-emerald-500/15', border: 'border-emerald-500/40' },
  no_schedule: { badge: 'NO VERIFIED SCHEDULE', badgeClass: 'text-text-muted bg-bg', border: 'border-border' },
}

export default function SmartServiceCard({ item }: { item: SmartServiceReminder }) {
  const style = statusStyles[item.status] || statusStyles.no_schedule

  return (
    <div className={`rounded-2xl border bg-panel p-5 ${style.border}`}>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className={`inline-block rounded-lg px-2 py-1 text-xs font-semibold tracking-wide uppercase ${style.badgeClass}`}>
            {style.badge}
          </p>
          <h3 className="mt-3 text-lg font-semibold text-text">
            {item.brand} {item.model}
          </h3>
          {item.serviceLabel && <p className="text-sm text-text-muted">{item.serviceLabel}</p>}
        </div>
        <Wrench size={22} className="text-accent/60" />
      </div>

      {item.verified && item.recommendedKm != null ? (
        <div className="mt-4 space-y-2 text-sm">
          <p className="text-text-muted">
            Recommended: <span className="font-medium text-text">{item.recommendedKm.toLocaleString('en-IN')} km</span>
          </p>
          <p className="text-text-muted">
            Current odometer: <span className="font-medium text-text">{item.currentOdometer.toLocaleString('en-IN')} km</span>
          </p>
          {item.status === 'overdue' && item.kmOverdueBy != null && (
            <p className="text-base font-semibold text-red-400">{item.kmOverdueBy.toLocaleString('en-IN')} km overdue</p>
          )}
          {item.status !== 'overdue' && item.kmRemaining != null && (
            <p className="text-base font-semibold text-accent">{item.kmRemaining.toLocaleString('en-IN')} km remaining</p>
          )}
          {item.daysRemaining != null && (
            <p className="text-xs text-text-subtle">
              {item.daysRemaining >= 0 ? `${item.daysRemaining} days until date-based interval` : `${Math.abs(item.daysRemaining)} days overdue (time)`}
            </p>
          )}
          {item.intervalLabel && (
            <p className="text-xs text-text-subtle">Service interval: {item.intervalLabel} · whichever comes first</p>
          )}
          {item.schedule?.source && (
            <p className="text-xs text-text-subtle">Manufacturer: {item.schedule.manufacturer} · Source: {item.schedule.source}</p>
          )}
        </div>
      ) : (
        <p className="mt-4 text-sm text-text-muted">{item.message}</p>
      )}

      <div className="mt-5 flex flex-wrap gap-2">
        <Button to="/service/add" variant="secondary">
          Log Service
        </Button>
        {item.schedule?.sourceUrl && (
          <a
            href={item.schedule.sourceUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 rounded-xl border border-border px-4 py-2 text-sm text-text-muted hover:border-accent hover:text-accent"
          >
            View manufacturer info <ExternalLink size={14} />
          </a>
        )}
        <Link to="/service" className="inline-flex items-center rounded-xl px-4 py-2 text-sm text-accent hover:underline">
          Service history
        </Link>
      </div>
    </div>
  )
}
