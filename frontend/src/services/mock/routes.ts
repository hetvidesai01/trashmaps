import type { CollectionRoute } from '../../types'
import { mockCollectionPoints } from './collectionPoints'

const byRoute = (routeId: string) =>
  mockCollectionPoints.filter((point) => point.existingRouteId === routeId)

const byId = (id: string) => mockCollectionPoints.find((point) => point.id === id)!

export const mockCollectionRoutes: CollectionRoute[] = [
  {
    routeId: 'RT-01',
    name: 'Ward 7 — Baner / Aundh',
    depot: { name: 'Baner Transfer Station', latitude: 18.5601, longitude: 73.7754 },
    originalStops: byRoute('RT-01'),
    activeStops: [...byRoute('RT-01').filter((point) => point.requiresCollection), byId('CP-109')],
    optimizedStops: null,
    totalDistance: null,
    estimatedTime: null,
    collectionProgress: 0.35,
    generatedAt: null,
  },
  {
    routeId: 'RT-02',
    name: 'Ward 12 — Pashan / Sus / Bavdhan',
    depot: { name: 'Pashan Depot', latitude: 18.5333, longitude: 73.7935 },
    originalStops: byRoute('RT-02'),
    activeStops: [...byRoute('RT-02').filter((point) => point.requiresCollection), byId('CP-110')],
    optimizedStops: null,
    totalDistance: null,
    estimatedTime: null,
    collectionProgress: 0.6,
    generatedAt: null,
  },
  {
    routeId: 'RT-03',
    name: 'Ward 15 — Balewadi / Wakad',
    depot: { name: 'Wakad Depot', latitude: 18.5978, longitude: 73.7688 },
    originalStops: byRoute('RT-03'),
    activeStops: byRoute('RT-03').filter((point) => point.requiresCollection),
    optimizedStops: null,
    totalDistance: null,
    estimatedTime: null,
    collectionProgress: 0.1,
    generatedAt: null,
  },
]
