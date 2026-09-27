import type { DashboardStats } from '../../types'
import { mockCollectionPoints } from '../mock/collectionPoints'
import { buildDashboardStats } from '../mock/dashboard'
import { resolveAfterDelay } from './httpClient'

export function getDashboardStats(): Promise<DashboardStats> {
  return resolveAfterDelay(buildDashboardStats(mockCollectionPoints))
}
