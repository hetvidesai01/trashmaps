import { useEffect } from 'react'
import { useMap } from 'react-leaflet'
import { latLngBounds } from 'leaflet'

interface FitBoundsProps {
  points: [number, number][]
  /** Re-fit only when this changes (e.g. the selected route), not on every marker update. */
  fitKey: string
}

/** Frames the map around a set of points so a route is visible at a glance. */
export function FitBounds({ points, fitKey }: FitBoundsProps) {
  const map = useMap()

  useEffect(() => {
    if (points.length === 0) return
    map.fitBounds(latLngBounds(points), { padding: [48, 48], maxZoom: 15, animate: false })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map, fitKey])

  return null
}
