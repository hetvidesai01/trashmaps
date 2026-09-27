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
  totalDistance: number | null
  estimatedTime: number | null
  collectionProgress: number
  generatedAt: string | null
}
