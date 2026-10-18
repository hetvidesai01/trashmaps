import { useEffect, useState } from 'react'
import { Check, MapPin } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button } from '../common/Button'
import { Card } from '../common/Card'
import { RecycleBin } from '../illustrations'
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
  // Brief "collected" confirmation that outlives the stop that triggered it.
  const [confirmedAt, setConfirmedAt] = useState<number | null>(null)

  useEffect(() => {
    if (confirmedAt === null) return
    const timer = window.setTimeout(() => setConfirmedAt(null), 1400)
    return () => window.clearTimeout(timer)
  }, [confirmedAt])

  const progress = totalStops === 0 ? 1 : collectedCount / totalStops

  const progressCard = (
    <Card className="p-5">
      <div className="flex items-baseline justify-between">
        <p className="text-sm font-extrabold text-ink">Collection Progress</p>
        <span key={collectedCount} className="tm-pop font-display text-lg font-semibold text-primary-dark">
          {Math.round(progress * 100)}%
        </span>
      </div>
      <p className="mt-0.5 text-xs font-semibold text-muted">
        {collectedCount} of {totalStops} stops collected
      </p>
      <div className="mt-3">
        <CollectionProgressBar progress={progress} />
      </div>
    </Card>
  )

  if (!nextStop) {
    return (
      <section className="space-y-3.5">
        <Card className="p-6 text-center">
          <span className="tm-pop mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary text-white">
            <Check size={30} strokeWidth={3} />
          </span>
          <p className="mt-4 font-display text-2xl font-semibold text-primary-dark">Route complete</p>
          <p className="mt-1 text-sm font-semibold text-muted">All {totalStops} stops have been collected.</p>
          <div className="mx-auto mt-3 w-24">
            <RecycleBin sparkles />
          </div>
          <Link to="/dashboard" className="mt-3 inline-block text-sm font-bold text-primary-dark hover:underline">
            Back to Dashboard
          </Link>
        </Card>
        {progressCard}
      </section>
    )
  }

  return (
    <section className="space-y-3.5">
      <div className="flex items-center justify-between px-1">
        <h2 className="text-lg font-extrabold text-ink">
          Stop {stopNumber} of {totalStops}
        </h2>
        <span className="rounded-full bg-sage px-3 py-1 text-xs font-bold text-primary-dark">Next stop</span>
      </div>

      <Card key={nextStop.id} className="tm-rise flex items-center gap-4 p-4">
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-sage text-primary">
          <MapPin size={22} />
        </span>
        <div className="min-w-0">
          <p className="text-base font-extrabold leading-tight text-ink">{nextStop.address}</p>
          {distanceAwayKm != null && (
            <p className="mt-0.5 text-sm font-semibold text-muted">{distanceAwayKm.toFixed(1)} km away</p>
          )}
        </div>
      </Card>

      <div className="relative">
        {confirmedAt !== null && (
          <span
            key={confirmedAt}
            className="tm-pop pointer-events-none absolute -top-9 left-1/2 z-10 flex -translate-x-1/2 items-center gap-1.5 whitespace-nowrap rounded-full bg-primary px-3.5 py-1.5 text-xs font-bold text-white shadow-lift"
          >
            <Check size={14} strokeWidth={3} />
            Stop collected
          </span>
        )}
        <Button
          className="w-full py-4 text-base"
          onClick={() => {
            onMarkCollected(nextStop.id)
            setConfirmedAt(Date.now())
          }}
        >
          Mark Collected
          <Check size={18} strokeWidth={3} />
        </Button>
      </div>

      {progressCard}
    </section>
  )
}
