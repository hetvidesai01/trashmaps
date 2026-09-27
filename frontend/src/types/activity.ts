export type ActivityEventType =
  | 'collected'
  | 'skipped'
  | 'requires-collection'
  | 'report-verified'

export interface ActivityEvent {
  id: string
  type: ActivityEventType
  message: string
  timestamp: string
  pointId: string | null
}
