import { useEffect, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { Check, ChevronUp, Loader2, MapPin, Sparkles } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button } from '../common/Button'
import { CollectionProgressBar } from './CollectionProgressBar'
import { RouteLegend } from './RouteLegend'
import { RouteStatStrip } from './RouteStatStrip'
import { RouteStopList } from './RouteStopList'
import type { CollectionPoint, CollectionRoute } from '../../types'
import type { RouteSummary } from '../../utils/routeSummary'

interface MobileRouteSheetProps {
  phase: 'plan' | 'ready' | 'collecting'
  route: CollectionRoute
  summary: RouteSummary
  orderedStops: CollectionPoint[] | null
  nextStop: CollectionPoint | null
  nextStopIndex: number
  orderedCollected: number
  distanceAwayKm: number | null
  isOptimizing: boolean
  error: string | null
  showOriginal: boolean
  routeSelect: ReactNode
  onOptimize: () => void
  onStart: () => void
  onMarkCollected: (pointId: string) => void
}

/**
 * Phone layout for the route screen: the map owns the screen and this sheet
 * docks above the tab bar. The "peek" (always visible) holds the one thing to
 * do next; dragging/tapping the handle reveals everything else.
 */
export function MobileRouteSheet({
  phase,
  route,
  summary,
  orderedStops,
  nextStop,
  nextStopIndex,
  orderedCollected,
  distanceAwayKm,
  isOptimizing,
  error,
  showOriginal,
  routeSelect,
  onOptimize,
  onStart,
  onMarkCollected,
}: MobileRouteSheetProps) {
  const [expanded, setExpanded] = useState(false)
  const [confirmedAt, setConfirmedAt] = useState<number | null>(null)
  const touchStartY = useRef<number | null>(null)

  useEffect(() => {
    if (confirmedAt === null) return
    const timer = window.setTimeout(() => setConfirmedAt(null), 1400)
    return () => window.clearTimeout(timer)
  }, [confirmedAt])

  const totalStops = orderedStops?.length ?? 0
  const progress = totalStops === 0 ? 1 : orderedCollected / totalStops
  const nothingLeft = summary.totalToCollect > 0 && summary.collected === summary.totalToCollect
  const hasSavings = (route.distanceSaved ?? 0) > 0 && (route.timeSaved ?? 0) > 0

  function onTouchEnd(endY: number) {
    if (touchStartY.current === null) return
    const delta = endY - touchStartY.current
    touchStartY.current = null
    if (delta < -24) setExpanded(true)
    else if (delta > 24) setExpanded(false)
  }

  return (
    <section
      aria-label="Route details"
      className="fixed inset-x-0 bottom-[var(--bottom-nav-h)] z-[800] mx-auto max-w-2xl rounded-t-[1.75rem] border border-b-0 border-line/80 bg-surface shadow-[0_-12px_32px_rgba(36,53,46,0.16)] lg:hidden"
    >
      <button
        type="button"
        onClick={() => setExpanded((open) => !open)}
        onTouchStart={(event) => (touchStartY.current = event.touches[0].clientY)}
        onTouchEnd={(event) => onTouchEnd(event.changedTouches[0].clientY)}
        aria-expanded={expanded}
        aria-label={expanded ? 'Collapse route details' : 'Expand route details'}
        className="flex h-11 w-full items-center justify-center"
      >
        <span className="relative block h-1.5 w-11 rounded-full bg-ink/15">
          <ChevronUp
            size={16}
            className={`absolute left-1/2 top-2 -translate-x-1/2 text-muted transition-transform duration-300 ${
              expanded ? 'rotate-180' : ''
            }`}
          />
        </span>
      </button>

      {/* Peek: the single next action for the current phase */}
      <div className="px-4 pb-4">
        {phase === 'plan' && (
          <>
            <div className="flex items-baseline justify-between gap-3">
              <p className="text-lg font-extrabold text-ink">
                {summary.totalToCollect} {summary.totalToCollect === 1 ? 'stop' : 'stops'} to visit
              </p>
              <p className="text-xs font-bold text-muted">
                {summary.skipped} can be skipped
              </p>
            </div>
            {nothingLeft ? (
              <p className="mt-3 rounded-2xl bg-sage px-4 py-3 text-center text-sm font-bold text-primary-dark">
                Everything on this route has been collected.
              </p>
            ) : (
              <Button
                className="mt-3 w-full py-4 text-base"
                onClick={onOptimize}
                disabled={isOptimizing || summary.totalToCollect === 0}
              >
                {isOptimizing ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Optimizing&hellip;
                  </>
                ) : (
                  <>
                    Optimize Today&rsquo;s Route
                    <Sparkles size={17} className="text-sun" />
                  </>
                )}
              </Button>
            )}
            {error && <p className="mt-2 text-center text-sm font-semibold text-[#b9731d]">{error}</p>}
          </>
        )}

        {phase === 'ready' && (
          <>
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="font-display text-xl font-semibold text-primary-dark">Route Optimized</p>
                <p className="text-sm font-bold text-ink">
                  {route.totalDistance} km &middot; {route.estimatedTime} min
                </p>
              </div>
              {hasSavings && (
                <span className="rounded-full bg-sage px-3 py-1.5 text-xs font-bold text-primary-dark">
                  Saves {route.distanceSaved} km
                </span>
              )}
            </div>
            <Button className="mt-3 w-full py-4 text-base" onClick={onStart}>
              Start Route
            </Button>
          </>
        )}

        {phase === 'collecting' &&
          (nextStop ? (
            <>
              <div className="flex items-center justify-between">
                <p className="text-xs font-extrabold uppercase tracking-wide text-primary">
                  Stop {nextStopIndex + 1} of {totalStops}
                </p>
                <p className="text-xs font-bold text-muted">
                  {orderedCollected} of {totalStops} collected
                </p>
              </div>
              <div key={nextStop.id} className="tm-rise mt-2 flex items-center gap-3 rounded-2xl bg-sage-soft p-3.5">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white text-primary">
                  <MapPin size={24} />
                </span>
                <div className="min-w-0">
                  <p className="text-lg font-extrabold leading-tight text-ink">{nextStop.address}</p>
                  {distanceAwayKm != null && (
                    <p className="text-sm font-semibold text-muted">{distanceAwayKm.toFixed(1)} km away</p>
                  )}
                </div>
              </div>
              <div className="mt-3">
                <CollectionProgressBar progress={progress} />
              </div>
              <div className="relative mt-3">
                {confirmedAt !== null && (
                  <span
                    key={confirmedAt}
                    className="tm-pop pointer-events-none absolute -top-10 left-1/2 z-10 flex -translate-x-1/2 items-center gap-1.5 whitespace-nowrap rounded-full bg-primary px-3.5 py-1.5 text-xs font-bold text-white shadow-lift"
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
            </>
          ) : (
            <div className="py-1 text-center">
              <span className="tm-pop mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary text-white">
                <Check size={26} strokeWidth={3} />
              </span>
              <p className="mt-2 font-display text-xl font-semibold text-primary-dark">Route complete</p>
              <p className="text-sm font-semibold text-muted">All {totalStops} stops collected.</p>
              <Link to="/dashboard" className="mt-1 inline-flex min-h-11 items-center text-sm font-bold text-primary-dark">
                Back to Dashboard
              </Link>
            </div>
          ))}
      </div>

      {/* Details: smooth height transition via grid rows */}
      <div
        className={`grid transition-[grid-template-rows] duration-300 ease-out ${
          expanded ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
        }`}
        aria-hidden={!expanded}
      >
        <div className="min-h-0 overflow-hidden">
          <div className="max-h-[42svh] space-y-4 overflow-y-auto border-t border-line/70 px-4 pb-5 pt-4">
            {phase !== 'collecting' && <RouteStatStrip summary={summary} />}

            {phase === 'ready' && (
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-card bg-tint-stone/70 px-4 py-3">
                  <p className="text-xs font-bold text-muted">Original</p>
                  <p className="font-display text-lg font-semibold text-muted">
                    {route.originalDistance} km &middot; {route.originalEstimatedTime} min
                  </p>
                </div>
                <div className="rounded-card bg-sage px-4 py-3">
                  <p className="text-xs font-bold text-primary-dark">TrashMaps</p>
                  <p className="font-display text-lg font-semibold text-primary-dark">
                    {route.totalDistance} km &middot; {route.estimatedTime} min
                  </p>
                </div>
              </div>
            )}

            {phase === 'collecting' && orderedStops && (
              <RouteStopList stops={orderedStops} nextStopId={nextStop?.id ?? null} />
            )}

            {phase === 'collecting' && nextStop && (
              <button
                type="button"
                onClick={onOptimize}
                disabled={isOptimizing}
                className="min-h-11 w-full rounded-2xl text-sm font-bold text-muted transition-colors hover:bg-ink/5 hover:text-ink disabled:opacity-50"
              >
                {isOptimizing ? 'Recalculating\u2026' : 'Recalculate remaining route'}
              </button>
            )}

            {phase !== 'collecting' && routeSelect}

            <RouteLegend showOriginal={Boolean(orderedStops) && showOriginal} />
            <p className="text-[11px] font-semibold text-muted">
              Map &copy;{' '}
              <a href="https://www.openstreetmap.org/copyright" className="inline-flex min-h-11 items-center px-1 underline">
                OpenStreetMap
              </a>{' '}
              contributors
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
