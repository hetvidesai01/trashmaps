import type { LucideIcon } from 'lucide-react'
import { Card } from './Card'

interface StatCardProps {
  icon: LucideIcon
  label: string
  value: number | string
  accentColor: string
}

export function StatCard({ icon: Icon, label, value, accentColor }: StatCardProps) {
  return (
    <Card className="p-5">
      <span
        className="flex h-9 w-9 items-center justify-center rounded-lg"
        style={{
          backgroundColor: `color-mix(in srgb, ${accentColor} 14%, transparent)`,
          color: accentColor,
        }}
      >
        <Icon size={18} strokeWidth={2} />
      </span>
      <p className="mt-3 font-display text-3xl font-semibold" style={{ color: accentColor }}>
        {value}
      </p>
      <p className="mt-1 text-xs text-muted">{label}</p>
    </Card>
  )
}
