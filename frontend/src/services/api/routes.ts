import type { CollectionPoint, CollectionRoute, RouteOptimizationResult } from '../../types'
import { mockCollectionPoints } from '../mock/collectionPoints'
import { buildCollectionRoutes } from '../mock/routes'
import { mockOptimizeRoute } from '../mock/routeOptimizer'
import { resolveAfterDelay } from './httpClient'

const OPTIMIZE_DELAY_MS = 900

/**
 * Rebuilt from the current CollectionPoint state on every call, so any
 * newly-approved citizen point is reflected immediately — never a stale
 * cached list.
 */
export function getCollectionRoutes(): Promise<CollectionRoute[]> {
  return resolveAfterDelay(buildCollectionRoutes(mockCollectionPoints))
}

/** The route currently furthest along today's collection run. */
export function getCurrentRoute(): Promise<CollectionRoute> {
  const routes = buildCollectionRoutes(mockCollectionPoints)
  const current = routes.reduce((furthest, route) =>
    route.collectionProgress > furthest.collectionProgress ? route : furthest,
  )
  return resolveAfterDelay(current)
}

/** Facade for the future GET /api/routes/existing/:routeId. */
export function getExistingRoute(routeId: string): Promise<CollectionRoute | null> {
  const route = buildCollectionRoutes(mockCollectionPoints).find((item) => item.routeId === routeId) ?? null
  return resolveAfterDelay(route)
}

/**
 * Facade for the future `POST /api/routes/optimize`. Everything here is
 * backed by the mock optimizer in services/mock/routeOptimizer.ts — swap this
 * function's body for a real fetch() once the backend optimizer exists;
 * callers (the Routes page) only ever see a Promise<RouteOptimizationResult>
 * and never need to change.
 */
export function optimizeRoute(
  route: CollectionRoute,
  activeStops: CollectionPoint[],
): Promise<RouteOptimizationResult> {
  const mock = mockOptimizeRoute({ activeStops })
  const distanceSaved = Number((route.originalDistance - mock.totalDistance).toFixed(1))
  const timeSaved = route.originalEstimatedTime - mock.estimatedTime

  return resolveAfterDelay(
    {
      optimizedStops: mock.optimizedStops,
      totalDistance: mock.totalDistance,
      estimatedTime: mock.estimatedTime,
      distanceSaved,
      timeSaved,
      generatedAt: new Date().toISOString(),
    },
    OPTIMIZE_DELAY_MS,
  )
}
