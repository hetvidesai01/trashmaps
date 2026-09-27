import { Marker, useMapEvents } from 'react-leaflet'
import { citizenPinIcon } from './pointIcon'

interface LocationPickerProps {
  position: [number, number]
  onChange: (position: [number, number]) => void
}

function ClickCapture({ onChange }: { onChange: (position: [number, number]) => void }) {
  useMapEvents({
    click(event) {
      onChange([event.latlng.lat, event.latlng.lng])
    },
  })
  return null
}

/** A small interactive map letting a citizen place/adjust their report's location. */
export function LocationPicker({ position, onChange }: LocationPickerProps) {
  return (
    <>
      <ClickCapture onChange={onChange} />
      <Marker position={position} icon={citizenPinIcon()} />
    </>
  )
}
