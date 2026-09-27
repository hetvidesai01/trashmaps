import type { CitizenReport, SubmitReportInput } from '../../types'
import { mockCitizenReports, createCitizenReport } from '../mock/citizenReports'
import { resolveAfterDelay } from './httpClient'

/** Facade for the future GET /api/citizen-reports/mine. */
export function getCitizenReports(): Promise<CitizenReport[]> {
  return resolveAfterDelay(mockCitizenReports)
}

/** Facade for the future POST /api/citizen-reports. */
export function submitReport(input: SubmitReportInput): Promise<CitizenReport> {
  return resolveAfterDelay(createCitizenReport(input), 600)
}
