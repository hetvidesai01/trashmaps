import { Check } from 'lucide-react'
import { Card } from '../common/Card'
import type { CollectionPoint } from '../../types'

interface RouteStopListProps {
  stops: CollectionPoint[]
  nextStopId: string | null
}

export function RouteStopList({ stops, nextStopId }: RouteStopListProps) {
  return (
    <Card className="overflow-hidden">
      <p className="px-5 pb-1 pt-4 text-sm font-extrabold text-ink">All stops</p>
      <ol className="divide-y divide-line/70 px-2 pb-2">
        {stops.map((point, index) => {
          const isCollected = point.status === 'collected'
          const isNext = point.id === nextStopId
          const isCitizen = point.source === 'citizen'
          const label = isCollected ? 'Collected' : isNext ? 'Next' : isCitizen ? 'Citizen report' : 'Pending'

          return (
            <li
              key={point.id}
              className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm ${
                isNext ? 'bg-sage-soft font-extrabold text-ink' : isCollected ? 'text-muted' : 'font-semibold text-ink'
              }`}
            >
              <span
                className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[11px] font-extrabold text-white ${
                  isCollected ? 'bg-status-collected' : isCitizen ? 'bg-status-citizen' : 'bg-primary'
                }`}
              >
                {isCollected ? <Check size={13} strokeWidth={3} /> : index + 1}
              </span>
              <span className="min-w-0 flex-1 truncate">{point.address}</span>
              <span
                className={`shrink-0 text-xs font-bold ${
                  isNext ? 'text-primary-dark' : isCitizen && !isCollected ? 'text-status-citizen' : 'text-muted'
                }`}
              >
                {label}
              </span>
            </li>
          )
        })}
      </ol>
    </Card>
  )
}
