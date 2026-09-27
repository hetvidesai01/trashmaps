/**
 * Tiny localStorage-backed persistence for the mock data layer, so a page
 * refresh doesn't erase demo submissions/approvals. Isolated here — no
 * component ever touches localStorage directly.
 */

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
