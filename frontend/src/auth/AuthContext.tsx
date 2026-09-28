import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { clearStoredRole, loadStoredRole, saveStoredRole } from './authStorage'
import type { UserRole } from './authStorage'

export interface AuthUser {
  role: UserRole
  name: string
}

interface AuthContextValue {
  user: AuthUser | null
  role: UserRole | null
  isAuthenticated: boolean
  login: (role: UserRole) => void
  logout: () => void
}

/** Prototype auth only — no real accounts, so the demo user is labeled by role. */
const DEMO_USER_NAME: Record<UserRole, string> = {
  authority: 'Authority (demo)',
  citizen: 'Citizen (demo)',
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [role, setRole] = useState<UserRole | null>(() => loadStoredRole())

  const login = useCallback((nextRole: UserRole) => {
    saveStoredRole(nextRole)
    setRole(nextRole)
  }, [])

  const logout = useCallback(() => {
    clearStoredRole()
    setRole(null)
  }, [])

  const value = useMemo<AuthContextValue>(
    () => ({
      user: role ? { role, name: DEMO_USER_NAME[role] } : null,
      role,
      isAuthenticated: role !== null,
      login,
      logout,
    }),
    [role, login, logout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
