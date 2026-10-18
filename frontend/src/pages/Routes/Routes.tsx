import { useEffect, useMemo, useState } from 'react'
import { PageContainer } from '../../components/layout/PageContainer'
import { MapView } from '../../components/map/MapView'
import { CollectionPointMarker } from '../../components/map/CollectionPointMarker'
import { FitBounds } from '../../components/map/FitBounds'
import { DepotMarker } from '../../components/map/DepotMarker'
import { RouteLayer } from '../../components/map/RouteLayer'
import { RouteLegend } from '../../components/routes/RouteLegend'
import { RouteStatStrip } from '../../components/routes/RouteStatStrip'
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
        <p className="text-sm font-semibold text-muted">Loading today&rsquo;s route&hellip;</p>
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
    <PageContainer className="max-w-7xl">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-3xl font-extrabold text-ink">Today&rsquo;s Route</h1>
          <p className="mt-1 text-sm font-semibold text-muted">
            {phase === 'collecting'
              ? `${selectedRoute.name} · ${selectedRoute.vehicle}`
              : 'Select and optimize the best route for collection.'}
          </p>
        </div>
        {routes && routes.length > 1 && phase !== 'collecting' && (
          <select
            aria-label="Choose route"
            value={selectedRoute.routeId}
            onChange={(event) => handleSelectRoute(event.target.value)}
            className="rounded-2xl border border-line bg-surface px-4 py-2.5 text-sm font-bold text-ink shadow-card focus:border-primary focus:outline-none"
          >
            {routes.map((route) => (
              <option key={route.routeId} value={route.routeId}>
                {route.name}
              </option>
            ))}
          </select>
        )}
      </header>

      <div className="mt-5 grid gap-5 lg:grid-cols-[minmax(0,1fr)_23rem] lg:items-start">
        <div>
          {phase !== 'collecting' && (
            <div className="mb-4">
              <RouteStatStrip summary={summary} />
            </div>
          )}

          <div className="relative isolate h-[26rem] overflow-hidden rounded-card border border-line/70 shadow-card sm:h-[32rem] lg:h-[calc(100svh-17rem)] lg:min-h-[32rem]">
            <MapView>
              <FitBounds
                fitKey={selectedRoute.routeId}
                points={[
                  [selectedRoute.depot.latitude, selectedRoute.depot.longitude],
                  ...routePoints.map((point): [number, number] => [point.latitude, point.longitude]),
                ]}
              />
              {routePoints.map((point) => (
                <CollectionPointMarker
                  key={point.id}
                  point={point}
                  simple
                  orderLabel={point.status === 'pending' ? orderIndex.get(point.id) : undefined}
                  highlight={phase === 'collecting' && point.id === nextStop?.id}
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
                aria-pressed={showOriginal}
                className="tm-press absolute right-3 top-3 z-[400] rounded-full bg-surface px-3.5 py-2 text-xs font-bold text-primary-dark shadow-card hover:bg-sage-soft"
              >
                {showOriginal ? 'Hide Original Route' : 'Show Original Route'}
              </button>
            )}
          </div>
          <RouteLegend showOriginal={Boolean(orderedStops) && showOriginal} />
        </div>

        <div className="space-y-5">
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
              <RouteStopList stops={orderedStops} nextStopId={nextStop?.id ?? null} />
              {nextStop && (
                <button
                  type="button"
                  onClick={handleOptimize}
                  disabled={isOptimizing}
                  className="w-full rounded-2xl py-2 text-sm font-bold text-muted transition-colors hover:bg-ink/5 hover:text-ink disabled:opacity-50"
                >
                  {isOptimizing ? 'Recalculating…' : 'Recalculate remaining route'}
                </button>
              )}
              {optimizeError && <p className="text-sm font-semibold text-[#b9731d]">{optimizeError}</p>}
            </>
          )}
        </div>
      </div>
    </PageContainer>
  )
}
