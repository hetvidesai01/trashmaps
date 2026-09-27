import type { ActivityEvent } from '../../types'
import { mockActivity } from '../mock/activity'
import { resolveAfterDelay } from './httpClient'

export function getRecentActivity(): Promise<ActivityEvent[]> {
  const sorted = [...mockActivity].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
  )
  return resolveAfterDelay(sorted)
}
