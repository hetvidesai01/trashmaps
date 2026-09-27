import { STATUS_COLOR, CITIZEN_SOURCE_COLOR } from '../../constants/status'

const requiresColor = STATUS_COLOR.pending
const skippedColor = STATUS_COLOR.skipped
const collectedColor = STATUS_COLOR.collected

export function PointStatusLegend() {
  return (
    <div className="absolute bottom-4 left-4 z-[400] rounded-lg border border-ink/10 bg-surface/95 px-4 py-3 shadow-lg backdrop-blur">
      <p className="text-xs font-semibold text-muted">Legend</p>
      <ul className="mt-2 space-y-1.5">
        <li className="flex items-center gap-2 text-xs text-ink">
          <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: requiresColor }} />
          Requires collection
        </li>
        <li className="flex items-center gap-2 text-xs text-ink">
          <span
            className="h-2.5 w-2.5 rounded-full bg-white"
            style={{ border: `2px solid ${skippedColor}`, opacity: 0.75 }}
          />
          Skipped
        </li>
        <li className="flex items-center gap-2 text-xs text-ink">
          <span
            className="flex h-2.5 w-2.5 items-center justify-center rounded-full text-[6px] text-white"
            style={{ backgroundColor: collectedColor }}
          >
            ✓
          </span>
          Collected
        </li>
        <li className="flex items-center gap-2 text-xs text-ink">
          <span className="h-2 w-2 rotate-45" style={{ backgroundColor: CITIZEN_SOURCE_COLOR }} />
          Citizen added
        </li>
        <li className="flex items-center gap-2 text-xs text-ink">
          <span className="h-2.5 w-2.5 rounded-[3px] bg-primary-dark" />
          Depot
        </li>
        <li className="flex items-center gap-2 text-xs text-ink">
          <span
            className="h-0 w-4 border-t-2"
            style={{ borderColor: '#6B7280', borderStyle: 'dashed', opacity: 0.7 }}
          />
          Original route
        </li>
      </ul>
    </div>
  )
}
