import type { CollectionPoint, CollectionRoute, RouteOptimizationResult } from '../../types'
import { mockCollectionRoutes } from '../mock/routes'
import { mockOptimizeRoute } from '../mock/routeOptimizer'
import { resolveAfterDelay } from './httpClient'

const OPTIMIZE_DELAY_MS = 900

export function getCollectionRoutes(): Promise<CollectionRoute[]> {
  return resolveAfterDelay(mockCollectionRoutes)
}

/** The route currently furthest along today's collection run. */
export function getCurrentRoute(): Promise<CollectionRoute> {
  const current = mockCollectionRoutes.reduce((furthest, route) =>
    route.collectionProgress > furthest.collectionProgress ? route : furthest,
  )
  return resolveAfterDelay(current)
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
