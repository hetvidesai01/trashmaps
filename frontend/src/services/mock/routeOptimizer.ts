import type { CollectionPoint } from '../../types'

/**
 * MOCK PROTOTYPE ONLY.
 *
 * Stands in for a future backend route-optimization endpoint
 * (POST /api/routes/optimize). It does NOT compute real distances and does
 * NOT run any routing algorithm — no nearest-neighbour, no Dijkstra, no
 * TSP/VRP solver. It fabricates a plausible-looking reorder and stats purely
 * so the frontend has something realistic to render.
 *
 * When the real backend optimizer ships, only this file's internals need to
 * change (or be deleted in favor of an HTTP call in services/api/routes.ts) —
 * every caller already deals in the same input/output shape a real endpoint
 * would use.
 */

const KM_PER_STOP = 1.35
const MIN_PER_STOP = 4.5
const DEPOT_OVERHEAD_KM = 1.8
const DEPOT_OVERHEAD_MIN = 6

export interface MockOptimizeInput {
  activeStops: CollectionPoint[]
}

export interface MockOptimizeOutput {
  optimizedStops: CollectionPoint[]
  totalDistance: number
  estimatedTime: number
}

export function mockOptimizeRoute({ activeStops }: MockOptimizeInput): MockOptimizeOutput {
  if (activeStops.length === 0) {
    return { optimizedStops: [], totalDistance: 0, estimatedTime: 0 }
  }

  // Placeholder reorder only (not distance-based) — a real optimizer decides this.
  const optimizedStops = [...activeStops].reverse()

  // Heuristic numbers derived from stop count alone, not real geography.
  const totalDistance = Number((DEPOT_OVERHEAD_KM + activeStops.length * KM_PER_STOP).toFixed(1))
  const estimatedTime = Math.round(DEPOT_OVERHEAD_MIN + activeStops.length * MIN_PER_STOP)

  return { optimizedStops, totalDistance, estimatedTime }
}
