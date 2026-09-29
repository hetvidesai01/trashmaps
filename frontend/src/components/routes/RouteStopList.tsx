import { Check, ArrowRight, Circle } from 'lucide-react'
import type { CollectionPoint } from '../../types'

interface RouteStopListProps {
  stops: CollectionPoint[]
  nextStopId: string | null
}

export function RouteStopList({ stops, nextStopId }: RouteStopListProps) {
  return (
    <ol className="divide-y divide-ink/[0.06]">
      {stops.map((point, index) => {
        const isCollected = point.status === 'collected'
        const isNext = point.id === nextStopId
        const isCitizen = point.source === 'citizen'
        const label = isCollected ? 'Collected' : isNext ? 'Next' : isCitizen ? 'Citizen Report' : 'Pending'

        return (
          <li
            key={point.id}
            className={`flex items-center gap-3 py-2.5 text-sm ${isCollected ? 'text-muted' : 'text-ink'} ${
              isNext ? 'font-semibold' : ''
            }`}
          >
            <span className="flex w-4 shrink-0 justify-center">
              {isCollected ? (
                <Check size={15} className="text-primary" />
              ) : isNext ? (
                <ArrowRight size={15} className="text-primary-dark" />
              ) : (
                <Circle size={12} className="text-muted/60" />
              )}
            </span>
            <span className="w-5 shrink-0 text-muted">{index + 1}</span>
            <span className="min-w-0 flex-1 truncate">{point.address}</span>
            <span
              className={`shrink-0 text-xs ${
                isNext
                  ? 'text-primary-dark'
                  : isCitizen && !isCollected
                    ? 'text-[color:var(--color-status-citizen)]'
                    : 'text-muted'
              }`}
            >
              {label}
            </span>
          </li>
        )
      })}
    </ol>
  )
}
