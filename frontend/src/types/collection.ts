export type CollectionStatus = 'pending' | 'skipped' | 'collected'

export type PointSource = 'route' | 'citizen'

export interface CollectionPoint {
  id: string
  address: string
  latitude: number
  longitude: number
  existingRouteId: string | null
  requiresCollection: boolean
  status: CollectionStatus
  lastCollected: string | null
  source: PointSource
  /** CitizenReport.id this point originated from, when source === 'citizen' */
  linkedReportId: string | null
}
