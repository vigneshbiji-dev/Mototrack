import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard,
  Warehouse,
  Fuel,
  Wrench,
  Receipt,
  BarChart3,
  Bell,
  User,
  Settings,
  X,
} from 'lucide-react'

const mainNav = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/garage', label: 'My Garage', icon: Warehouse },
  { to: '/fuel', label: 'Fuel', icon: Fuel },
  { to: '/service', label: 'Service', icon: Wrench },
  { to: '/expenses', label: 'Expenses', icon: Receipt },
  { to: '/analytics', label: 'Analytics', icon: BarChart3 },
  { to: '/reminders', label: 'Reminders', icon: Bell },
]

const bottomNav = [
  { to: '/profile', label: 'Profile', icon: User },
  { to: '/settings', label: 'Settings', icon: Settings },
]

const linkClass = ({ isActive }: { isActive: boolean }) =>
  `flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm transition-all ${
    isActive
      ? 'bg-primary/30 text-accent font-medium'
      : 'text-text-muted hover:bg-panel hover:text-text'
  }`

interface SidebarProps {
  open: boolean
  onClose: () => void
}

export default function Sidebar({ open, onClose }: SidebarProps) {
  const content = (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b border-border px-5 py-5">
        <span className="text-xl font-bold text-text">
          M<span className="text-accent">2</span>T
        </span>
        <button
          type="button"
          className="text-text-muted lg:hidden"
          onClick={onClose}
          aria-label="Close menu"
        >
          <X size={20} />
        </button>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
        {mainNav.map((item) => (
          <NavLink key={item.to} to={item.to} className={linkClass} onClick={onClose}>
            <item.icon size={18} strokeWidth={1.5} />
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="space-y-1 border-t border-border px-3 py-4">
        {bottomNav.map((item) => (
          <NavLink key={item.to} to={item.to} className={linkClass} onClick={onClose}>
            <item.icon size={18} strokeWidth={1.5} />
            {item.label}
          </NavLink>
        ))}
      </div>
    </div>
  )

  return (
    <>
      {/* Desktop */}
      <aside className="hidden w-64 shrink-0 border-r border-border bg-panel lg:block">
        {content}
      </aside>

      {/* Mobile drawer */}
      {open && (
        <>
          <div className="fixed inset-0 z-40 bg-black/60 lg:hidden" onClick={onClose} />
          <aside className="fixed inset-y-0 left-0 z-50 w-64 bg-panel lg:hidden">
            {content}
          </aside>
        </>
      )}
    </>
  )
}
