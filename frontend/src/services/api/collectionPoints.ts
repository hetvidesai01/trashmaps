import type { CollectionPoint, CollectionStatus } from '../../types'
import { mockCollectionPoints, findCollectionPoint, updateCollectionPointStatus as mutatePointStatus } from '../mock/collectionPoints'
import { resolveAfterDelay } from './httpClient'

/** Facade for the future GET /api/collection-points. */
export function getCollectionPoints(): Promise<CollectionPoint[]> {
  return resolveAfterDelay(mockCollectionPoints)
}

/** Facade for the future GET /api/collection-points/:id. */
export function getCollectionPoint(id: string): Promise<CollectionPoint | null> {
  return resolveAfterDelay(findCollectionPoint(id))
}

/** Facade for the future PATCH /api/collection-points/:id/status. */
export function updateCollectionPointStatus(id: string, status: CollectionStatus): Promise<CollectionPoint> {
  return resolveAfterDelay(mutatePointStatus(id, status), 400)
}
