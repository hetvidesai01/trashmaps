import { Loader2 } from 'lucide-react'
import { Button } from '../common/Button'
import type { RouteSummary } from '../../utils/routeSummary'

interface RouteSummaryPanelProps {
  summary: RouteSummary
  onOptimize: () => void
  isOptimizing: boolean
  error: string | null
}

export function RouteSummaryPanel({ summary, onOptimize, isOptimizing, error }: RouteSummaryPanelProps) {
  const nothingLeft = summary.totalToCollect > 0 && summary.collected === summary.totalToCollect

  const rows: { value: number; label: string; accent?: string }[] = [
    { value: summary.normalStops, label: 'normal stops' },
    { value: summary.needCollection, label: 'need collection', accent: 'text-primary-dark' },
    { value: summary.skipped, label: 'can be skipped', accent: 'text-muted' },
    {
      value: summary.citizenAdded,
      label: 'citizen-reported stops added',
      accent: 'text-[color:var(--color-status-citizen)]',
    },
  ]

  return (
    <section>
      <p className="text-xs font-semibold tracking-wider text-muted">TODAY&rsquo;S ROUTE</p>

      <ul className="mt-4 space-y-3">
        {rows.map((row) => (
          <li key={row.label} className="flex items-baseline gap-3">
            <span className={`w-12 text-right font-display text-3xl font-semibold ${row.accent ?? 'text-ink'}`}>
              {row.value}
            </span>
            <span className="text-base text-ink">{row.label}</span>
          </li>
        ))}
      </ul>

      {nothingLeft ? (
        <p className="mt-8 rounded-lg bg-primary/10 px-4 py-3 text-sm font-medium text-primary-dark">
          Everything on this route has been collected.
        </p>
      ) : (
        <Button
          className="mt-8 w-full justify-center py-3.5 text-base"
          onClick={onOptimize}
          disabled={isOptimizing || summary.totalToCollect === 0}
        >
          {isOptimizing ? (
            <>
              <Loader2 size={17} className="animate-spin" />
              Optimizing&hellip;
            </>
          ) : (
            <>Optimize Today&rsquo;s Route</>
          )}
        </Button>
      )}

      {error && <p className="mt-3 text-sm text-[#D97706]">{error}</p>}
    </section>
  )
}
