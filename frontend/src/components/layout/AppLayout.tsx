import { Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../../auth/AuthContext'
import { AUTHORITY_PRIMARY_NAV, CITIZEN_PRIMARY_NAV } from '../../constants/nav'
import { BottomNav } from './BottomNav'
import { Sidebar } from './Sidebar'
import { TopBar } from './TopBar'

export function AppLayout() {
  const { role } = useAuth()
  const { pathname } = useLocation()

  // Keyed on the path so every navigation replays the gentle entrance.
  const page = (
    <div key={pathname} className="tm-rise">
      <Outlet />
    </div>
  )

  if (role === 'authority') {
    return (
      <div className="min-h-svh bg-bg lg:pl-64">
        <Sidebar />
        <main className="pb-24 lg:pb-0">{page}</main>
        <BottomNav items={AUTHORITY_PRIMARY_NAV} />
      </div>
    )
  }

  const isLanding = !role && pathname === '/'
  if (isLanding) return page

  return (
    <div className="flex min-h-svh flex-col bg-bg">
      <TopBar />
      <main className={`flex-1 ${role ? 'pb-24 lg:pb-0' : ''}`}>{page}</main>
      {role === 'citizen' && <BottomNav items={CITIZEN_PRIMARY_NAV} />}
    </div>
  )
}
