import type { CollectionRoute } from '../../types'
import { mockCollectionRoutes } from '../mock/routes'
import { resolveAfterDelay } from './httpClient'

export function getCollectionRoutes(): Promise<CollectionRoute[]> {
  return resolveAfterDelay(mockCollectionRoutes)
}
