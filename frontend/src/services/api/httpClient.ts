const MOCK_LATENCY_MS = 250

export function resolveAfterDelay<T>(value: T, delayMs: number = MOCK_LATENCY_MS): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), delayMs))
}
