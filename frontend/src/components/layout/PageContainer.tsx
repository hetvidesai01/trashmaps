import type { ReactNode } from 'react'

interface PageContainerProps {
  children: ReactNode
  className?: string
}

export function PageContainer({ children, className = '' }: PageContainerProps) {
  return <div className={`mx-auto w-full max-w-6xl px-5 py-6 sm:py-8 lg:px-10 ${className}`}>{children}</div>
}
