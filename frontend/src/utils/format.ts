export function formatDateTime(iso: string | null): string {
  if (!iso) return 'Never'
  return new Date(iso).toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function formatPercent(value: number): string {
  return `${Math.round(value * 100)}%`
}

/** "Today, 9:40 am" / "27 Sep, 9:40 am" — short, human-friendly report time. */
export function formatReportedTime(iso: string): string {
  const date = new Date(iso)
  const time = date.toLocaleTimeString('en-IN', { hour: 'numeric', minute: '2-digit' })
  const isToday = date.toDateString() === new Date().toDateString()
  if (isToday) return `Today, ${time}`
  return `${date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}, ${time}`
}
