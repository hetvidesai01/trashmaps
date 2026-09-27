import { Truck } from 'lucide-react'
import { Card } from '../common/Card'
import { Button } from '../common/Button'
import { CollectionProgressBar } from './CollectionProgressBar'
import type { CollectionRoute } from '../../types'

interface RouteCardProps {
  route: CollectionRoute
}

export function RouteCard({ route }: RouteCardProps) {
  const skippedCount = route.originalStops.filter((point) => !point.requiresCollection).length
  const citizenAddedCount = route.activeStops.filter((point) => point.source === 'citizen').length

  return (
    <Card className="p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs text-muted">{route.routeId}</p>
          <h3 className="font-display text-lg font-semibold text-ink">{route.name}</h3>
          <p className="mt-1 flex items-center gap-1.5 text-xs text-muted">
            <Truck size={13} />
            Depot: {route.depot.name}
          </p>
        </div>
      </div>

      <div className="mt-4">
        <CollectionProgressBar progress={route.collectionProgress} />
      </div>

      <div className="mt-4 grid grid-cols-4 gap-3 text-center">
        <div>
          <p className="font-display text-lg font-semibold text-ink">{route.originalStops.length}</p>
          <p className="text-xs text-muted">Original</p>
        </div>
        <div>
          <p className="font-display text-lg font-semibold text-[#D97706]">{route.activeStops.length}</p>
          <p className="text-xs text-muted">Active</p>
        </div>
        <div>
          <p className="font-display text-lg font-semibold text-[#9CA3AF]">{skippedCount}</p>
          <p className="text-xs text-muted">Skipped</p>
        </div>
        <div>
          <p className="font-display text-lg font-semibold text-[#7C3AED]">{citizenAddedCount}</p>
          <p className="text-xs text-muted">Citizen</p>
        </div>
      </div>

      <div className="mt-5 flex items-center justify-between border-t border-ink/[0.06] pt-4">
        <p className="text-xs text-muted">
          {route.optimizedStops ? 'Optimized order ready' : 'Not yet sent to optimizer'}
        </p>
        <Button variant="secondary" disabled>
          Send to optimizer
        </Button>
      </div>
    </Card>
  )
}
