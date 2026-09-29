import { CITIZEN_SOURCE_COLOR, STATUS_COLOR } from '../../constants/status'

interface RouteLegendProps {
  showOriginal: boolean
}

export function RouteLegend({ showOriginal }: RouteLegendProps) {
  return (
    <div className="absolute bottom-3 left-3 z-[400] rounded-lg bg-surface/95 px-3 py-2 shadow backdrop-blur">
      <ul className="space-y-1 text-xs text-ink">
        <li className="flex items-center gap-2">
          <span
            className="flex h-3.5 w-3.5 items-center justify-center rounded-full text-[8px] font-bold text-white"
            style={{ backgroundColor: STATUS_COLOR.pending }}
          >
            1
          </span>
          Needs collection
        </li>
        <li className="flex items-center gap-2">
          <span className="ml-0.5 h-2.5 w-2.5 rotate-45" style={{ backgroundColor: CITIZEN_SOURCE_COLOR }} />
          Citizen report
        </li>
        <li className="flex items-center gap-2">
          <span
            className="h-3.5 w-3.5 rounded-full border-2 bg-white opacity-60"
            style={{ borderColor: STATUS_COLOR.skipped }}
          />
          Skipped
        </li>
        {showOriginal && (
          <li className="flex items-center gap-2">
            <span className="w-3.5 border-t-2 border-dashed border-muted/70" />
            Original route
          </li>
        )}
      </ul>
    </div>
  )
}
