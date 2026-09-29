import { Marker, Popup } from 'react-leaflet'
import { StatusBadge } from '../common/StatusBadge'
import { pointIcon } from './pointIcon'
import { formatDateTime } from '../../utils/format'
import type { CollectionPoint } from '../../types'

interface CollectionPointMarkerProps {
  point: CollectionPoint
  /**
   * When provided, the marker calls this on click instead of opening its own
   * popup — the caller is expected to render a PointDetailPanel for the
   * selected point (used on the Waste Map). Omit to keep the built-in popup
   * (used for the lightweight Dashboard map preview).
   */
  onSelect?: (point: CollectionPoint) => void
  /** Stop number within the currently optimized sequence, if any. */
  orderLabel?: number
  /** Plain-language popup (address + one short label) instead of the full detail popup. */
  simple?: boolean
}

function simpleLabel(point: CollectionPoint): string {
  if (point.status === 'collected') return 'Collected'
  if (point.status === 'skipped') return 'Skipped today'
  return point.source === 'citizen' ? 'Citizen report' : 'Needs collection'
}

export function CollectionPointMarker({ point, onSelect, orderLabel, simple }: CollectionPointMarkerProps) {
  if (simple) {
    return (
      <Marker position={[point.latitude, point.longitude]} icon={pointIcon(point, orderLabel)}>
        <Popup>
          <p className="text-sm font-medium text-ink">{point.address}</p>
          <p className="text-xs text-muted">{simpleLabel(point)}</p>
        </Popup>
      </Marker>
    )
  }

  if (onSelect) {
    return (
      <Marker
        position={[point.latitude, point.longitude]}
        icon={pointIcon(point, orderLabel)}
        eventHandlers={{ click: () => onSelect(point) }}
      />
    )
  }

  return (
    <Marker position={[point.latitude, point.longitude]} icon={pointIcon(point, orderLabel)}>
      <Popup>
        <div className="min-w-[200px] space-y-1.5">
          <p className="text-sm font-medium text-ink">{point.address}</p>
          <StatusBadge status={point.status} citizenReported={point.source === 'citizen'} />
          <dl className="mt-1.5 space-y-1 text-xs text-muted">
            <div className="flex justify-between gap-3">
              <dt>Source</dt>
              <dd className="text-ink">{point.source === 'citizen' ? 'Citizen report' : 'Existing route'}</dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt>Requires collection</dt>
              <dd className="text-ink">{point.requiresCollection ? 'Yes' : 'No'}</dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt>Last collected</dt>
              <dd className="text-ink">{formatDateTime(point.lastCollected)}</dd>
            </div>
            {point.existingRouteId && (
              <div className="flex justify-between gap-3">
                <dt>Route</dt>
                <dd className="text-ink">{point.existingRouteId}</dd>
              </div>
            )}
          </dl>
        </div>
      </Popup>
    </Marker>
  )
}
