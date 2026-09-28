/**
 * Tiny localStorage-backed persistence for the prototype auth session, so a
 * page refresh doesn't sign the demo user out. Isolated here — no component
 * ever touches localStorage directly for auth.
 */

export type UserRole = 'authority' | 'citizen'

const STORAGE_KEY = 'trashmaps.auth.role'

export function loadStoredRole(): UserRole | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw === 'authority' || raw === 'citizen' ? raw : null
  } catch {
    return null
  }
}

export function saveStoredRole(role: UserRole): void {
  try {
    localStorage.setItem(STORAGE_KEY, role)
  } catch {
    // Storage unavailable (private browsing, quota, etc.) — session still
    // works for the rest of this tab, it just won't survive a refresh.
  }
}

export function clearStoredRole(): void {
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch {
    // Nothing was persisted in the first place.
  }
}
