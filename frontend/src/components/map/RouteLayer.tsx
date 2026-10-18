import { Polyline } from 'react-leaflet'
import type { CollectionRoute } from '../../types'

interface RouteLayerProps {
  route: CollectionRoute
  variant: 'original' | 'optimized'
}

export function RouteLayer({ route, variant }: RouteLayerProps) {
  const stops = variant === 'original' ? route.originalStops : route.optimizedStops
  if (!stops || stops.length === 0) return null

  const positions: [number, number][] = [
    [route.depot.latitude, route.depot.longitude],
    ...stops.map((stop): [number, number] => [stop.latitude, stop.longitude]),
    [route.depot.latitude, route.depot.longitude],
  ]

  return (
    <Polyline
      positions={positions}
      pathOptions={
        variant === 'original'
          ? { color: '#8a8f84', weight: 3, dashArray: '2 9', lineCap: 'round', opacity: 0.8 }
          : { color: '#176b4d', weight: 5, opacity: 0.92, lineCap: 'round', lineJoin: 'round' }
      }
    />
  )
}
