import { motion } from 'framer-motion'
import { LayoutDashboard, Brain, Gauge, Shield } from 'lucide-react'

const reasons = [
  {
    icon: LayoutDashboard,
    title: 'Modern Dashboard',
    description: 'Clean interface built for riders — real stats from your database, not fake numbers.',
  },
  {
    icon: Brain,
    title: 'Smart Maintenance Insights',
    description: 'Track service frequency, costs per bike, and spot patterns before they become problems.',
  },
  {
    icon: Gauge,
    title: 'Accurate Fuel Mileage',
    description: 'Distance ÷ fuel quantity, calculated from odometer readings. Real km/L, not guesses.',
  },
  {
    icon: Shield,
    title: 'Secure Cloud Storage',
    description: 'JWT auth, bcrypt passwords, and user-scoped data — your bikes, your records only.',
  },
]

export default function WhyM2T() {
  return (
    <section id="why" className="relative px-6 py-28">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-accent/[0.02] to-transparent" />

      <div className="relative mx-auto max-w-7xl">
        <div className="grid items-center gap-16 lg:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className="text-xs font-medium tracking-widest text-accent uppercase">Why M2T</span>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Multiple bikes.{' '}
              <span className="text-accent">One platform.</span>
            </h2>
            <p className="mt-4 leading-relaxed text-text-muted">
              M2T's core idea: one authenticated user, many motorcycles, each with
              its own fuel, service, and expense records — plus ownership analytics
              pulled from real data.
            </p>

            <div className="mt-10 space-y-6">
              {reasons.map((reason, i) => (
                <motion.div
                  key={reason.title}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="flex gap-4"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent/10">
                    <reason.icon size={18} className="text-accent" strokeWidth={1.5} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">{reason.title}</h3>
                    <p className="mt-1 text-sm text-text-muted">{reason.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="relative"
          >
            <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-8 backdrop-blur-xl">
              <div className="mb-4 text-xs font-medium tracking-widest text-accent uppercase">
                My Garage
              </div>
              {['Triumph Speed 400', 'Honda CB650R', 'Yamaha MT-07'].map((bike) => (
                <div
                  key={bike}
                  className="mb-2 flex items-center justify-between rounded-xl border border-white/[0.05] bg-white/[0.02] px-5 py-3"
                >
                  <span className="text-sm text-white">{bike}</span>
                  <span className="text-xs text-accent">Active</span>
                </div>
              ))}

              <div className="mt-6 space-y-3">
                {[
                  { label: 'Total Fuel Cost', value: '₹8,420' },
                  { label: 'Avg Mileage', value: '32.4 km/L' },
                  { label: 'Monthly Expenses', value: '₹3,200' },
                ].map((stat) => (
                  <div
                    key={stat.label}
                    className="flex items-center justify-between rounded-xl border border-white/[0.05] bg-white/[0.02] px-5 py-3"
                  >
                    <span className="text-xs text-text-subtle">{stat.label}</span>
                    <span className="text-sm font-bold text-white">{stat.value}</span>
                  </div>
                ))}
              </div>

              <div className="mt-6 flex h-24 items-end gap-2">
                {[40, 65, 45, 80, 55, 90, 70, 85, 60, 95, 75, 88].map((h, i) => (
                  <div
                    key={i}
                    className="flex-1 rounded-t-sm bg-gradient-to-t from-accent/20 to-accent/60"
                    style={{ height: `${h}%` }}
                  />
                ))}
              </div>
            </div>
            <div className="absolute -right-4 -bottom-4 -z-10 h-full w-full rounded-2xl bg-accent/5 blur-xl" />
          </motion.div>
        </div>
      </div>
    </section>
  )
}
