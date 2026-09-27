import type { HTMLAttributes, ReactNode } from 'react'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
}

export function Card({ children, className = '', ...props }: CardProps) {
  return (
    <div
      className={`rounded-card border border-ink/[0.06] bg-surface shadow-[0_1px_2px_rgba(20,30,25,0.04),0_8px_24px_rgba(20,30,25,0.05)] ${className}`}
      {...props}
    >
      {children}
    </div>
  )
}
