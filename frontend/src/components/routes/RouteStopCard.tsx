import { Check } from 'lucide-react'
import { StatusBadge } from '../common/StatusBadge'
import { Button } from '../common/Button'
import type { CollectionPoint } from '../../types'

interface RouteStopCardProps {
  order: number
  point: CollectionPoint
  onMarkCollected: (pointId: string) => void
}

export function RouteStopCard({ order, point, onMarkCollected }: RouteStopCardProps) {
  const isCollected = point.status === 'collected'
  const isCitizen = point.source === 'citizen'

  return (
    <div className={`flex items-center gap-3 rounded-lg border border-ink/[0.06] bg-surface p-3 ${isCollected ? 'opacity-60' : ''}`}>
      <span
        className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold"
        style={{
          backgroundColor: isCitizen
            ? 'color-mix(in srgb, var(--color-status-citizen) 14%, transparent)'
            : 'color-mix(in srgb, var(--color-primary) 14%, transparent)',
          color: isCitizen ? 'var(--color-status-citizen)' : 'var(--color-primary-dark)',
        }}
      >
        {String(order).padStart(2, '0')}
      </span>

      <div className="min-w-0 flex-1">
        <p className={`truncate text-sm font-medium text-ink ${isCollected ? 'line-through' : ''}`}>
          {point.address}
        </p>
        <p className="text-xs text-muted">{isCitizen ? 'Citizen' : 'Route'}</p>
      </div>

      <StatusBadge status={point.status} citizenReported={isCitizen} />

      {!isCollected && (
        <Button variant="secondary" onClick={() => onMarkCollected(point.id)} className="shrink-0">
          <Check size={14} />
          Collected
        </Button>
      )}
    </div>
  )
}
