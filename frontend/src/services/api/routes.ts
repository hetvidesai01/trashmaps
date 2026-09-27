import type { CollectionRoute } from '../../types'
import { mockCollectionRoutes } from '../mock/routes'
import { resolveAfterDelay } from './httpClient'

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
