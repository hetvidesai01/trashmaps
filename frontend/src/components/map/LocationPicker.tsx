import { useEffect } from 'react'
import { Marker, useMap, useMapEvents } from 'react-leaflet'
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

/** Keeps the pin in view when it is moved by something other than a map click (e.g. "use my location"). */
function KeepInView({ position }: { position: [number, number] }) {
  const map = useMap()
  useEffect(() => {
    if (!map.getBounds().contains(position)) map.panTo(position)
  }, [map, position])
  return null
}

/** A small interactive map letting a citizen place/adjust their report's location. */
export function LocationPicker({ position, onChange }: LocationPickerProps) {
  return (
    <>
      <ClickCapture onChange={onChange} />
      <KeepInView position={position} />
      <Marker position={position} icon={citizenPinIcon()} />
    </>
  )
}
