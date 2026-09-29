import type { CollectionStatus, ReportStatus } from '../types'

export const STATUS_LABEL: Record<CollectionStatus, string> = {
  pending: 'Requires collection',
  skipped: 'Skipped',
  collected: 'Collected',
}

export const STATUS_COLOR: Record<CollectionStatus, string> = {
  pending: 'var(--color-status-requires)',
  skipped: 'var(--color-status-skipped)',
  collected: 'var(--color-status-collected)',
}

export const CITIZEN_SOURCE_COLOR = 'var(--color-status-citizen)'

export const REPORT_STATUS_LABEL: Record<ReportStatus, string> = {
  pending_verification: 'Under Review',
  verified_active: 'Approved',
  included_in_route: 'Added to Route',
  resolved: 'Collected',
  rejected: 'Rejected',
}

export const REPORT_STATUS_COLOR: Record<ReportStatus, string> = {
  pending_verification: 'var(--color-status-requires)',
  verified_active: 'var(--color-status-citizen)',
  included_in_route: 'var(--color-status-collected)',
  resolved: 'var(--color-status-skipped)',
  rejected: 'var(--color-status-skipped)',
}
