import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../../auth/AuthContext'
import { ROLE_HOME } from '../../auth/roleHome'
import type { UserRole } from '../../auth/authStorage'

interface RequireRoleProps {
  role: UserRole
}

/**
 * Nested under RequireAuth, so `role` is always set by the time this runs.
 * A signed-in user of the wrong role is bounced to their own home page
 * rather than /login — they're authenticated, just not allowed here.
 */
export function RequireRole({ role }: RequireRoleProps) {
  const { role: currentRole } = useAuth()

  if (currentRole && currentRole !== role) {
    return <Navigate to={ROLE_HOME[currentRole]} replace />
  }

  return <Outlet />
}
