import { Button } from '../common/Button'
import type { CollectionRoute } from '../../types'

interface RouteResultPanelProps {
  route: CollectionRoute
  stopCount: number
  onStart: () => void
}

export function RouteResultPanel({ route, stopCount, onStart }: RouteResultPanelProps) {
  const { totalDistance, estimatedTime, distanceSaved, timeSaved } = route
  const hasSavings = (distanceSaved ?? 0) > 0 && (timeSaved ?? 0) > 0

  return (
    <section>
      <p className="text-xs font-semibold tracking-wider text-primary-dark">ROUTE READY</p>
      <p className="mt-2 font-display text-3xl font-semibold text-ink">
        {stopCount} {stopCount === 1 ? 'stop' : 'stops'} to collect
      </p>

      <div className="mt-6 grid grid-cols-2 gap-6">
        <div>
          <p className="text-sm text-muted">Original</p>
          <p className="mt-1 text-lg text-muted">
            {route.originalDistance} km &middot; {route.originalEstimatedTime} min
          </p>
        </div>
        <div>
          <p className="text-sm font-medium text-primary-dark">TrashMaps</p>
          <p className="mt-1 text-lg font-semibold text-ink">
            {totalDistance} km &middot; {estimatedTime} min
          </p>
        </div>
      </div>

      {hasSavings && (
        <p className="mt-6 rounded-lg bg-primary/10 px-4 py-3 text-base text-primary-dark">
          You save:{' '}
          <span className="font-semibold">
            {distanceSaved} km &middot; {timeSaved} min
          </span>
        </p>
      )}

      <Button className="mt-8 w-full justify-center py-3.5 text-base" onClick={onStart}>
        Start Route
      </Button>
    </section>
  )
}
