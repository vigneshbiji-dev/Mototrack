import { motion } from 'framer-motion'
import { Fuel, Wrench, BarChart3 } from 'lucide-react'
import PublicLayout from './PublicLayout'

const highlights = [
  { icon: Fuel, text: 'Track fuel & mileage across all your bikes' },
  { icon: Wrench, text: 'Service history & maintenance reminders' },
  { icon: BarChart3, text: 'Ownership analytics from real ride data' },
]

interface AuthLayoutProps {
  title: string
  subtitle: string
  children: React.ReactNode
}

export default function AuthLayout({ title, subtitle, children }: AuthLayoutProps) {
  return (
    <PublicLayout>
      <section className="relative flex min-h-[calc(100vh-80px)] flex-1 overflow-hidden">
        {/* Background glow */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute top-0 right-0 h-[600px] w-[600px] rounded-full bg-accent/[0.04] blur-[120px]" />
          <div className="absolute bottom-0 left-0 h-[400px] w-[400px] rounded-full bg-accent-deep/[0.03] blur-[100px]" />
        </div>

        <div className="relative mx-auto grid w-full max-w-7xl flex-1 lg:grid-cols-2">
          {/* Left — branding panel */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="relative hidden flex-col justify-center px-10 py-16 lg:flex xl:px-16"
          >
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-accent/[0.08] via-transparent to-accent-deep/[0.05]" />

            <div className="relative">
              <span className="inline-flex items-center gap-2 rounded-full border border-accent/20 bg-accent/10 px-4 py-1.5 text-xs font-medium tracking-wide text-accent uppercase">
                Moto2Travel
              </span>

              <h1 className="mt-8 text-4xl leading-tight font-bold tracking-tight text-white xl:text-5xl">
                Your Bikes.{' '}
                <span className="bg-gradient-to-r from-accent to-accent-light bg-clip-text text-transparent">
                  Your Journey.
                </span>
              </h1>

              <p className="mt-5 max-w-md text-lg leading-relaxed text-text-muted">
                One platform to manage fuel logs, service records, expenses, and
                analytics for every motorcycle you own.
              </p>

              <ul className="mt-12 space-y-5">
                {highlights.map((item, i) => (
                  <motion.li
                    key={item.text}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 + i * 0.1, duration: 0.5 }}
                    className="flex items-center gap-4"
                  >
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-accent/10">
                      <item.icon size={20} className="text-accent" strokeWidth={1.5} />
                    </div>
                    <span className="text-base text-text-muted">{item.text}</span>
                  </motion.li>
                ))}
              </ul>

              <div className="mt-14 flex gap-10 border-t border-white/[0.06] pt-10">
                {[
                  { value: 'Multi-Bike', label: 'One Account' },
                  { value: 'Secure', label: 'JWT Auth' },
                  { value: 'Real Data', label: 'Live Analytics' },
                ].map((stat) => (
                  <div key={stat.label}>
                    <div className="text-lg font-bold text-white">{stat.value}</div>
                    <div className="text-xs text-text-subtle">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Right — form panel */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="flex items-center justify-center px-6 py-16 pt-28 sm:px-10 lg:py-16 lg:pt-16 xl:px-16"
          >
            <div className="w-full max-w-xl">
              <div className="mb-10 lg:mb-12">
                <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                  {title}
                </h2>
                <p className="mt-3 text-base text-text-muted sm:text-lg">{subtitle}</p>
              </div>

              <div className="rounded-3xl border border-white/[0.08] bg-white/[0.03] p-8 shadow-2xl shadow-black/20 backdrop-blur-xl sm:p-10 lg:p-12">
                {children}
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </PublicLayout>
  )
}
