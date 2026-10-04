import type { LucideIcon } from 'lucide-react'

interface StatCardProps {
  label: string
  value: string | number
  icon: LucideIcon
  unit?: string
}

export default function StatCard({ label, value, icon: Icon, unit }: StatCardProps) {
  return (
    <div className="rounded-2xl border border-border bg-panel p-6 transition-colors hover:border-accent/30">
      <div className="flex items-start justify-between">
        <span className="text-xs font-medium tracking-wide text-text-muted uppercase">
          {label}
        </span>
        <div className="rounded-xl bg-primary/20 p-2">
          <Icon size={18} className="text-accent" strokeWidth={1.5} />
        </div>
      </div>
      <div className="mt-4">
        <span className="text-3xl font-bold tracking-tight text-text">
          {value}
        </span>
        {unit && (
          <span className="ml-1.5 text-sm text-text-muted">{unit}</span>
        )}
      </div>
    </div>
  )
}
