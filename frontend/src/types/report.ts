export type ReportStatus =
  | 'pending_verification'
  | 'verified_active'
  | 'included_in_route'
  | 'resolved'

export type ReportSeverity = 'low' | 'medium' | 'high'

export interface CitizenReport {
  id: string
  latitude: number
  longitude: number
  category: string
  description: string
  imageUrl: string | null
  severity: ReportSeverity
  status: ReportStatus
  reportedAt: string
  reportedBy: string
}
