import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  MapPin,
  AlertTriangle,
  CircleSlash2,
  MessageSquarePlus,
  CheckCircle2,
  Truck,
  Clock,
  ArrowRight,
} from 'lucide-react'
import { Card } from '../../components/common/Card'
import { Button } from '../../components/common/Button'
import { StatCard } from '../../components/common/StatCard'
import { StatusBadge } from '../../components/common/StatusBadge'
import { CollectionProgressBar } from '../../components/routes/CollectionProgressBar'
import { PendingReportCard } from '../../components/reports/PendingReportCard'
import { ReportReviewModal } from '../../components/reports/ReportReviewModal'
import { PageContainer } from '../../components/layout/PageContainer'
import { MapView } from '../../components/map/MapView'
import { CollectionPointMarker } from '../../components/map/CollectionPointMarker'
import { DepotMarker } from '../../components/map/DepotMarker'
import { RouteLayer } from '../../components/map/RouteLayer'
import { PointStatusLegend } from '../../components/map/PointStatusLegend'
import { useAsyncData } from '../../hooks/useAsyncData'
import {
  getCollectionPoints,
  getCurrentRoute,
  getDashboardStats,
  getRecentActivity,
  getCitizenReports,
  approveReport,
  rejectReport,
} from '../../services/api'
import { formatDateTime } from '../../utils/format'
import type { CitizenReport, CollectionPoint, CollectionRoute, DashboardStats } from '../../types'

const TODAY_LABEL = new Date().toLocaleDateString('en-IN', {
  weekday: 'long',
  day: 'numeric',
  month: 'long',
})

export function Dashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [points, setPoints] = useState<CollectionPoint[] | null>(null)
  const [route, setRoute] = useState<CollectionRoute | null>(null)
  const [reports, setReports] = useState<CitizenReport[] | null>(null)
  const [reviewingReport, setReviewingReport] = useState<CitizenReport | null>(null)
  const { data: activity } = useAsyncData(getRecentActivity)

  async function refresh() {
    const [nextStats, nextPoints, nextRoute, nextReports] = await Promise.all([
      getDashboardStats(),
      getCollectionPoints(),
      getCurrentRoute(),
      getCitizenReports(),
    ])
    setStats(nextStats)
    setPoints(nextPoints)
    setRoute(nextRoute)
    setReports(nextReports)
  }

  useEffect(() => {
    refresh()
  }, [])

  async function handleApprove(reportId: string) {
    await approveReport(reportId)
    await refresh()
  }

  async function handleReject(reportId: string) {
    await rejectReport(reportId)
    await refresh()
  }

  const activePoints = points?.filter((point) => point.status === 'pending').slice(0, 5) ?? []
  const completedStops = route?.originalStops.filter((point) => point.status === 'collected').length ?? 0
  const pendingReports = reports?.filter((report) => report.status === 'pending_verification') ?? []

  return (
    <PageContainer className="max-w-7xl">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-semibold text-ink">Operations dashboard</h1>
          <p className="mt-1 max-w-lg text-sm text-muted">
            Monitor today&rsquo;s collection network and optimize where your vehicles actually
            need to go.
          </p>
        </div>
        <div className="flex flex-col items-end gap-2">
          <span className="text-xs text-muted">{TODAY_LABEL}</span>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary-dark">
            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
            Route active
          </span>
        </div>
      </header>

      {stats && (
        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          <StatCard icon={MapPin} label="On route today" value={stats.pointsOnRouteToday} accentColor="#1E1E1E" />
          <StatCard
            icon={AlertTriangle}
            label="Requiring collection"
            value={stats.requiringCollection}
            accentColor="#D97706"
          />
          <StatCard icon={CircleSlash2} label="Skipped" value={stats.skipped} accentColor="#9CA3AF" />
          <StatCard
            icon={MessageSquarePlus}
            label="Citizen-added"
            value={stats.citizenAdded}
            accentColor="#7C3AED"
          />
          <StatCard icon={CheckCircle2} label="Collected" value={stats.collectedToday} accentColor="#1E7A4C" />
        </div>
      )}

      <div className="mt-8 grid gap-6 lg:grid-cols-[1.6fr_1fr]">
        <Card className="relative h-[420px] overflow-hidden lg:h-[480px]">
          <MapView>
            {points?.map((point) => (
              <CollectionPointMarker key={point.id} point={point} />
            ))}
            {route && <DepotMarker depot={route.depot} />}
            {route && <RouteLayer route={route} variant="original" />}
          </MapView>
          <PointStatusLegend />
        </Card>

        <Card className="p-5">
          <h2 className="font-display text-lg font-semibold text-ink">Current collection</h2>
          {route ? (
            <div className="mt-4 space-y-4">
              <div>
                <p className="font-medium text-ink">{route.name}</p>
                <p className="text-xs text-muted">{route.routeId}</p>
              </div>

              <dl className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <dt className="flex items-center gap-1.5 text-muted">
                    <Truck size={14} />
                    Vehicle
                  </dt>
                  <dd className="text-ink">{route.vehicle}</dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt className="text-muted">Depot</dt>
                  <dd className="text-ink">{route.depot.name}</dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt className="text-muted">Scheduled points</dt>
                  <dd className="text-ink">{route.originalStops.length}</dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt className="text-muted">Required stops</dt>
                  <dd className="text-ink">{route.activeStops.length}</dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt className="text-muted">Completed stops</dt>
                  <dd className="text-ink">{completedStops}</dd>
                </div>
              </dl>

              <CollectionProgressBar progress={route.collectionProgress} label="Collection progress" />

              <Link to="/routes">
                <Button className="w-full justify-center">
                  View &amp; optimize route
                  <ArrowRight size={15} />
                </Button>
              </Link>
            </div>
          ) : (
            <p className="mt-4 text-sm text-muted">Loading current route&hellip;</p>
          )}
        </Card>
      </div>

      <section className="mt-8">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-lg font-semibold text-ink">
            Citizen reports awaiting verification
          </h2>
          {pendingReports.length > 0 && (
            <span className="rounded-full bg-[#D97706]/10 px-2.5 py-1 text-xs font-medium text-[#D97706]">
              {pendingReports.length} pending
            </span>
          )}
        </div>
        <div className="mt-3 space-y-2">
          {pendingReports.length === 0 ? (
            <Card className="p-5 text-sm text-muted">No reports waiting on review right now.</Card>
          ) : (
            pendingReports.map((report) => (
              <PendingReportCard key={report.id} report={report} onReview={setReviewingReport} />
            ))
          )}
        </div>
      </section>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <section>
          <div className="flex items-center justify-between">
            <h2 className="font-display text-lg font-semibold text-ink">Active collection points</h2>
            <Link to="/map" className="text-sm font-medium text-primary-dark hover:underline">
              View all on map
            </Link>
          </div>
          <div className="mt-3 space-y-2">
            {activePoints.length === 0 ? (
              <Card className="p-5 text-sm text-muted">No points currently need collection.</Card>
            ) : (
              activePoints.map((point) => (
                <Card key={point.id} className="flex items-center justify-between gap-3 p-3.5">
                  <div>
                    <p className="text-sm font-medium text-ink">{point.address}</p>
                    <p className="text-xs text-muted">
                      {point.source === 'citizen' ? 'Citizen report' : `Route ${point.existingRouteId}`}
                    </p>
                  </div>
                  <StatusBadge status={point.status} citizenReported={point.source === 'citizen'} />
                </Card>
              ))
            )}
          </div>
        </section>

        <section>
          <h2 className="font-display text-lg font-semibold text-ink">Recent activity</h2>
          <div className="mt-3 space-y-2">
            {activity?.map((event) => (
              <Card key={event.id} className="flex items-start gap-3 p-3.5">
                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary-dark">
                  <Clock size={13} />
                </span>
                <div>
                  <p className="text-sm text-ink">{event.message}</p>
                  <p className="mt-0.5 text-xs text-muted">{formatDateTime(event.timestamp)}</p>
                </div>
              </Card>
            ))}
          </div>
        </section>
      </div>

      {reviewingReport && (
        <ReportReviewModal
          report={reviewingReport}
          onApprove={handleApprove}
          onReject={handleReject}
          onClose={() => setReviewingReport(null)}
        />
      )}
    </PageContainer>
  )
}
