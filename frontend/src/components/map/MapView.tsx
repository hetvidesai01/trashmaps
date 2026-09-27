import type { ReactNode } from 'react'
import { MapContainer, TileLayer } from 'react-leaflet'
import { MUMBAI_CENTER, DEFAULT_ZOOM } from '../../constants/map'

interface MapViewProps {
  center?: [number, number]
  zoom?: number
  scrollWheelZoom?: boolean
  className?: string
  children?: ReactNode
}

export function MapView({
  center = MUMBAI_CENTER,
  zoom = DEFAULT_ZOOM,
  scrollWheelZoom = true,
  className = 'h-full w-full',
  children,
}: MapViewProps) {
  return (
    <MapContainer center={center} zoom={zoom} scrollWheelZoom={scrollWheelZoom} className={className}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {children}
    </MapContainer>
  )
}
