import { useEffect, useMemo, useState } from 'react'
import { Card } from '../../components/common/Card'
import { PageContainer } from '../../components/layout/PageContainer'
import { MapView } from '../../components/map/MapView'
import { CollectionPointMarker } from '../../components/map/CollectionPointMarker'
import { DepotMarker } from '../../components/map/DepotMarker'
import { RouteLayer } from '../../components/map/RouteLayer'
import { PointStatusLegend } from '../../components/map/PointStatusLegend'
import { PointDetailPanel } from '../../components/map/PointDetailPanel'
import { RouteControls } from '../../components/routes/RouteControls'
import { ActiveCollectionSet } from '../../components/routes/ActiveCollectionSet'
import { RouteComparisonView } from '../../components/routes/RouteComparisonView'
import { CollectionProgressBar } from '../../components/routes/CollectionProgressBar'
import { RouteStopList } from '../../components/routes/RouteStopList'
import { getCollectionRoutes, getCitizenReports, optimizeRoute } from '../../services/api'
import { formatPercent } from '../../utils/format'
import type { CitizenReport, CollectionPoint, CollectionRoute } from '../../types'

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
  const [reports, setReports] = useState<CitizenReport[] | null>(null)
  const [selectedRouteId, setSelectedRouteId] = useState<string | null>(null)
  const [selectedPointId, setSelectedPointId] = useState<string | null>(null)
  const [isOptimizing, setIsOptimizing] = useState(false)

  useEffect(() => {
    getCollectionRoutes().then((data) => {
      setRoutes(data)
      const current = data.reduce((furthest, route) =>
        route.collectionProgress > furthest.collectionProgress ? route : furthest,
      )
      setSelectedRouteId(current.routeId)
    })
    getCitizenReports().then(setReports)
  }, [])

  const selectedRoute = routes?.find((route) => route.routeId === selectedRouteId) ?? null

  const routePoints = useMemo(() => {
    if (!selectedRoute) return []
    const citizenExtras = selectedRoute.activeStops.filter((point) => point.source === 'citizen')
    return [...selectedRoute.originalStops, ...citizenExtras]
  }, [selectedRoute])

  const orderIndex = useMemo(() => {
    const map = new Map<string, number>()
    selectedRoute?.optimizedStops?.forEach((point, index) => map.set(point.id, index + 1))
    return map
  }, [selectedRoute])

  const remainingActiveStops = useMemo(
    () => selectedRoute?.activeStops.filter((point) => point.status !== 'collected') ?? [],
    [selectedRoute],
  )

  const reportById = useMemo(() => new Map(reports?.map((report) => [report.id, report]) ?? []), [reports])

  const selectedPoint = routePoints.find((point) => point.id === selectedPointId) ?? null
  const selectedReport =
    selectedPoint?.source === 'citizen' && selectedPoint.linkedReportId
      ? reportById.get(selectedPoint.linkedReportId) ?? null
      : null

  async function handleOptimize() {
    if (!selectedRoute) return
    setIsOptimizing(true)
    const result = await optimizeRoute(selectedRoute, remainingActiveStops)
    setRoutes(
      (prev) =>
        prev?.map((route) =>
          route.routeId === selectedRoute.routeId
            ? {
                ...route,
                optimizedStops: result.optimizedStops,
                totalDistance: result.totalDistance,
                estimatedTime: result.estimatedTime,
                distanceSaved: result.distanceSaved,
                timeSaved: result.timeSaved,
                generatedAt: result.generatedAt,
              }
            : route,
        ) ?? prev,
    )
    setIsOptimizing(false)
  }

  function handleMarkCollected(pointId: string) {
    if (!selectedRoute) return
    setRoutes(
      (prev) =>
        prev?.map((route) => (route.routeId === selectedRoute.routeId ? markCollected(route, pointId) : route)) ??
        prev,
    )
  }

  if (!selectedRoute) {
    return (
      <PageContainer className="max-w-full">
        <p className="text-sm text-muted">Loading routes&hellip;</p>
      </PageContainer>
    )
  }

  const skippedCount = selectedRoute.originalStops.filter((point) => !point.requiresCollection).length
  const collectedCount = selectedRoute.activeStops.filter((point) => point.status === 'collected').length
  const displayedStops = selectedRoute.optimizedStops ?? []

  // Counts reflect what would actually be sent to the optimizer right now —
  // stops already marked collected drop out of "remaining to optimize".
  const remainingRoutePoints = remainingActiveStops.filter((point) => point.source === 'route').length
  const remainingCitizenPoints = remainingActiveStops.filter((point) => point.source === 'citizen').length

  const collectionProgress =
    selectedRoute.activeStops.length === 0 ? 1 : collectedCount / selectedRoute.activeStops.length

  return (
    <PageContainer className="max-w-full">
      <header>
        <h1 className="font-display text-2xl font-semibold text-ink">Route optimization</h1>
        <p className="mt-1 max-w-2xl text-sm text-muted">
          Skip what doesn&rsquo;t need a visit today, fold in verified citizen points, and send the
          active set to the optimizer.
        </p>
      </header>

      <div className="mt-6 grid gap-6 lg:grid-cols-[380px_1fr]">
        <div className="space-y-4">
          <RouteControls
            routes={routes ?? [selectedRoute]}
            selectedRoute={selectedRoute}
            onSelectRoute={(routeId) => {
              setSelectedRouteId(routeId)
              setSelectedPointId(null)
            }}
            onOptimize={handleOptimize}
            isOptimizing={isOptimizing}
            remainingActiveCount={remainingActiveStops.length}
          />

          <ActiveCollectionSet
            routePointCount={remainingRoutePoints}
            citizenPointCount={remainingCitizenPoints}
            skippedCount={skippedCount}
            collectedCount={collectedCount}
          />

          <RouteComparisonView route={selectedRoute} />

          {selectedRoute.optimizedStops && (
            <Card className="p-5">
              <h2 className="font-display text-base font-semibold text-ink">Collection progress</h2>
              <div className="mt-1 flex items-baseline justify-between">
                <p className="text-sm text-muted">
                  {collectedCount} / {selectedRoute.activeStops.length} stops collected
                </p>
                <p className="font-display text-sm font-semibold text-primary-dark">
                  {formatPercent(collectionProgress)}
                </p>
              </div>
              <div className="mt-3">
                <CollectionProgressBar progress={collectionProgress} />
              </div>
            </Card>
          )}

          {selectedRoute.optimizedStops && (
            <Card className="p-5">
              <h2 className="font-display text-base font-semibold text-ink">Ordered stops</h2>
              <div className="mt-3">
                <RouteStopList
                  depotName={selectedRoute.depot.name}
                  stops={displayedStops}
                  onMarkCollected={handleMarkCollected}
                />
              </div>
            </Card>
          )}
        </div>

        <div className="relative h-[420px] overflow-hidden rounded-card border border-ink/10 lg:h-auto lg:min-h-[640px]">
          <MapView>
            {routePoints.map((point) => (
              <CollectionPointMarker
                key={point.id}
                point={point}
                onSelect={(p) => setSelectedPointId(p.id)}
                orderLabel={point.status !== 'collected' ? orderIndex.get(point.id) : undefined}
              />
            ))}
            <DepotMarker depot={selectedRoute.depot} />
            <RouteLayer route={selectedRoute} variant="original" />
            {selectedRoute.optimizedStops && <RouteLayer route={selectedRoute} variant="optimized" />}
          </MapView>
          <PointStatusLegend showOptimized={Boolean(selectedRoute.optimizedStops)} />
          {selectedPoint && (
            <PointDetailPanel
              point={selectedPoint}
              report={selectedReport}
              onClose={() => setSelectedPointId(null)}
            />
          )}
        </div>
      </div>
    </PageContainer>
  )
}
