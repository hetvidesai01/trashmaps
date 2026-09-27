import type { CollectionPoint } from '../../types'
import { mockCollectionPoints } from '../mock/collectionPoints'
import { resolveAfterDelay } from './httpClient'

export function getCollectionPoints(): Promise<CollectionPoint[]> {
  return resolveAfterDelay(mockCollectionPoints)
}
