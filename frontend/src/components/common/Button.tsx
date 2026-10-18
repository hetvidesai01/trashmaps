import type { ButtonHTMLAttributes, ReactNode } from 'react'

type Variant = 'primary' | 'secondary' | 'soft' | 'light' | 'ghost'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  icon?: ReactNode
  children: ReactNode
}

const variantClasses: Record<Variant, string> = {
  primary:
    'bg-primary-dark text-white shadow-button hover:bg-primary disabled:bg-muted/40 disabled:text-white/80 disabled:shadow-none',
  secondary:
    'bg-surface text-primary-dark border border-line hover:border-primary/40 hover:bg-sage-soft disabled:opacity-60',
  soft: 'bg-sage text-primary-dark hover:bg-accent/60 disabled:opacity-60',
  light: 'bg-white text-primary-dark shadow-card hover:bg-sage-soft disabled:opacity-60',
  ghost: 'bg-transparent text-muted hover:text-ink hover:bg-ink/5',
}

export function Button({
  variant = 'primary',
  icon,
  children,
  className = '',
  ...props
}: ButtonProps) {
  return (
    <button
      className={`tm-press inline-flex min-h-11 items-center justify-center gap-2 rounded-2xl px-5 py-3 text-sm font-bold disabled:cursor-not-allowed ${variantClasses[variant]} ${className}`}
      {...props}
    >
      {icon}
      {children}
    </button>
  )
}
