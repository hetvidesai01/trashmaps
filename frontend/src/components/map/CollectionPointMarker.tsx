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
}

export function CollectionPointMarker({ point, onSelect }: CollectionPointMarkerProps) {
  if (onSelect) {
    return (
      <Marker
        position={[point.latitude, point.longitude]}
        icon={pointIcon(point)}
        eventHandlers={{ click: () => onSelect(point) }}
      />
    )
  }

  return (
    <Marker position={[point.latitude, point.longitude]} icon={pointIcon(point)}>
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
