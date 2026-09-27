import { PageContainer } from '../../components/layout/PageContainer'
import { RouteCard } from '../../components/routes/RouteCard'
import { useAsyncData } from '../../hooks/useAsyncData'
import { getCollectionRoutes } from '../../services/api'

export function Routes() {
  const { data: routes } = useAsyncData(getCollectionRoutes)

  return (
    <PageContainer>
      <header>
        <h1 className="font-display text-2xl font-semibold text-ink">Route optimization</h1>
        <p className="mt-1 max-w-2xl text-sm text-muted">
          Each route keeps its original stops. Points marked as active are the ones that require
          collection today &mdash; that set is what gets sent to the optimizer.
        </p>
      </header>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {routes?.map((route) => (
          <RouteCard key={route.routeId} route={route} />
        ))}
      </div>
    </PageContainer>
  )
}
