import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, ClipboardCheck, Leaf } from 'lucide-react'
import { Button } from '../../components/common/Button'
import { Card } from '../../components/common/Card'
import { StatCard } from '../../components/common/StatCard'
import { Cypress, GarbageTruck, Shrub, Tree } from '../../components/illustrations'
import { CollectionProgressBar } from '../../components/routes/CollectionProgressBar'
import { PageContainer } from '../../components/layout/PageContainer'
import { getCurrentRoute, getCitizenReports } from '../../services/api'
import { summarizeRoute } from '../../utils/routeSummary'
import type { CitizenReport, CollectionRoute } from '../../types'

const NOW = new Date()
const TODAY_LABEL = NOW.toLocaleDateString('en-GB', {
  weekday: 'short',
  day: 'numeric',
  month: 'short',
  year: 'numeric',
})

function greeting(): string {
  const hour = NOW.getHours()
  if (hour < 12) return 'Good Morning!'
  if (hour < 17) return 'Good Afternoon!'
  return 'Good Evening!'
}

export function Dashboard() {
  const [route, setRoute] = useState<CollectionRoute | null>(null)
  const [reports, setReports] = useState<CitizenReport[] | null>(null)

  useEffect(() => {
    getCurrentRoute().then(setRoute)
    getCitizenReports().then(setReports)
  }, [])

  const pendingCount = reports?.filter((report) => report.status === 'pending_verification').length ?? 0
  const summary = route ? summarizeRoute(route) : null

  return (
    <PageContainer className="max-w-4xl">
      <header className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-ink">{greeting()}</h1>
          <p className="mt-1 text-sm font-semibold text-muted">Here&rsquo;s today&rsquo;s collection overview.</p>
        </div>
        <span className="shrink-0 rounded-2xl bg-surface px-3.5 py-2 text-xs font-bold text-muted shadow-card">
          {TODAY_LABEL}
        </span>
      </header>

      {route && summary ? (
        <>
          <section
            className="tm-rise relative mt-7 overflow-hidden rounded-[1.75rem] bg-primary px-6 py-7 text-white shadow-lift sm:px-8"
            style={{ animationDelay: '0.05s' }}
          >
            {/* Soft decorative leaves */}
            <svg
              className="pointer-events-none absolute -right-8 -top-10 h-56 w-56 opacity-[0.12]"
              viewBox="0 0 100 100"
              aria-hidden="true"
            >
              <path d="M90 10C45 10 15 35 15 70c0 8 2 15 5 20 30 0 70-20 70-80Z" fill="#fff" />
            </svg>

            <div className="relative grid items-center gap-5 sm:grid-cols-[1fr_minmax(0,16rem)]">
              <div>
                <h2 className="text-xl font-extrabold">Today&rsquo;s Collection</h2>
                <dl className="mt-4 space-y-1.5 text-sm">
                  <div className="flex gap-4">
                    <dt className="w-16 font-semibold text-white/70">Route</dt>
                    <dd className="font-bold">{route.name}</dd>
                  </div>
                  <div className="flex gap-4">
                    <dt className="w-16 font-semibold text-white/70">Vehicle</dt>
                    <dd className="font-bold">{route.vehicle}</dd>
                  </div>
                </dl>

                <div className="mt-5 max-w-xs">
                  <CollectionProgressBar
                    tone="onDark"
                    progress={summary.progress}
                    label={`${summary.collected} of ${summary.totalToCollect} collected`}
                  />
                </div>

                <Link to="/routes" className="mt-6 inline-block">
                  <Button variant="light" className="px-6 py-3.5 text-[15px]">
                    View Today&rsquo;s Route
                    <ArrowRight size={17} />
                  </Button>
                </Link>
              </div>

              <div className="hidden sm:block">
                <GarbageTruck />
              </div>
            </div>
          </section>

          <section className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
            {[
              { value: summary.normalStops, label: 'Normal Stops', tone: 'sky' as const },
              { value: summary.needCollection, label: 'Need Collection', tone: 'sage' as const },
              { value: summary.skipped, label: 'Skipped', tone: 'stone' as const },
              { value: summary.citizenAdded, label: 'Citizen Added', tone: 'peach' as const },
            ].map((item, index) => (
              <div key={item.label} className="tm-rise" style={{ animationDelay: `${0.1 + index * 0.06}s` }}>
                <StatCard label={item.label} value={item.value} tone={item.tone} />
              </div>
            ))}
          </section>
        </>
      ) : (
        <p className="mt-8 text-sm font-semibold text-muted">Loading today&rsquo;s collection&hellip;</p>
      )}

      <Card className="tm-rise mt-5 flex flex-wrap items-center gap-4 p-5" style={{ animationDelay: '0.3s' }}>
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-tint-peach text-status-citizen">
          <ClipboardCheck size={22} strokeWidth={2} />
        </span>
        <div className="min-w-0 flex-1 basis-48">
          <p className="text-base font-extrabold text-ink">
            {pendingCount === 0
              ? 'No citizen reports waiting'
              : `${pendingCount} citizen ${pendingCount === 1 ? 'report' : 'reports'}`}
          </p>
          <p className="text-sm font-semibold text-muted">
            {pendingCount === 0 ? 'Nothing waiting for review.' : 'awaiting verification'}
          </p>
        </div>
        <Link to="/citizen-reports">
          <Button variant="secondary" className="py-2.5">
            Review Reports
            <ArrowRight size={15} />
          </Button>
        </Link>
      </Card>

      <div
        className="tm-rise relative mt-5 flex min-h-28 items-center overflow-hidden rounded-card bg-sage-soft px-6 py-5"
        style={{ animationDelay: '0.36s' }}
      >
        <span className="mr-4 flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white/70 text-primary">
          <Leaf size={22} />
        </span>
        <p className="relative z-10 max-w-[14rem] text-base font-bold leading-snug text-primary-dark">
          A cleaner city is a healthier, happier city.
        </p>
        <svg
          viewBox="0 0 240 120"
          className="absolute bottom-0 right-0 h-full max-h-32 w-auto"
          aria-hidden="true"
          preserveAspectRatio="xMaxYMax meet"
        >
          <Shrub x={50} y={122} scale={0.9} tone="light" />
          <Tree x={118} y={122} scale={0.7} sway />
          <Cypress x={176} y={122} scale={0.75} />
          <Shrub x={214} y={124} scale={0.8} />
        </svg>
      </div>
    </PageContainer>
  )
}
