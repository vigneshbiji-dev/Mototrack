import { motion } from 'framer-motion'
import { Fuel, Wrench, Receipt, Bell, BarChart3, Warehouse } from 'lucide-react'

const features = [
  {
    icon: Fuel,
    title: 'Fuel Tracking',
    description:
      'Log fill-ups with price, quantity, odometer, and payment method. Auto-calculates mileage and cost per km.',
  },
  {
    icon: Wrench,
    title: 'Service History',
    description:
      'Track oil changes, chain service, brake work, and every repair with parts and labour costs.',
  },
  {
    icon: Receipt,
    title: 'Expense Tracking',
    description:
      'Accessories, insurance, tyres, modifications — categorize and monitor all ownership spending.',
  },
  {
    icon: Bell,
    title: 'Maintenance Reminders',
    description:
      'Smart alerts based on mileage or time so you never miss a service interval.',
  },
  {
    icon: BarChart3,
    title: 'Analytics Dashboard',
    description:
      'Fuel trends, average mileage, monthly costs, and ownership insights from your real data.',
  },
  {
    icon: Warehouse,
    title: 'Bike Garage',
    description:
      'Speed 400, CB650R, MT-07 — manage multiple bikes under one account, each with its own records.',
  },
]

const container = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } }
const item = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const },
  },
}

export default function Features() {
  return (
    <section id="features" className="px-6 py-28">
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
          className="mb-16 text-center"
        >
          <span className="text-xs font-medium tracking-widest text-accent uppercase">Features</span>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Everything your garage needs
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-text-muted">
            Fuel, service, expenses, analytics — centralized and separated by bike.
          </p>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-60px' }}
          className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
        >
          {features.map((feature) => (
            <motion.div
              key={feature.title}
              variants={item}
              className="group rounded-2xl border border-white/[0.06] bg-white/[0.02] p-7 backdrop-blur-sm transition-all duration-300 hover:border-accent/20 hover:bg-white/[0.04] hover:shadow-lg hover:shadow-accent/5"
            >
              <div className="mb-5 inline-flex rounded-xl bg-accent/10 p-3 transition-colors duration-300 group-hover:bg-accent/15">
                <feature.icon size={22} className="text-accent" strokeWidth={1.5} />
              </div>
              <h3 className="text-lg font-semibold text-white">{feature.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-text-muted">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
