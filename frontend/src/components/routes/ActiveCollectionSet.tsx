import { Card } from '../common/Card'

interface ActiveCollectionSetProps {
  routePointCount: number
  citizenPointCount: number
  skippedCount: number
  collectedCount: number
}

export function ActiveCollectionSet({
  routePointCount,
  citizenPointCount,
  skippedCount,
  collectedCount,
}: ActiveCollectionSetProps) {
  const total = routePointCount + citizenPointCount

  return (
    <Card className="p-5">
      <h2 className="font-display text-base font-semibold text-ink">Active collection set</h2>
      <dl className="mt-3 space-y-1.5 text-sm">
        <div className="flex items-center justify-between">
          <dt className="text-muted">Existing route points</dt>
          <dd className="font-medium text-ink">{routePointCount}</dd>
        </div>
        <div className="flex items-center justify-between">
          <dt className="text-muted">Citizen-added points</dt>
          <dd className="font-medium text-[color:var(--color-status-citizen)]">+ {citizenPointCount}</dd>
        </div>
        <div className="flex items-center justify-between border-t border-ink/[0.06] pt-1.5">
          <dt className="font-medium text-ink">Stops to optimize</dt>
          <dd className="font-display text-lg font-semibold text-primary-dark">{total}</dd>
        </div>
      </dl>
      <p className="mt-3 text-xs text-muted">
        {skippedCount} skipped, {collectedCount} already collected today
      </p>
    </Card>
  )
}
