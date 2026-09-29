import { useEffect, useMemo, useState } from 'react'
import { PageContainer } from '../../components/layout/PageContainer'
import { MapView } from '../../components/map/MapView'
import { CollectionPointMarker } from '../../components/map/CollectionPointMarker'
import { DepotMarker } from '../../components/map/DepotMarker'
import { RouteLayer } from '../../components/map/RouteLayer'
import { RouteLegend } from '../../components/routes/RouteLegend'
import { RouteSummaryPanel } from '../../components/routes/RouteSummaryPanel'
import { RouteResultPanel } from '../../components/routes/RouteResultPanel'
import { NextStopPanel } from '../../components/routes/NextStopPanel'
import { RouteStopList } from '../../components/routes/RouteStopList'
import { getCollectionRoutes, optimizeRoute, updateCollectionPointStatus } from '../../services/api'
import { straightLineKm } from '../../utils/geo'
import { summarizeRoute } from '../../utils/routeSummary'
import type { CollectionPoint, CollectionRoute } from '../../types'

function markCollected(route: CollectionRoute, pointId: string): CollectionRoute {
  const apply = (point: CollectionPoint): CollectionPoint =>
    point.id === pointId
      ? { ...point, status: 'collected', requiresCollection: false, lastCollected: new Date().toISOString() }
      : point

  const activeStops = route.activeStops.map(apply)
  const collectedCount = activeStops.filter((point) => point.status === 'collected').length

  return {
    ...route,
    originalStops: route.originalStops.map(apply),
    activeStops,
    optimizedStops: route.optimizedStops ? route.optimizedStops.map(apply) : null,
    collectionProgress: activeStops.length === 0 ? 1 : collectedCount / activeStops.length,
  }
}

export function Routes() {
  const [routes, setRoutes] = useState<CollectionRoute[] | null>(null)
  const [selectedRouteId, setSelectedRouteId] = useState<string | null>(null)
  const [startedRouteIds, setStartedRouteIds] = useState<string[]>([])
  const [showOriginal, setShowOriginal] = useState(false)
  const [isOptimizing, setIsOptimizing] = useState(false)
  const [optimizeError, setOptimizeError] = useState<string | null>(null)

  useEffect(() => {
    getCollectionRoutes().then((data) => {
      setRoutes(data)
      const current = data.reduce((furthest, route) =>
        route.collectionProgress > furthest.collectionProgress ? route : furthest,
      )
      setSelectedRouteId(current.routeId)
    })
  }, [])

  const selectedRoute = routes?.find((route) => route.routeId === selectedRouteId) ?? null

  const routePoints = useMemo(() => {
    if (!selectedRoute) return []
    const citizenExtras = selectedRoute.activeStops.filter((point) => point.source === 'citizen')
    return [...selectedRoute.originalStops, ...citizenExtras]
  }, [selectedRoute])

  // Map numbers follow the optimized order once it exists; before that, the
  // normal route order of the stops that still need a visit.
  const orderIndex = useMemo(() => {
    const map = new Map<string, number>()
    if (!selectedRoute) return map
    const sequence =
      selectedRoute.optimizedStops ?? selectedRoute.activeStops.filter((point) => point.status !== 'collected')
    sequence.forEach((point, index) => map.set(point.id, index + 1))
    return map
  }, [selectedRoute])

  async function handleOptimize() {
    if (!selectedRoute) return
    const remaining = selectedRoute.activeStops.filter((point) => point.status !== 'collected')
    setIsOptimizing(true)
    setOptimizeError(null)
    try {
      const result = await optimizeRoute(selectedRoute, remaining)
      setRoutes(
        (prev) =>
          prev?.map((route) =>
            route.routeId === selectedRoute.routeId
              ? {
                  ...route,
                  // Stops already collected stay at the front so stop numbers
                  // and "Stop X of Y" don't shift when the rest is recalculated.
                  optimizedStops: [
                    ...(route.optimizedStops ?? []).filter((point) => point.status === 'collected'),
                    ...result.optimizedStops,
                  ],
                  totalDistance: result.totalDistance,
                  estimatedTime: result.estimatedTime,
                  distanceSaved: result.distanceSaved,
                  timeSaved: result.timeSaved,
                  generatedAt: result.generatedAt,
                }
              : route,
          ) ?? prev,
      )
    } catch {
      setOptimizeError('Something went wrong. Please try again.')
    } finally {
      setIsOptimizing(false)
    }
  }

  function handleMarkCollected(pointId: string) {
    if (!selectedRoute) return
    // Update the shared store so Dashboard/Waste Map see this on their next
    // fetch, and apply the same change locally for instant feedback here.
    updateCollectionPointStatus(pointId, 'collected')
    setRoutes(
      (prev) =>
        prev?.map((route) => (route.routeId === selectedRoute.routeId ? markCollected(route, pointId) : route)) ??
        prev,
    )
  }

  function handleSelectRoute(routeId: string) {
    setSelectedRouteId(routeId)
    setShowOriginal(false)
    setOptimizeError(null)
  }

  if (!selectedRoute) {
    return (
      <PageContainer>
        <p className="text-sm text-muted">Loading today&rsquo;s route&hellip;</p>
      </PageContainer>
    )
  }

  const summary = summarizeRoute(selectedRoute)
  const orderedStops = selectedRoute.optimizedStops
  const isStarted = startedRouteIds.includes(selectedRoute.routeId)
  const phase = !orderedStops ? 'plan' : isStarted ? 'collecting' : 'ready'

  const nextStopIndex = orderedStops ? orderedStops.findIndex((point) => point.status !== 'collected') : -1
  const nextStop = orderedStops && nextStopIndex >= 0 ? orderedStops[nextStopIndex] : null
  const previousStop = orderedStops && nextStopIndex > 0 ? orderedStops[nextStopIndex - 1] : selectedRoute.depot
  const distanceAwayKm = nextStop ? straightLineKm(previousStop, nextStop) : null
  const orderedCollected = orderedStops?.filter((point) => point.status === 'collected').length ?? 0

  return (
    <PageContainer>
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-semibold text-ink">Today&rsquo;s Route</h1>
          <p className="mt-1 text-sm text-muted">
            {selectedRoute.name} &middot; {selectedRoute.vehicle}
          </p>
        </div>
        {routes && routes.length > 1 && phase !== 'collecting' && (
          <select
            aria-label="Choose route"
            value={selectedRoute.routeId}
            onChange={(event) => handleSelectRoute(event.target.value)}
            className="rounded-lg border border-ink/10 bg-surface px-3 py-2 text-sm text-ink focus:border-primary focus:outline-none"
          >
            {routes.map((route) => (
              <option key={route.routeId} value={route.routeId}>
                {route.name}
              </option>
            ))}
          </select>
        )}
      </header>

      <div className="mt-8 grid gap-8 lg:grid-cols-[360px_1fr]">
        <div>
          {phase === 'plan' && (
            <RouteSummaryPanel
              summary={summary}
              onOptimize={handleOptimize}
              isOptimizing={isOptimizing}
              error={optimizeError}
            />
          )}

          {phase === 'ready' && orderedStops && (
            <RouteResultPanel
              route={selectedRoute}
              stopCount={orderedStops.length}
              onStart={() => setStartedRouteIds((ids) => [...ids, selectedRoute.routeId])}
            />
          )}

          {phase === 'collecting' && orderedStops && (
            <>
              <NextStopPanel
                nextStop={nextStop}
                stopNumber={nextStopIndex + 1}
                totalStops={orderedStops.length}
                collectedCount={orderedCollected}
                distanceAwayKm={distanceAwayKm}
                onMarkCollected={handleMarkCollected}
              />
              <div className="mt-8">
                <RouteStopList stops={orderedStops} nextStopId={nextStop?.id ?? null} />
              </div>
              {nextStop && (
                <button
                  type="button"
                  onClick={handleOptimize}
                  disabled={isOptimizing}
                  className="mt-4 text-sm font-medium text-muted underline-offset-2 hover:text-ink hover:underline disabled:opacity-50"
                >
                  {isOptimizing ? 'Recalculating…' : 'Recalculate remaining route'}
                </button>
              )}
              {optimizeError && <p className="mt-2 text-sm text-[#D97706]">{optimizeError}</p>}
            </>
          )}
        </div>

        <div className="relative h-[420px] overflow-hidden rounded-card border border-ink/10 lg:h-auto lg:min-h-[560px]">
          <MapView>
            {routePoints.map((point) => (
              <CollectionPointMarker
                key={point.id}
                point={point}
                simple
                orderLabel={point.status === 'pending' ? orderIndex.get(point.id) : undefined}
              />
            ))}
            <DepotMarker depot={selectedRoute.depot} />
            {orderedStops && showOriginal && <RouteLayer route={selectedRoute} variant="original" />}
            {orderedStops && <RouteLayer route={selectedRoute} variant="optimized" />}
          </MapView>
          {orderedStops && (
            <button
              type="button"
              onClick={() => setShowOriginal((show) => !show)}
              className="absolute right-3 top-3 z-[400] rounded-lg bg-surface/95 px-3 py-1.5 text-xs font-medium text-ink shadow hover:text-primary-dark"
            >
              {showOriginal ? 'Hide Original Route' : 'Show Original Route'}
            </button>
          )}
          <RouteLegend showOriginal={Boolean(orderedStops) && showOriginal} />
        </div>
      </div>
    </PageContainer>
  )
}
