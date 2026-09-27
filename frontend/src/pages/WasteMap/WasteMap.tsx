import { useMemo, useState } from 'react'
import { ListChecks } from 'lucide-react'
import { PageContainer } from '../../components/layout/PageContainer'
import { Card } from '../../components/common/Card'
import { MapView } from '../../components/map/MapView'
import { CollectionPointMarker } from '../../components/map/CollectionPointMarker'
import { DepotMarker } from '../../components/map/DepotMarker'
import { RouteLayer } from '../../components/map/RouteLayer'
import { PointStatusLegend } from '../../components/map/PointStatusLegend'
import { PointDetailPanel } from '../../components/map/PointDetailPanel'
import { FilterBar } from '../../components/map/FilterBar'
import { EMPTY_FILTERS, type PointFilters } from '../../components/map/pointFilters'
import { useAsyncData } from '../../hooks/useAsyncData'
import {
  getCollectionPoints,
  getCitizenReports,
  getCollectionRoutes,
  getDashboardStats,
} from '../../services/api'
import type { CollectionPoint, ReportSeverity } from '../../types'

function matchesFilters(
  point: CollectionPoint,
  filters: PointFilters,
  severityByReportId: Map<string, ReportSeverity>,
): boolean {
  if (filters.sources.length > 0 && !filters.sources.includes(point.source)) return false
  if (filters.statuses.length > 0 && !filters.statuses.includes(point.status)) return false

  if (filters.severities.length > 0 && point.source === 'citizen') {
    const severity = point.linkedReportId ? severityByReportId.get(point.linkedReportId) : undefined
    if (!severity || !filters.severities.includes(severity)) return false
  }

  return true
}

export function WasteMap() {
  const { data: points } = useAsyncData(getCollectionPoints)
  const { data: reports } = useAsyncData(getCitizenReports)
  const { data: routes } = useAsyncData(getCollectionRoutes)
  const { data: stats } = useAsyncData(getDashboardStats)

  const [filters, setFilters] = useState<PointFilters>(EMPTY_FILTERS)
  const [selectedPointId, setSelectedPointId] = useState<string | null>(null)

  const reportById = useMemo(() => new Map(reports?.map((report) => [report.id, report]) ?? []), [reports])
  const severityByReportId = useMemo(
    () => new Map(reports?.map((report) => [report.id, report.severity]) ?? []),
    [reports],
  )

  const filteredPoints = useMemo(
    () => points?.filter((point) => matchesFilters(point, filters, severityByReportId)) ?? [],
    [points, filters, severityByReportId],
  )

  const showRouteLines = filters.sources.length === 0 || filters.sources.includes('route')
  const activeSetCount = points?.filter((point) => point.requiresCollection).length ?? 0

  const selectedPoint = points?.find((point) => point.id === selectedPointId) ?? null
  const selectedReport =
    selectedPoint?.source === 'citizen' && selectedPoint.linkedReportId
      ? reportById.get(selectedPoint.linkedReportId) ?? null
      : null

  return (
    <PageContainer className="max-w-full">
      <header className="mb-4">
        <h1 className="font-display text-2xl font-semibold text-ink">Waste map</h1>
        <p className="mt-1 text-sm text-muted">
          Every predefined and citizen-reported point across today&rsquo;s network, plotted by
          status.
        </p>
      </header>

      <FilterBar filters={filters} onChange={setFilters} />

      <div className="relative mt-4 h-[calc(100svh-22rem)] min-h-[420px] overflow-hidden rounded-card border border-ink/10">
        <MapView>
          {filteredPoints.map((point) => (
            <CollectionPointMarker key={point.id} point={point} onSelect={(p) => setSelectedPointId(p.id)} />
          ))}
          {routes?.map((route) => <DepotMarker key={route.routeId} depot={route.depot} />)}
          {showRouteLines &&
            routes?.map((route) => <RouteLayer key={route.routeId} route={route} variant="original" />)}
        </MapView>
        <PointStatusLegend />
        {selectedPoint && (
          <PointDetailPanel
            point={selectedPoint}
            report={selectedReport}
            onClose={() => setSelectedPointId(null)}
          />
        )}
      </div>

      {stats && (
        <Card className="mt-4 flex flex-wrap items-center gap-x-8 gap-y-3 px-5 py-3.5">
          <div>
            <span className="font-display text-lg font-semibold text-ink">{stats.pointsOnRouteToday}</span>
            <span className="ml-1.5 text-xs text-muted">total points</span>
          </div>
          <div>
            <span className="font-display text-lg font-semibold text-[#D97706]">
              {stats.requiringCollection}
            </span>
            <span className="ml-1.5 text-xs text-muted">requiring collection</span>
          </div>
          <div>
            <span className="font-display text-lg font-semibold text-[#9CA3AF]">{stats.skipped}</span>
            <span className="ml-1.5 text-xs text-muted">skipped</span>
          </div>
          <div>
            <span className="font-display text-lg font-semibold text-[#7C3AED]">{stats.citizenAdded}</span>
            <span className="ml-1.5 text-xs text-muted">citizen-added</span>
          </div>
          <div>
            <span className="font-display text-lg font-semibold text-primary">{stats.collectedToday}</span>
            <span className="ml-1.5 text-xs text-muted">collected</span>
          </div>

          <div className="ml-auto flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary-dark">
            <ListChecks size={14} />
            {activeSetCount} active collection points
          </div>
        </Card>
      )}
    </PageContainer>
  )
}
