import type { ActivityEvent } from '../../types'

export const mockActivity: ActivityEvent[] = [
  {
    id: 'AC-1',
    type: 'report-verified',
    message: 'Citizen report CR-502 verified and added to the active set at Vakola Bridge Footpath',
    timestamp: '2026-09-27T08:30:00+05:30',
    pointId: 'CP-110',
  },
  {
    id: 'AC-2',
    type: 'collected',
    message: 'SV Road, Khar West marked as collected',
    timestamp: '2026-09-27T06:50:00+05:30',
    pointId: 'CP-104',
  },
  {
    id: 'AC-3',
    type: 'requires-collection',
    message: 'Santacruz Station Road flagged as requiring collection today',
    timestamp: '2026-09-27T06:40:00+05:30',
    pointId: 'CP-105',
  },
  {
    id: 'AC-4',
    type: 'skipped',
    message: 'Carter Road Promenade skipped — no collection needed today',
    timestamp: '2026-09-27T07:00:00+05:30',
    pointId: 'CP-102',
  },
  {
    id: 'AC-5',
    type: 'report-verified',
    message: 'Citizen report CR-501 verified and added to the active set behind Bandra Bus Depot',
    timestamp: '2026-09-26T19:00:00+05:30',
    pointId: 'CP-109',
  },
]
