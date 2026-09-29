import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { Button } from '../../components/common/Button'
import { CollectionProgressBar } from '../../components/routes/CollectionProgressBar'
import { PageContainer } from '../../components/layout/PageContainer'
import { getCurrentRoute, getCitizenReports } from '../../services/api'
import { summarizeRoute } from '../../utils/routeSummary'
import type { CitizenReport, CollectionRoute } from '../../types'

const TODAY_LABEL = new Date().toLocaleDateString('en-IN', {
  weekday: 'long',
  day: 'numeric',
  month: 'long',
})

export function Dashboard() {
  const [route, setRoute] = useState<CollectionRoute | null>(null)
  const [reports, setReports] = useState<CitizenReport[] | null>(null)

  useEffect(() => {
    getCurrentRoute().then(setRoute)
    getCitizenReports().then(setReports)
  }, [])

  const pendingCount = reports?.filter((report) => report.status === 'pending_verification').length ?? 0
  const summary = route ? summarizeRoute(route) : null

  const numbers = summary
    ? [
        { value: summary.normalStops, label: 'Normal Stops', accent: 'text-ink' },
        { value: summary.needCollection, label: 'Need Collection', accent: 'text-primary-dark' },
        { value: summary.skipped, label: 'Skipped', accent: 'text-muted' },
        { value: summary.citizenAdded, label: 'Citizen Added', accent: 'text-[color:var(--color-status-citizen)]' },
      ]
    : []

  return (
    <PageContainer className="max-w-3xl">
      <section>
        <p className="text-xs font-semibold tracking-wider text-muted">TODAY&rsquo;S COLLECTION</p>
        <p className="mt-1 text-sm text-muted">{TODAY_LABEL}</p>

        {route && summary ? (
          <>
            <dl className="mt-6 grid gap-4 text-sm sm:grid-cols-2">
              <div>
                <dt className="text-muted">Vehicle</dt>
                <dd className="mt-0.5 text-base font-medium text-ink">{route.vehicle}</dd>
              </div>
              <div>
                <dt className="text-muted">Route</dt>
                <dd className="mt-0.5 text-base font-medium text-ink">{route.name}</dd>
              </div>
            </dl>

            <div className="mt-6">
              <div className="mb-1.5 flex items-baseline justify-between text-sm">
                <span className="text-muted">Collection progress</span>
                <span className="font-display text-lg font-semibold text-ink">
                  {summary.collected} of {summary.totalToCollect} collected
                </span>
              </div>
              <CollectionProgressBar progress={summary.progress} />
            </div>

            <div className="mt-10 grid grid-cols-2 gap-x-6 gap-y-8 sm:grid-cols-4">
              {numbers.map((item) => (
                <div key={item.label}>
                  <p className={`font-display text-5xl font-semibold ${item.accent}`}>{item.value}</p>
                  <p className="mt-1 text-sm text-muted">{item.label}</p>
                </div>
              ))}
            </div>

            <Link to="/routes" className="mt-10 block">
              <Button className="w-full justify-center py-3.5 text-base">
                View Today&rsquo;s Route
                <ArrowRight size={17} />
              </Button>
            </Link>
          </>
        ) : (
          <p className="mt-6 text-sm text-muted">Loading today&rsquo;s collection&hellip;</p>
        )}
      </section>

      <section className="mt-12 flex flex-wrap items-center justify-between gap-4 border-t border-ink/[0.08] pt-8">
        <div>
          <h2 className="font-display text-lg font-semibold text-ink">Citizen Reports Awaiting Verification</h2>
          <p className="mt-1 text-sm text-muted">
            {pendingCount === 0
              ? 'Nothing waiting for review.'
              : `${pendingCount} ${pendingCount === 1 ? 'report' : 'reports'} to review.`}
          </p>
        </div>
        <Link to="/citizen-reports">
          <Button variant="secondary">Review Reports</Button>
        </Link>
      </section>
    </PageContainer>
  )
}
