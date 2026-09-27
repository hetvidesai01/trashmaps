import type { CollectionRoute } from '../../types'
import { mockCollectionPoints } from './collectionPoints'

const byRoute = (routeId: string) =>
  mockCollectionPoints.filter((point) => point.existingRouteId === routeId)

const byId = (id: string) => mockCollectionPoints.find((point) => point.id === id)!

export const mockCollectionRoutes: CollectionRoute[] = [
  {
    routeId: 'RT-01',
    name: 'Ward 4 — Bandra West',
    vehicle: 'MH-01-GA-4521 (Compactor)',
    depot: { name: 'Bandra Collection Depot', latitude: 19.0544, longitude: 72.8296 },
    originalStops: byRoute('RT-01'),
    activeStops: [...byRoute('RT-01').filter((point) => point.requiresCollection), byId('CP-109')],
    optimizedStops: null,
    originalDistance: 9.5,
    originalEstimatedTime: 34,
    totalDistance: null,
    estimatedTime: null,
    distanceSaved: null,
    timeSaved: null,
    collectionProgress: 0.35,
    generatedAt: null,
  },
  {
    routeId: 'RT-02',
    name: 'Ward 6 — Khar / Santacruz',
    vehicle: 'MH-01-GB-7810 (Compactor)',
    depot: { name: 'Khar Transfer Station', latitude: 19.0728, longitude: 72.8375 },
    originalStops: byRoute('RT-02'),
    activeStops: [...byRoute('RT-02').filter((point) => point.requiresCollection), byId('CP-110')],
    optimizedStops: null,
    originalDistance: 8.2,
    originalEstimatedTime: 30,
    totalDistance: null,
    estimatedTime: null,
    distanceSaved: null,
    timeSaved: null,
    collectionProgress: 0.6,
    generatedAt: null,
  },
  {
    routeId: 'RT-03',
    name: 'Ward 9 — Vile Parle / Juhu',
    vehicle: 'MH-01-GC-2290 (Tipper)',
    depot: { name: 'Vile Parle Depot', latitude: 19.0997, longitude: 72.8464 },
    originalStops: byRoute('RT-03'),
    activeStops: byRoute('RT-03').filter((point) => point.requiresCollection),
    optimizedStops: null,
    originalDistance: 6.0,
    originalEstimatedTime: 22,
    totalDistance: null,
    estimatedTime: null,
    distanceSaved: null,
    timeSaved: null,
    collectionProgress: 0.1,
    generatedAt: null,
  },
]
