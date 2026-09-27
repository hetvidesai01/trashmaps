import type { CitizenReport, SubmitReportInput } from '../../types'
import { loadFromStorage, saveToStorage, STORAGE_KEYS } from './storage'

const STORAGE_KEY = STORAGE_KEYS.citizenReports

const seedCitizenReports: CitizenReport[] = [
  {
    id: 'CR-501',
    reportedBy: 'Ananya Deshpande',
    address: 'Behind Bandra Bus Depot',
    latitude: 19.0570,
    longitude: 72.8310,
    category: 'Overflowing bin',
    description: 'Overflowing bin near the depot gate, uncollected for 3 days.',
    imageUrl: null,
    severity: 'high',
    status: 'verified_active',
    reportedAt: '2026-09-26T18:22:00+05:30',
  },
  {
    id: 'CR-502',
    reportedBy: 'Rohit Kulkarni',
    address: 'Vakola Bridge Footpath, Santacruz',
    latitude: 19.0790,
    longitude: 72.8460,
    category: 'Illegal dumping',
    description: 'Construction debris and household waste dumped near the footbridge.',
    imageUrl: null,
    severity: 'medium',
    status: 'verified_active',
    reportedAt: '2026-09-27T08:05:00+05:30',
  },
  {
    id: 'CR-503',
    reportedBy: 'Fatima Shaikh',
    address: 'Near Juhu Circle',
    latitude: 19.1010,
    longitude: 72.8280,
    category: 'Loose litter',
    description: 'Loose garbage scattered after a bin was knocked over near Juhu Circle.',
    imageUrl: null,
    severity: 'low',
    status: 'pending_verification',
    reportedAt: '2026-09-27T09:40:00+05:30',
  },
  {
    id: 'CR-504',
    reportedBy: 'Imran Sheikh',
    address: 'Khar Danda Signal',
    latitude: 19.0691,
    longitude: 72.8291,
    category: 'Overflowing bin',
    description: 'Bin overflowing onto the footpath near the signal.',
    imageUrl: null,
    severity: 'medium',
    status: 'included_in_route',
    reportedAt: '2026-09-24T10:15:00+05:30',
  },
  {
    id: 'CR-505',
    reportedBy: 'Priya Nair',
    address: 'Carter Road Garden Entrance',
    latitude: 19.0525,
    longitude: 72.8251,
    category: 'Loose litter',
    description: 'Litter scattered near the garden entrance after the weekend.',
    imageUrl: null,
    severity: 'low',
    status: 'resolved',
    reportedAt: '2026-09-20T09:00:00+05:30',
  },
  {
    id: 'CR-506',
    reportedBy: 'Vikram Joshi',
    address: 'Near Bandra Reclamation',
    latitude: 19.0480,
    longitude: 72.8210,
    category: 'Other',
    description: 'One-off pile of garden waste, not a recurring problem.',
    imageUrl: null,
    severity: 'low',
    status: 'rejected',
    reportedAt: '2026-09-25T14:00:00+05:30',
  },
]

export const mockCitizenReports: CitizenReport[] = loadFromStorage(STORAGE_KEY, seedCitizenReports)

function persist() {
  saveToStorage(STORAGE_KEY, mockCitizenReports)
}

/**
 * Appends a new citizen report to the in-memory mock store, always starting
 * at "pending_verification" — a report only ever becomes eligible to link to
 * a CollectionPoint once an authority verifies it (a future, separate step).
 */
export function createCitizenReport(input: SubmitReportInput): CitizenReport {
  const report: CitizenReport = {
    id: `CR-${501 + mockCitizenReports.length}`,
    reportedBy: 'You',
    reportedAt: new Date().toISOString(),
    status: 'pending_verification',
    ...input,
  }
  mockCitizenReports.push(report)
  persist()
  return report
}

/** Marks a report verified/active. Does NOT create the CollectionPoint — see services/api/citizenReports.ts. */
export function markReportVerified(reportId: string): CitizenReport {
  const report = mockCitizenReports.find((item) => item.id === reportId)
  if (!report) throw new Error(`Unknown report: ${reportId}`)
  report.status = 'verified_active'
  persist()
  return report
}

/** Marks a report rejected — it is kept for history, never linked to a CollectionPoint. */
export function markReportRejected(reportId: string): CitizenReport {
  const report = mockCitizenReports.find((item) => item.id === reportId)
  if (!report) throw new Error(`Unknown report: ${reportId}`)
  report.status = 'rejected'
  persist()
  return report
}
