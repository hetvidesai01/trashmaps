import type { CollectionPoint, CollectionRoute, Depot } from '../../types'

interface RouteSeed {
  routeId: string
  name: string
  vehicle: string
  depot: Depot
  originalDistance: number
  originalEstimatedTime: number
  collectionProgress: number
}

const routeSeeds: RouteSeed[] = [
  {
    routeId: 'RT-01',
    name: 'Ward 4 — Bandra West',
    vehicle: 'MH-01-GA-4521 (Compactor)',
    depot: { name: 'Bandra Collection Depot', latitude: 19.0544, longitude: 72.8296 },
    originalDistance: 9.5,
    originalEstimatedTime: 34,
    collectionProgress: 0.35,
  },
  {
    routeId: 'RT-02',
    name: 'Ward 6 — Khar / Santacruz',
    vehicle: 'MH-01-GB-7810 (Compactor)',
    depot: { name: 'Khar Transfer Station', latitude: 19.0728, longitude: 72.8375 },
    originalDistance: 8.2,
    originalEstimatedTime: 30,
    collectionProgress: 0.6,
  },
  {
    routeId: 'RT-03',
    name: 'Ward 9 — Vile Parle / Juhu',
    vehicle: 'MH-01-GC-2290 (Tipper)',
    depot: { name: 'Vile Parle Depot', latitude: 19.0997, longitude: 72.8464 },
    originalDistance: 6.0,
    originalEstimatedTime: 22,
    collectionProgress: 0.1,
  },
]

/**
 * Which depot a citizen point is closest to — a simple nearest-neighbour
 * classification (not a routing algorithm) used only to decide which route's
 * active set an approved citizen point joins. No path/sequence is computed
 * here; that's the optimizer's job.
 */
function nearestRouteId(point: CollectionPoint): string {
  let closest = routeSeeds[0]
  let closestDistance = Infinity
  for (const seed of routeSeeds) {
    const distance = Math.hypot(point.latitude - seed.depot.latitude, point.longitude - seed.depot.longitude)
    if (distance < closestDistance) {
      closestDistance = distance
      closest = seed
    }
  }
  return closest.routeId
}

/**
 * Builds the full CollectionRoute list from the CURRENT collection-point
 * state. activeStops is intentionally recomputed here rather than stored
 * statically, so a newly-approved citizen CollectionPoint is automatically
 * picked up by every consumer (Dashboard, Waste Map, Routes) the next time
 * they fetch — no page has to know how the active set is assembled.
 */
export function buildCollectionRoutes(points: CollectionPoint[]): CollectionRoute[] {
  return routeSeeds.map((seed) => {
    const originalStops = points.filter((point) => point.existingRouteId === seed.routeId)
    const routeActive = originalStops.filter((point) => point.requiresCollection)
    const citizenActive = points.filter(
      (point) => point.source === 'citizen' && point.requiresCollection && nearestRouteId(point) === seed.routeId,
    )

    return {
      ...seed,
      originalStops,
      activeStops: [...routeActive, ...citizenActive],
      optimizedStops: null,
      totalDistance: null,
      estimatedTime: null,
      distanceSaved: null,
      timeSaved: null,
      generatedAt: null,
    }
  })
}
