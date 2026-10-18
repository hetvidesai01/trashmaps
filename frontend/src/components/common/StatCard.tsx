import type { LucideIcon } from 'lucide-react'

export type StatTone = 'sky' | 'sage' | 'stone' | 'peach'

interface StatCardProps {
  label: string
  value: number | string
  tone: StatTone
  icon?: LucideIcon
}

const TONES: Record<StatTone, { bg: string; text: string }> = {
  sky: { bg: 'bg-tint-sky', text: 'text-[#3d6f9e]' },
  sage: { bg: 'bg-tint-sage', text: 'text-primary' },
  stone: { bg: 'bg-tint-stone', text: 'text-[#5c6760]' },
  peach: { bg: 'bg-tint-peach', text: 'text-status-citizen' },
}

/** Pastel number tile — the dashboard's headline statistics. */
export function StatCard({ label, value, tone, icon: Icon }: StatCardProps) {
  const palette = TONES[tone]
  return (
    <div className={`rounded-card px-4 py-5 text-center ${palette.bg}`}>
      {Icon && <Icon size={16} className={`mx-auto mb-1 ${palette.text}`} strokeWidth={2.25} />}
      <p className={`font-display text-4xl font-semibold leading-none ${palette.text}`}>{value}</p>
      <p className={`mt-2 text-xs font-bold leading-tight ${palette.text}`}>{label}</p>
    </div>
  )
}
