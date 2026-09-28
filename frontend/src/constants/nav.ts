export interface NavItem {
  label: string
  path: string
}

export const AUTHORITY_PRIMARY_NAV: NavItem[] = [
  { label: 'Dashboard', path: '/dashboard' },
  { label: 'Route Operations', path: '/routes' },
  { label: 'Citizen Reports', path: '/citizen-reports' },
]

// The waste map stays functional but is secondary now that citizens and
// authorities have their own dedicated flows — kept out of primary nav.
export const AUTHORITY_SECONDARY_NAV: NavItem[] = [{ label: 'Waste Map', path: '/map' }]

export const CITIZEN_PRIMARY_NAV: NavItem[] = [
  { label: 'Report Waste', path: '/report' },
  { label: 'My Reports', path: '/my-reports' },
]
