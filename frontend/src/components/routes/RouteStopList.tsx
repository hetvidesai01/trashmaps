import { Home } from 'lucide-react'
import { RouteStopCard } from './RouteStopCard'
import type { CollectionPoint } from '../../types'

interface RouteStopListProps {
  depotName: string
  stops: CollectionPoint[]
  onMarkCollected: (pointId: string) => void
}

export function RouteStopList({ depotName, stops, onMarkCollected }: RouteStopListProps) {
  return (
    <div>
      <p className="flex items-center gap-1.5 text-xs font-medium text-muted">
        <Home size={13} />
        {depotName}
      </p>

      <div className="mt-2 space-y-2">
        {stops.map((point, index) => (
          <RouteStopCard key={point.id} order={index + 1} point={point} onMarkCollected={onMarkCollected} />
        ))}
      </div>

      <p className="mt-2 flex items-center gap-1.5 text-xs font-medium text-muted">
        <Home size={13} />
        Return to {depotName}
      </p>
    </div>
  )
}
