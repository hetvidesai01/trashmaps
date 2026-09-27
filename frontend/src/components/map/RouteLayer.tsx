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
          ? { color: '#6B7280', weight: 2, dashArray: '6 8', opacity: 0.6 }
          : { color: '#1E7A4C', weight: 4, opacity: 0.9 }
      }
    />
  )
}
