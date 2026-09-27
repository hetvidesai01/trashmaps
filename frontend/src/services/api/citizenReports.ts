import type { CitizenReport, CollectionPoint, SubmitReportInput } from '../../types'
import { mockCitizenReports, createCitizenReport, markReportVerified, markReportRejected } from '../mock/citizenReports'
import { createCollectionPointFromReport } from '../mock/collectionPoints'
import { resolveAfterDelay } from './httpClient'

/** Facade for the future GET /api/citizen-reports/mine. */
export function getCitizenReports(): Promise<CitizenReport[]> {
  return resolveAfterDelay(mockCitizenReports)
}

/** Facade for the future POST /api/citizen-reports. */
export function submitReport(input: SubmitReportInput): Promise<CitizenReport> {
  return resolveAfterDelay(createCitizenReport(input), 600)
}

export interface ApproveReportResult {
  report: CitizenReport
  point: CollectionPoint
}

/**
 * Facade for the future PATCH /api/citizen-reports/:id/verify. Verifying a
 * report and creating its linked CollectionPoint are two distinct records —
 * this just orchestrates both mock mutations as one authority action.
 */
export function approveReport(reportId: string): Promise<ApproveReportResult> {
  const report = markReportVerified(reportId)
  const point = createCollectionPointFromReport(report)
  return resolveAfterDelay({ report, point }, 500)
}

/** A rejected report is kept, never linked to a CollectionPoint. */
export function rejectReport(reportId: string): Promise<CitizenReport> {
  return resolveAfterDelay(markReportRejected(reportId), 500)
}
