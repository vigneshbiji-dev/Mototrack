import { useLocation } from 'react-router-dom'
import Card from '../components/ui/Card'
import { Construction } from 'lucide-react'

const titles: Record<string, string> = {
  '/service': 'Service & Maintenance',
  '/expenses': 'Expenses',
  '/analytics': 'Analytics',
  '/reminders': 'Reminders',
  '/profile': 'Profile',
  '/settings': 'Settings',
}

export default function ComingSoon() {
  const { pathname } = useLocation()
  const title = titles[pathname] || 'Coming Soon'

  return (
    <div className="mx-auto max-w-lg pt-12">
      <Card className="text-center">
        <Construction size={40} className="mx-auto text-accent" strokeWidth={1.5} />
        <h1 className="mt-4 text-xl font-bold text-text">{title}</h1>
        <p className="mt-2 text-sm text-text-muted">
          Part of the M2T roadmap — coming in the next development phase.
        </p>
      </Card>
    </div>
  )
}
