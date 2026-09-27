export interface NavItem {
  label: string
  path: string
}

export const PRIMARY_NAV: NavItem[] = [
  { label: 'Dashboard', path: '/dashboard' },
  { label: 'Routes', path: '/routes' },
  { label: 'Waste Map', path: '/map' },
]

export const SECONDARY_NAV: NavItem[] = [
  { label: 'Report Waste', path: '/report' },
  { label: 'My Reports', path: '/my-reports' },
]
