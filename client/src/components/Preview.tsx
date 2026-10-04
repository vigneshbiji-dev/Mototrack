import { motion } from 'framer-motion'
import { Fuel, Wrench, BarChart3, Bell, Settings, ChevronRight } from 'lucide-react'

function DashboardMockup() {
  return (
    <div className="overflow-hidden rounded-xl border border-white/[0.08] bg-[#111] shadow-2xl">
      <div className="flex items-center gap-2 border-b border-white/[0.06] bg-[#0d0d0d] px-4 py-3">
        <div className="flex gap-1.5">
          <div className="h-3 w-3 rounded-full bg-[#ff5f57]" />
          <div className="h-3 w-3 rounded-full bg-[#febc2e]" />
          <div className="h-3 w-3 rounded-full bg-[#28c840]" />
        </div>
        <div className="mx-auto flex h-7 w-64 items-center justify-center rounded-md bg-white/[0.05] text-[10px] text-text-subtle">
          app.m2t.io/dashboard
        </div>
      </div>

      <div className="flex min-h-[340px]">
        <div className="hidden w-48 shrink-0 border-r border-white/[0.06] bg-[#0d0d0d] p-4 sm:block">
          <div className="mb-6 flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-gradient-to-br from-accent-dark to-accent-deep">
              <svg viewBox="0 0 24 24" className="h-3 w-3 text-white" fill="currentColor">
                <path d="M19 7c-.7 0-1.3.4-1.6 1H14l-1.5-3H8L6.5 8H4c-.6 0-1 .4-1 1v1h16V9c0-.6-.4-1-1-1h-1z" />
              </svg>
            </div>
            <span className="text-xs font-semibold text-white">
              M<span className="text-accent">2</span>T
            </span>
          </div>
          {[
            { icon: BarChart3, label: 'Dashboard', active: true },
            { icon: Fuel, label: 'Fuel Logs', active: false },
            { icon: Wrench, label: 'Service', active: false },
            { icon: Bell, label: 'Reminders', active: false },
            { icon: Settings, label: 'Settings', active: false },
          ].map((nav) => (
            <div
              key={nav.label}
              className={`mb-1 flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs ${
                nav.active ? 'bg-accent/10 text-accent' : 'text-text-subtle'
              }`}
            >
              <nav.icon size={14} strokeWidth={1.5} />
              {nav.label}
            </div>
          ))}
        </div>

        <div className="flex-1 p-5">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <div className="text-sm font-semibold text-white">Dashboard</div>
              <div className="text-[10px] text-text-subtle">Triumph Speed 400</div>
            </div>
            <div className="rounded-md bg-accent/10 px-2.5 py-1 text-[10px] font-medium text-accent">
              2024
            </div>
          </div>

          <div className="mb-4 grid grid-cols-3 gap-3">
            {[
              { label: 'Mileage', value: '32.4', unit: 'km/L' },
              { label: 'Odometer', value: '14,280', unit: 'km' },
              { label: 'This Month', value: '₹1,420', unit: 'spent' },
            ].map((card) => (
              <div key={card.label} className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-3">
                <div className="text-[9px] text-text-subtle">{card.label}</div>
                <div className="mt-1 text-sm font-bold text-white">
                  {card.value}
                  <span className="ml-0.5 text-[9px] font-normal text-text-subtle">{card.unit}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-3">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-[10px] font-medium text-white">Fuel Efficiency</span>
              <span className="text-[9px] text-accent">Last 6 months</span>
            </div>
            <div className="flex h-20 items-end gap-1.5">
              {[35, 42, 38, 45, 40, 48, 44, 50, 46, 52, 49, 55].map((h, i) => (
                <div
                  key={i}
                  className="flex-1 rounded-t-sm bg-gradient-to-t from-accent/15 to-accent/50"
                  style={{ height: `${(h / 55) * 100}%` }}
                />
              ))}
            </div>
          </div>

          <div className="mt-3 space-y-2">
            {[
              { label: 'Oil Change Due', days: '12 days', urgent: false },
              { label: 'Chain Lubrication', days: '3 days', urgent: true },
            ].map((reminder) => (
              <div
                key={reminder.label}
                className="flex items-center justify-between rounded-lg border border-white/[0.04] bg-white/[0.01] px-3 py-2"
              >
                <div className="flex items-center gap-2">
                  <div className={`h-1.5 w-1.5 rounded-full ${reminder.urgent ? 'bg-accent' : 'bg-yellow-500'}`} />
                  <span className="text-[10px] text-text-muted">{reminder.label}</span>
                </div>
                <div className="flex items-center gap-1 text-[9px] text-text-subtle">
                  {reminder.days}
                  <ChevronRight size={10} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function Preview() {
  return (
    <section id="preview" className="px-6 py-28">
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
          className="mb-16 text-center"
        >
          <span className="text-xs font-medium tracking-widest text-accent uppercase">Preview</span>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Your command center for every ride
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-text-muted">
            Real data from MongoDB — fuel costs, mileage, service reminders, all in one dashboard.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="relative mx-auto max-w-4xl"
        >
          <div className="absolute -inset-8 rounded-3xl bg-gradient-to-b from-accent/10 via-transparent to-transparent blur-2xl" />
          <DashboardMockup />
          <div className="mx-auto mt-0 h-3 w-[calc(100%+40px)] -translate-x-5 rounded-b-xl bg-gradient-to-b from-[#1a1a1a] to-[#111] shadow-lg" />
          <div className="mx-auto h-1.5 w-24 rounded-b-lg bg-[#222]" />
        </motion.div>
      </div>
    </section>
  )
}
