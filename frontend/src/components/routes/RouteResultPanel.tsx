import { ArrowRight, Leaf } from 'lucide-react'
import { Button } from '../common/Button'
import { Card } from '../common/Card'
import { Cypress, Shrub, Sparkle, Tree } from '../illustrations'
import type { CollectionRoute } from '../../types'

interface RouteResultPanelProps {
  route: CollectionRoute
  stopCount: number
  onStart: () => void
}

export function RouteResultPanel({ route, stopCount, onStart }: RouteResultPanelProps) {
  const { totalDistance, estimatedTime, distanceSaved, timeSaved } = route
  const hasSavings = (distanceSaved ?? 0) > 0 && (timeSaved ?? 0) > 0

  return (
    <section className="space-y-3.5">
      <div className="relative text-center">
        <svg viewBox="0 0 200 30" className="absolute inset-x-0 top-0 mx-auto h-7 w-48" aria-hidden="true">
          <Sparkle x={20} y={14} size={7} />
          <Sparkle x={170} y={8} size={9} delay={0.8} fill="#e7a65b" />
          <Sparkle x={186} y={24} size={5} delay={1.4} />
        </svg>
        <h2 className="pt-5 font-display text-3xl font-semibold text-primary-dark">Route Optimized</h2>
        <p className="mt-1 text-sm font-semibold text-muted">
          {stopCount} {stopCount === 1 ? 'stop' : 'stops'} to collect &mdash; a shorter, smarter route for today.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="tm-rise rounded-card bg-tint-stone/70 px-4 py-4">
          <p className="text-xs font-bold text-muted">Original Route</p>
          <p className="mt-2 font-display text-2xl font-semibold text-muted">{route.originalDistance} km</p>
          <p className="font-display text-xl font-semibold text-muted">{route.originalEstimatedTime} min</p>
        </div>
        <div className="tm-rise rounded-card bg-sage px-4 py-4" style={{ animationDelay: '0.08s' }}>
          <p className="text-xs font-bold text-primary-dark">TrashMaps Route</p>
          <p className="mt-2 font-display text-2xl font-semibold text-primary-dark">{totalDistance} km</p>
          <p className="font-display text-xl font-semibold text-primary-dark">{estimatedTime} min</p>
        </div>
      </div>

      {hasSavings && (
        <Card className="tm-rise relative flex items-center gap-3 overflow-hidden px-5 py-4" style={{ animationDelay: '0.16s' }}>
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-sage text-primary">
            <Leaf size={20} />
          </span>
          <div className="relative z-10">
            <p className="text-xs font-bold text-muted">You save</p>
            <p className="font-display text-xl font-semibold text-primary-dark">
              {distanceSaved} km <span className="text-muted">&middot;</span> {timeSaved} min
            </p>
          </div>
          <svg
            viewBox="0 0 130 90"
            className="absolute bottom-0 right-0 h-full w-auto"
            preserveAspectRatio="xMaxYMax meet"
            aria-hidden="true"
          >
            <Shrub x={30} y={92} scale={0.6} tone="light" />
            <Tree x={86} y={92} scale={0.5} sway />
            <Cypress x={118} y={92} scale={0.5} />
          </svg>
        </Card>
      )}

      <Button className="w-full py-4 text-base" onClick={onStart}>
        Start Route
        <ArrowRight size={18} />
      </Button>
    </section>
  )
}
