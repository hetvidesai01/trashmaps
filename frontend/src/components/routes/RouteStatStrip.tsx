import type { RouteSummary } from '../../utils/routeSummary'

interface RouteStatStripProps {
  summary: RouteSummary
}

/** Four plain counts that summarise today's route, shown above the map. */
export function RouteStatStrip({ summary }: RouteStatStripProps) {
  const items = [
    { value: summary.normalStops, label: 'Normal stops', color: 'text-[#3d6f9e]' },
    { value: summary.needCollection, label: 'Need collection', color: 'text-primary' },
    { value: summary.skipped, label: 'Can be skipped', color: 'text-[#7d857c]' },
    { value: summary.citizenAdded, label: 'Citizen reports', color: 'text-status-citizen' },
  ]

  return (
    <dl className="grid grid-cols-4 divide-x divide-line rounded-card border border-line/70 bg-surface py-4 shadow-card">
      {items.map((item) => (
        <div key={item.label} className="px-1 text-center sm:px-3">
          <dd className={`font-display text-3xl font-semibold leading-none sm:text-4xl ${item.color}`}>{item.value}</dd>
          <dt className="mt-2 text-[11px] font-bold leading-tight text-muted sm:text-xs">{item.label}</dt>
        </div>
      ))}
    </dl>
  )
}
