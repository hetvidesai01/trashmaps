import { Loader2, Sparkles } from 'lucide-react'
import { Button } from '../common/Button'
import { Card } from '../common/Card'
import { GarbageTruck } from '../illustrations'
import type { RouteSummary } from '../../utils/routeSummary'

interface RouteSummaryPanelProps {
  summary: RouteSummary
  onOptimize: () => void
  isOptimizing: boolean
  error: string | null
}

export function RouteSummaryPanel({ summary, onOptimize, isOptimizing, error }: RouteSummaryPanelProps) {
  const nothingLeft = summary.totalToCollect > 0 && summary.collected === summary.totalToCollect

  return (
    <Card className="p-5">
      <div className="mx-auto w-40">
        <GarbageTruck />
      </div>
      <p className="mt-3 text-center text-base font-extrabold text-ink">
        {summary.totalToCollect} {summary.totalToCollect === 1 ? 'stop' : 'stops'} to visit today
      </p>
      <p className="mt-1 text-center text-sm font-semibold text-muted">
        {summary.skipped > 0
          ? `${summary.skipped} ${summary.skipped === 1 ? 'stop' : 'stops'} can be skipped.`
          : 'Every normal stop needs a visit.'}
      </p>

      {nothingLeft ? (
        <p className="mt-5 rounded-2xl bg-sage px-4 py-3 text-center text-sm font-bold text-primary-dark">
          Everything on this route has been collected.
        </p>
      ) : (
        <Button
          className="mt-5 w-full py-4 text-base"
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

      {error && <p className="mt-3 text-center text-sm font-semibold text-[#b9731d]">{error}</p>}
    </Card>
  )
}
