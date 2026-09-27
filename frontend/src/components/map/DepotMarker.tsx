import { Marker, Popup } from 'react-leaflet'
import { depotIcon } from './pointIcon'
import type { Depot } from '../../types'

interface DepotMarkerProps {
  depot: Depot
}

export function DepotMarker({ depot }: DepotMarkerProps) {
  return (
    <Marker position={[depot.latitude, depot.longitude]} icon={depotIcon()}>
      <Popup>
        <p className="text-sm font-medium text-ink">{depot.name}</p>
        <p className="text-xs text-muted">Depot</p>
      </Popup>
    </Marker>
  )
}
