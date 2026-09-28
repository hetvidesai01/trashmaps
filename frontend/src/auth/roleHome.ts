import type { UserRole } from './authStorage'

/** Where each role lands after login, or when it hits a route it can't use. */
export const ROLE_HOME: Record<UserRole, string> = {
  authority: '/dashboard',
  citizen: '/report',
}
