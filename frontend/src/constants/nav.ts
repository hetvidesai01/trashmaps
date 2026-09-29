export interface NavItem {
  label: string
  path: string
}

export const AUTHORITY_PRIMARY_NAV: NavItem[] = [
  { label: 'Dashboard', path: '/dashboard' },
  { label: 'Route', path: '/routes' },
  { label: 'Reports', path: '/citizen-reports' },
]

// The waste map (/map) stays routable but is intentionally not in the nav:
// the Route page is where authorities see stops on a map now.

export const CITIZEN_PRIMARY_NAV: NavItem[] = [
  { label: 'Report Waste', path: '/report' },
  { label: 'My Reports', path: '/my-reports' },
]
