import type { CollectionPoint } from './collection'

export interface Depot {
  name: string
  latitude: number
  longitude: number
}

export interface CollectionRoute {
  routeId: string
  name: string
  vehicle: string
  depot: Depot
  originalStops: CollectionPoint[]
  activeStops: CollectionPoint[]
  optimizedStops: CollectionPoint[] | null
  /** Distance/time of the existing predefined route, independent of optimization. */
  originalDistance: number
  originalEstimatedTime: number
  /** Populated once an optimized route has been generated. */
  totalDistance: number | null
  estimatedTime: number | null
  distanceSaved: number | null
  timeSaved: number | null
  collectionProgress: number
  generatedAt: string | null
}

/** Shape returned by the (mock) POST /api/routes/optimize endpoint. */
export interface RouteOptimizationResult {
  optimizedStops: CollectionPoint[]
  totalDistance: number
  estimatedTime: number
  distanceSaved: number
  timeSaved: number
  generatedAt: string
}
