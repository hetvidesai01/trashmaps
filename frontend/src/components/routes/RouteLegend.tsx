import { CITIZEN_SOURCE_COLOR, STATUS_COLOR } from '../../constants/status'

interface RouteLegendProps {
  showOriginal: boolean
}

/** Small key sitting under the map (never over it). */
export function RouteLegend({ showOriginal }: RouteLegendProps) {
  return (
    <ul className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-1.5 px-1 text-[11px] font-bold text-muted">
      <li className="flex items-center gap-1.5">
        <span className="h-3 w-3 rounded-full" style={{ backgroundColor: STATUS_COLOR.pending }} />
        Stop to collect
      </li>
      <li className="flex items-center gap-1.5">
        <span className="h-3 w-3 rounded-full" style={{ backgroundColor: CITIZEN_SOURCE_COLOR }} />
        Citizen report
      </li>
      <li className="flex items-center gap-1.5">
        <span className="h-3 w-3 rounded-full opacity-60" style={{ backgroundColor: STATUS_COLOR.skipped }} />
        Skipped stop
      </li>
      <li className="flex items-center gap-1.5">
        <span className="h-3 w-3 rounded bg-primary-dark" />
        Depot
      </li>
      {showOriginal && (
        <li className="flex items-center gap-1.5">
          <span className="w-4 border-t-2 border-dotted border-muted" />
          Original route
        </li>
      )}
    </ul>
  )
}
