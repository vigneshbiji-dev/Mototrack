import { Link } from 'react-router-dom'

type Variant = 'primary' | 'secondary' | 'ghost'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  to?: string
  children: React.ReactNode
}

const variants: Record<Variant, string> = {
  primary:
    'bg-primary text-text hover:bg-accent border border-primary shadow-lg shadow-primary/20',
  secondary:
    'bg-transparent text-text border border-border hover:border-accent/50 hover:bg-panel',
  ghost: 'bg-transparent text-text-muted hover:text-text hover:bg-panel',
}

export default function Button({
  variant = 'primary',
  to,
  children,
  className = '',
  type = 'button',
  ...props
}: ButtonProps) {
  const classes = `inline-flex items-center justify-center gap-2 rounded-2xl px-5 py-2.5 text-sm font-medium transition-all duration-200 disabled:opacity-50 ${variants[variant]} ${className}`

  if (to) {
    return (
      <Link to={to} className={classes}>
        {children}
      </Link>
    )
  }

  return (
    <button type={type} className={classes} {...props}>
      {children}
    </button>
  )
}
