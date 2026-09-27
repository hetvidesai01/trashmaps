import { Marker, Popup } from 'react-leaflet'
import { StatusBadge } from '../common/StatusBadge'
import { pointIcon } from './pointIcon'
import type { CollectionPoint } from '../../types'

interface CollectionPointMarkerProps {
  point: CollectionPoint
}

export function CollectionPointMarker({ point }: CollectionPointMarkerProps) {
  return (
    <Marker position={[point.latitude, point.longitude]} icon={pointIcon(point)}>
      <Popup>
        <div className="min-w-[180px] space-y-1.5">
          <p className="text-sm font-medium text-ink">{point.address}</p>
          <StatusBadge status={point.status} citizenReported={point.source === 'citizen'} />
          {point.existingRouteId && <p className="text-xs text-muted">Route {point.existingRouteId}</p>}
        </div>
      </Popup>
    </Marker>
  )
}
