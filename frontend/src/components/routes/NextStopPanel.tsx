import { CheckCircle2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button } from '../common/Button'
import { CollectionProgressBar } from './CollectionProgressBar'
import type { CollectionPoint } from '../../types'

interface NextStopPanelProps {
  nextStop: CollectionPoint | null
  /** 1-based position of the next stop in the ordered list. */
  stopNumber: number
  totalStops: number
  collectedCount: number
  /** Straight-line km from the previous stop (or depot). */
  distanceAwayKm: number | null
  onMarkCollected: (pointId: string) => void
}

export function NextStopPanel({
  nextStop,
  stopNumber,
  totalStops,
  collectedCount,
  distanceAwayKm,
  onMarkCollected,
}: NextStopPanelProps) {
  if (!nextStop) {
    return (
      <section>
        <CheckCircle2 className="text-primary" size={32} strokeWidth={1.75} />
        <p className="mt-3 font-display text-2xl font-semibold text-ink">Route complete</p>
        <p className="mt-1 text-sm text-muted">All {totalStops} stops have been collected.</p>
        <Link to="/dashboard" className="mt-5 inline-block text-sm font-medium text-primary-dark hover:underline">
          Back to Dashboard
        </Link>
      </section>
    )
  }

  return (
    <section>
      <p className="text-xs font-semibold tracking-wider text-primary-dark">NEXT STOP</p>
      <p className="mt-1 text-sm text-muted">
        Stop {stopNumber} of {totalStops}
      </p>
      <p className="mt-3 font-display text-2xl font-semibold leading-tight text-ink">{nextStop.address}</p>
      {distanceAwayKm != null && <p className="mt-1 text-base text-muted">{distanceAwayKm.toFixed(1)} km away</p>}

      <Button className="mt-6 w-full justify-center py-3.5 text-base" onClick={() => onMarkCollected(nextStop.id)}>
        Mark Collected
      </Button>

      <div className="mt-6">
        <CollectionProgressBar progress={totalStops === 0 ? 1 : collectedCount / totalStops} />
        <p className="mt-1.5 text-xs text-muted">
          {collectedCount} of {totalStops} collected
        </p>
      </div>
    </section>
  )
}
