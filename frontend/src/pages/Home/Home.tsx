import { Link } from 'react-router-dom'
import { LayoutDashboard, Route as RouteIcon, Map, MessageSquarePlus, ClipboardList, ArrowUpRight } from 'lucide-react'
import { Button } from '../../components/common/Button'
import { Card } from '../../components/common/Card'
import { PageContainer } from '../../components/layout/PageContainer'
import { useAsyncData } from '../../hooks/useAsyncData'
import { getDashboardStats } from '../../services/api'
import { RouteArt } from './RouteArt'

const OPERATIONAL_FEATURES = [
  {
    to: '/dashboard',
    icon: LayoutDashboard,
    title: 'Operations dashboard',
    description: 'See today’s collection load across every ward at a glance.',
  },
  {
    to: '/routes',
    icon: RouteIcon,
    title: 'Route optimization',
    description: 'Send the active stop set for a route to the optimizer and track progress.',
  },
  {
    to: '/map',
    icon: Map,
    title: 'Waste map',
    description: 'View every collection point, its status, and its source on one map.',
  },
]

const CITIZEN_FEATURES = [
  { to: '/report', icon: MessageSquarePlus, title: 'Report waste' },
  { to: '/my-reports', icon: ClipboardList, title: 'My reports' },
]

export function Home() {
  const { data: stats } = useAsyncData(getDashboardStats)

  return (
    <PageContainer className="max-w-7xl">
      <section className="grid items-center gap-12 py-6 lg:grid-cols-[1.1fr_0.9fr] lg:py-14">
        <div>
          <h1 className="max-w-xl text-4xl font-semibold leading-[1.08] text-ink lg:text-5xl">
            Collect only where it matters.
          </h1>
          <p className="mt-5 max-w-md text-[17px] leading-relaxed text-muted">
            TrashMaps checks each stop on your existing routes, drops the ones that don&rsquo;t need
            a pickup today, folds in verified citizen reports, and hands the active set to your
            route optimizer.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/dashboard">
              <Button variant="primary">Open dashboard</Button>
            </Link>
            <Link to="/map">
              <Button variant="secondary">Explore waste map</Button>
            </Link>
          </div>

          {stats && (
            <dl className="mt-10 grid grid-cols-3 gap-x-8 gap-y-5 border-t border-ink/10 pt-6">
              <div>
                <dt className="text-xs text-muted">Points on route today</dt>
                <dd className="mt-1 font-display text-2xl font-semibold text-ink">
                  {stats.pointsOnRouteToday}
                </dd>
              </div>
              <div>
                <dt className="text-xs text-muted">Need collection</dt>
                <dd className="mt-1 font-display text-2xl font-semibold text-[#D97706]">
                  {stats.requiringCollection}
                </dd>
              </div>
              <div>
                <dt className="text-xs text-muted">Collected today</dt>
                <dd className="mt-1 font-display text-2xl font-semibold text-primary">
                  {stats.collectedToday}
                </dd>
              </div>
            </dl>
          )}
        </div>

        <Card className="flex h-72 items-center justify-center p-6 lg:h-80">
          <RouteArt />
        </Card>
      </section>

      <section className="py-8">
        <h2 className="text-sm font-semibold text-muted">Core operations</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          {OPERATIONAL_FEATURES.map(({ to, icon: Icon, title, description }) => (
            <Link key={to} to={to}>
              <Card className="group h-full p-6 transition-shadow hover:shadow-[0_2px_4px_rgba(20,30,25,0.06),0_16px_32px_rgba(20,30,25,0.08)]">
                <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary-dark">
                  <Icon size={19} strokeWidth={2} />
                </span>
                <h3 className="mt-4 flex items-center gap-1.5 font-display text-lg font-semibold text-ink">
                  {title}
                  <ArrowUpRight
                    size={16}
                    className="text-muted opacity-0 transition-opacity group-hover:opacity-100"
                  />
                </h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted">{description}</p>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      <section className="py-4">
        <h2 className="text-sm font-semibold text-muted">Citizen reporting</h2>
        <div className="mt-4 flex flex-wrap gap-3">
          {CITIZEN_FEATURES.map(({ to, icon: Icon, title }) => (
            <Link
              key={to}
              to={to}
              className="flex items-center gap-2 rounded-lg border border-ink/10 bg-surface px-4 py-3 text-sm font-medium text-ink transition-colors hover:border-primary/30"
            >
              <Icon size={16} className="text-muted" />
              {title}
            </Link>
          ))}
        </div>
      </section>
    </PageContainer>
  )
}
