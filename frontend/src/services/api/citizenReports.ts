import type { CitizenReport } from '../../types'
import { mockCitizenReports } from '../mock/citizenReports'
import { resolveAfterDelay } from './httpClient'

export function getCitizenReports(): Promise<CitizenReport[]> {
  return resolveAfterDelay(mockCitizenReports)
}
