import { motion } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'

const navLinks = [
  { label: 'Features', href: '/#features' },
  { label: 'Why M2T', href: '/#why' },
  { label: 'Preview', href: '/#preview' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="fixed top-0 left-0 right-0 z-50 px-6 py-4"
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between rounded-2xl border border-white/[0.08] bg-white/[0.03] px-6 py-3 backdrop-blur-xl">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-accent-dark to-accent-deep">
            <svg viewBox="0 0 24 24" className="h-4 w-4 text-white" fill="currentColor">
              <path d="M19 7c-.7 0-1.3.4-1.6 1H14l-1.5-3H8L6.5 8H4c-.6 0-1 .4-1 1v1h16V9c0-.6-.4-1-1-1h-1zM4 12v5c0 .6.4 1 1 1h1c.6 0 1-.4 1-1v-1h10v1c0 .6.4 1 1 1h1c.6 0 1-.4 1-1v-5H4zm3 3.5c-.8 0-1.5-.7-1.5-1.5S6.2 12.5 7 12.5s1.5.7 1.5 1.5S7.8 15.5 7 15.5z" />
            </svg>
          </div>
          <span className="text-lg font-semibold tracking-tight text-white">
            M<span className="text-accent">2</span>T
          </span>
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm text-text-muted transition-colors duration-200 hover:text-white"
            >
              {link.label}
            </a>
          ))}
        </div>

        <div className="hidden items-center gap-3 md:flex">
          <Link
            to="/login"
            className="rounded-full px-4 py-2 text-sm text-text-muted transition-colors hover:text-white"
          >
            Sign In
          </Link>
          <Link
            to="/register"
            className="rounded-full bg-gradient-to-r from-accent-dark to-accent px-5 py-2 text-sm font-medium text-white shadow-lg shadow-accent/20 transition-all duration-300 hover:shadow-accent/40 hover:brightness-110"
          >
            Get Started
          </Link>
        </div>

        <button
          type="button"
          className="text-white md:hidden"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>

      {open && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mx-auto mt-2 max-w-7xl rounded-2xl border border-white/[0.08] bg-bg-elevated/95 p-6 backdrop-blur-xl md:hidden"
        >
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="block py-3 text-text-muted transition-colors hover:text-white"
              onClick={() => setOpen(false)}
            >
              {link.label}
            </a>
          ))}
          <div className="mt-4 flex flex-col gap-3 border-t border-white/[0.08] pt-4">
            <Link to="/login" className="text-center text-sm text-text-muted">
              Sign In
            </Link>
            <Link
              to="/register"
              className="rounded-full bg-gradient-to-r from-accent-dark to-accent py-2.5 text-center text-sm font-medium text-white"
            >
              Get Started
            </Link>
          </div>
        </motion.div>
      )}
    </motion.header>
  )
}
