import type { CollectionRoute } from '../types'

export interface RouteSummary {
  /** Stops on the vehicle's normal route. */
  normalStops: number
  /** Normal-route stops that need a visit today. */
  needCollection: number
  /** Normal-route stops that can be left out today. */
  skipped: number
  /** Verified citizen-reported stops added to today's route. */
  citizenAdded: number
  /** Everything the vehicle has to visit (needCollection + citizenAdded). */
  totalToCollect: number
  collected: number
  /** 0..1 */
  progress: number
}

/** Plain counts derived from a CollectionRoute — no routing maths. */
export function summarizeRoute(route: CollectionRoute): RouteSummary {
  const citizenAdded = route.activeStops.filter((point) => point.source === 'citizen').length
  const totalToCollect = route.activeStops.length
  const collected = route.activeStops.filter((point) => point.status === 'collected').length

  return {
    normalStops: route.originalStops.length,
    needCollection: totalToCollect - citizenAdded,
    skipped: route.originalStops.filter((point) => point.status === 'skipped').length,
    citizenAdded,
    totalToCollect,
    collected,
    progress: totalToCollect === 0 ? 1 : collected / totalToCollect,
  }
}
