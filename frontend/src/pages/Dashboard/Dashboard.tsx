import { Link } from 'react-router-dom'
import { Card } from '../../components/common/Card'
import { StatusBadge } from '../../components/common/StatusBadge'
import { CollectionProgressBar } from '../../components/routes/CollectionProgressBar'
import { PageContainer } from '../../components/layout/PageContainer'
import { useAsyncData } from '../../hooks/useAsyncData'
import { getCollectionRoutes, getCitizenReports, getDashboardStats } from '../../services/api'
import { formatDateTime } from '../../utils/format'

export function Dashboard() {
  const { data: stats } = useAsyncData(getDashboardStats)
  const { data: routes } = useAsyncData(getCollectionRoutes)
  const { data: reports } = useAsyncData(getCitizenReports)

  return (
    <PageContainer>
      <header>
        <h1 className="font-display text-2xl font-semibold text-ink">Operations dashboard</h1>
        <p className="mt-1 text-sm text-muted">The operational home base for today&rsquo;s collection run.</p>
      </header>

      {stats && (
        <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-5">
          <Card className="p-5">
            <p className="text-xs text-muted">On route today</p>
            <p className="mt-2 font-display text-3xl font-semibold text-ink">{stats.pointsOnRouteToday}</p>
          </Card>
          <Card className="p-5">
            <p className="text-xs text-muted">Requiring collection</p>
            <p className="mt-2 font-display text-3xl font-semibold text-[#D97706]">
              {stats.requiringCollection}
            </p>
          </Card>
          <Card className="p-5">
            <p className="text-xs text-muted">Skipped</p>
            <p className="mt-2 font-display text-3xl font-semibold text-[#9CA3AF]">{stats.skipped}</p>
          </Card>
          <Card className="p-5">
            <p className="text-xs text-muted">Citizen-added</p>
            <p className="mt-2 font-display text-3xl font-semibold text-[#7C3AED]">
              {stats.citizenAdded}
            </p>
          </Card>
          <Card className="p-5">
            <p className="text-xs text-muted">Collected</p>
            <p className="mt-2 font-display text-3xl font-semibold text-primary">
              {stats.collectedToday}
            </p>
          </Card>
        </div>
      )}

      <div className="mt-10 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <section>
          <div className="flex items-center justify-between">
            <h2 className="font-display text-lg font-semibold text-ink">Active routes</h2>
            <Link to="/routes" className="text-sm font-medium text-primary-dark hover:underline">
              View all
            </Link>
          </div>
          <div className="mt-3 space-y-3">
            {routes?.map((route) => (
              <Card key={route.routeId} className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-ink">{route.name}</p>
                    <p className="text-xs text-muted">
                      {route.activeStops.length} of {route.originalStops.length} stops active
                    </p>
                  </div>
                </div>
                <div className="mt-3">
                  <CollectionProgressBar progress={route.collectionProgress} />
                </div>
              </Card>
            ))}
          </div>
        </section>

        <section>
          <div className="flex items-center justify-between">
            <h2 className="font-display text-lg font-semibold text-ink">Citizen reports</h2>
            <Link to="/my-reports" className="text-sm font-medium text-primary-dark hover:underline">
              View all
            </Link>
          </div>
          <div className="mt-3 space-y-3">
            {reports?.map((report) => (
              <Card key={report.id} className="p-4">
                <div className="flex items-start justify-between gap-2">
                  <p className="text-sm font-medium text-ink">{report.category}</p>
                  <StatusBadge reportStatus={report.status} />
                </div>
                <p className="mt-1 text-xs text-muted">{formatDateTime(report.reportedAt)}</p>
              </Card>
            ))}
          </div>
        </section>
      </div>
    </PageContainer>
  )
}
