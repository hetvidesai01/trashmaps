import { Truck, MapPin, Loader2, Sparkles, RefreshCw } from 'lucide-react'
import { Card } from '../common/Card'
import { Button } from '../common/Button'
import type { CollectionRoute } from '../../types'

interface RouteControlsProps {
  routes: CollectionRoute[]
  selectedRoute: CollectionRoute
  onSelectRoute: (routeId: string) => void
  onOptimize: () => void
  isOptimizing: boolean
  remainingActiveCount: number
}

export function RouteControls({
  routes,
  selectedRoute,
  onSelectRoute,
  onOptimize,
  isOptimizing,
  remainingActiveCount,
}: RouteControlsProps) {
  const hasOptimized = Boolean(selectedRoute.optimizedStops)
  const allCollected = remainingActiveCount === 0

  return (
    <Card className="p-5">
      <label className="text-xs text-muted" htmlFor="route-select">
        Existing route
      </label>
      <select
        id="route-select"
        value={selectedRoute.routeId}
        onChange={(event) => onSelectRoute(event.target.value)}
        className="mt-1.5 w-full rounded-lg border border-ink/10 bg-bg px-3 py-2.5 text-sm font-medium text-ink focus:border-primary focus:outline-none"
      >
        {routes.map((route) => (
          <option key={route.routeId} value={route.routeId}>
            {route.routeId} — {route.name}
          </option>
        ))}
      </select>

      <dl className="mt-4 space-y-2 text-sm">
        <div className="flex items-center justify-between">
          <dt className="flex items-center gap-1.5 text-muted">
            <Truck size={14} />
            Vehicle
          </dt>
          <dd className="text-ink">{selectedRoute.vehicle}</dd>
        </div>
        <div className="flex items-center justify-between">
          <dt className="flex items-center gap-1.5 text-muted">
            <MapPin size={14} />
            Depot
          </dt>
          <dd className="text-ink">{selectedRoute.depot.name}</dd>
        </div>
        <div className="flex items-center justify-between">
          <dt className="text-muted">Scheduled points</dt>
          <dd className="text-ink">{selectedRoute.originalStops.length}</dd>
        </div>
        <div className="flex items-center justify-between">
          <dt className="text-muted">Original distance</dt>
          <dd className="text-ink">{selectedRoute.originalDistance} km</dd>
        </div>
        <div className="flex items-center justify-between">
          <dt className="text-muted">Original time</dt>
          <dd className="text-ink">{selectedRoute.originalEstimatedTime} min</dd>
        </div>
      </dl>

      <div className="mt-5 border-t border-ink/[0.06] pt-4">
        {allCollected ? (
          <p className="rounded-lg bg-primary/10 px-3 py-2.5 text-center text-sm font-medium text-primary-dark">
            All active points collected for this route
          </p>
        ) : (
          <Button className="w-full justify-center" onClick={onOptimize} disabled={isOptimizing}>
            {isOptimizing ? (
              <>
                <Loader2 size={15} className="animate-spin" />
                Optimizing route…
              </>
            ) : hasOptimized ? (
              <>
                <RefreshCw size={15} />
                Recalculate remaining route
              </>
            ) : (
              <>
                <Sparkles size={15} />
                Generate optimized route
              </>
            )}
          </Button>
        )}
      </div>
    </Card>
  )
}
