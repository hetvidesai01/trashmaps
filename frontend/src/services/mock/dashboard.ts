import type { DashboardStats } from '../../types'
import { mockCollectionPoints } from './collectionPoints'

export const mockDashboardStats: DashboardStats = {
  pointsOnRouteToday: mockCollectionPoints.length,
  requiringCollection: mockCollectionPoints.filter((point) => point.status === 'pending').length,
  skipped: mockCollectionPoints.filter((point) => point.status === 'skipped').length,
  citizenAdded: mockCollectionPoints.filter((point) => point.source === 'citizen').length,
  collectedToday: mockCollectionPoints.filter((point) => point.status === 'collected').length,
}
