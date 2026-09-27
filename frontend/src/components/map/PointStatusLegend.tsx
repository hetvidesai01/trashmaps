import { STATUS_COLOR, STATUS_LABEL, CITIZEN_SOURCE_COLOR } from '../../constants/status'
import type { CollectionStatus } from '../../types'

const STATUSES = Object.keys(STATUS_LABEL) as CollectionStatus[]

export function PointStatusLegend() {
  return (
    <div className="absolute bottom-4 left-4 z-[400] rounded-lg border border-ink/10 bg-surface/95 px-4 py-3 shadow-lg backdrop-blur">
      <p className="text-xs font-semibold text-muted">Point status</p>
      <ul className="mt-2 space-y-1.5">
        {STATUSES.map((status) => (
          <li key={status} className="flex items-center gap-2 text-xs text-ink">
            <span
              className="h-2.5 w-2.5 rounded-full"
              style={{ backgroundColor: STATUS_COLOR[status] }}
            />
            {STATUS_LABEL[status]}
          </li>
        ))}
        <li className="flex items-center gap-2 text-xs text-ink">
          <span
            className="h-2 w-2 rotate-45"
            style={{ backgroundColor: CITIZEN_SOURCE_COLOR }}
          />
          Citizen added
        </li>
      </ul>
    </div>
  )
}
