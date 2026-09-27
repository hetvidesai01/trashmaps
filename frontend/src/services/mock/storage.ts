/**
 * Tiny localStorage-backed persistence for the mock data layer, so a page
 * refresh doesn't erase demo submissions/approvals. Isolated here — no
 * component ever touches localStorage directly.
 */

/** Every key the mock layer persists under, centralized so reset/debug tooling doesn't hardcode strings. */
export const STORAGE_KEYS = {
  collectionPoints: 'trashmaps.collectionPoints',
  citizenReports: 'trashmaps.citizenReports',
} as const

export function loadFromStorage<T>(key: string, seed: T): T {
  try {
    const raw = localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T) : seed
  } catch {
    return seed
  }
}

export function saveToStorage<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // Storage unavailable (private browsing, quota, etc.) — state still
    // works for the rest of this session, it just won't survive a refresh.
  }
}

/**
 * Prototype-only utility: wipes all persisted demo state so the next page
 * load starts from the original seed data again. This has no real-backend
 * analogue, so it deliberately lives outside services/api — nothing here
 * represents a future HTTP call.
 */
export function resetDemoData(): void {
  try {
    Object.values(STORAGE_KEYS).forEach((key) => localStorage.removeItem(key))
  } catch {
    // Storage unavailable — nothing was persisted in the first place.
  }
}
