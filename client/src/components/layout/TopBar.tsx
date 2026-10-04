import { Link } from 'react-router-dom'
import { Menu, Bell, LogOut } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

interface TopBarProps {
  onMenuClick: () => void
}

export default function TopBar({ onMenuClick }: TopBarProps) {
  const { user, logout } = useAuth()

  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b border-border bg-panel px-4 lg:px-6">
      <div className="flex items-center gap-4">
        <button
          type="button"
          className="rounded-lg p-2 text-text-muted hover:bg-bg hover:text-text lg:hidden"
          onClick={onMenuClick}
          aria-label="Open menu"
        >
          <Menu size={22} />
        </button>
        <span className="text-sm text-text-muted lg:hidden">
          M<span className="text-accent">2</span>T
        </span>
      </div>

      <div className="flex items-center gap-3">
        <Link
          to="/reminders"
          className="rounded-xl p-2 text-text-muted transition-colors hover:bg-bg hover:text-text"
          aria-label="Reminders"
        >
          <Bell size={20} strokeWidth={1.5} />
        </Link>
        <Link to="/profile" className="flex items-center gap-3 rounded-xl border border-border bg-bg px-3 py-1.5 transition-colors hover:border-accent/40">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/30 text-sm font-semibold text-accent">
            {user?.name?.charAt(0).toUpperCase() || '?'}
          </div>
          <span className="hidden text-sm font-medium text-text sm:block">{user?.name}</span>
        </Link>
        <button
          type="button"
          onClick={logout}
          className="rounded-xl p-2 text-text-muted transition-colors hover:bg-bg hover:text-text"
          aria-label="Logout"
        >
          <LogOut size={20} strokeWidth={1.5} />
        </button>
      </div>
    </header>
  )
}
