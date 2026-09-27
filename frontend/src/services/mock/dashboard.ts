import type { CollectionPoint, DashboardStats } from '../../types'

/** Recomputed from live point state on every call — never a cached snapshot. */
export function buildDashboardStats(points: CollectionPoint[]): DashboardStats {
  return {
    pointsOnRouteToday: points.length,
    requiringCollection: points.filter((point) => point.status === 'pending').length,
    skipped: points.filter((point) => point.status === 'skipped').length,
    citizenAdded: points.filter((point) => point.source === 'citizen').length,
    collectedToday: points.filter((point) => point.status === 'collected').length,
  }
}
