import type { HTMLAttributes, ReactNode } from 'react'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
}

export function Card({ children, className = '', ...props }: CardProps) {
  return (
    <div
      className={`rounded-card border border-line/70 bg-surface shadow-card ${className}`}
      {...props}
    >
      {children}
    </div>
  )
}
