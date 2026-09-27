import type { CollectionStatus, PointSource, ReportSeverity } from '../../types'

export interface PointFilters {
  sources: PointSource[]
  statuses: CollectionStatus[]
  severities: ReportSeverity[]
}

export const EMPTY_FILTERS: PointFilters = { sources: [], statuses: [], severities: [] }
