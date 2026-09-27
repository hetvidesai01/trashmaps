import type { DashboardStats } from '../../types'
import { mockDashboardStats } from '../mock/dashboard'
import { resolveAfterDelay } from './httpClient'

export function getDashboardStats(): Promise<DashboardStats> {
  return resolveAfterDelay(mockDashboardStats)
}
