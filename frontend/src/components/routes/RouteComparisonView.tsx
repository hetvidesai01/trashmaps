import { Card } from '../common/Card'
import type { CollectionRoute } from '../../types'

interface RouteComparisonViewProps {
  route: CollectionRoute
}

export function RouteComparisonView({ route }: RouteComparisonViewProps) {
  if (!route.optimizedStops || route.totalDistance == null || route.estimatedTime == null) {
    return null
  }

  const skippedCount = route.originalStops.filter((point) => !point.requiresCollection).length

  return (
    <Card className="p-5">
      <h2 className="font-display text-base font-semibold text-ink">Original vs optimized</h2>

      <div className="mt-4 grid grid-cols-2 gap-4">
        <div>
          <p className="text-xs text-muted">Original route</p>
          <p className="mt-1 font-display text-2xl font-semibold text-ink">{route.originalDistance} km</p>
          <p className="text-xs text-muted">{route.originalEstimatedTime} min</p>
          <p className="text-xs text-muted">{route.originalStops.length} scheduled stops</p>
        </div>
        <div>
          <p className="text-xs text-muted">Optimized route</p>
          <p className="mt-1 font-display text-2xl font-semibold text-primary-dark">{route.totalDistance} km</p>
          <p className="text-xs text-muted">{route.estimatedTime} min</p>
          <p className="text-xs text-muted">{route.optimizedStops.length} required stops</p>
        </div>
      </div>

      <div className="mt-4 rounded-lg bg-primary/10 p-3.5">
        <p className="text-xs font-semibold text-primary-dark">Saved</p>
        <div className="mt-1.5 grid grid-cols-3 gap-2 text-center">
          <div>
            <p className="font-display text-lg font-semibold text-primary-dark">{route.distanceSaved} km</p>
          </div>
          <div>
            <p className="font-display text-lg font-semibold text-primary-dark">{route.timeSaved} min</p>
          </div>
          <div>
            <p className="font-display text-lg font-semibold text-primary-dark">{skippedCount}</p>
          </div>
        </div>
        <div className="mt-1 grid grid-cols-3 gap-2 text-center text-xs text-muted">
          <span>distance</span>
          <span>time</span>
          <span>stops avoided</span>
        </div>
      </div>
    </Card>
  )
}
