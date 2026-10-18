import { useEffect, useRef } from 'react'
import { useMap } from 'react-leaflet'
import { latLngBounds } from 'leaflet'

interface FitBoundsProps {
  points: [number, number][]
  /** Re-fit only when this changes (e.g. the selected route), not on every marker update. */
  fitKey: string
}

/**
 * Frames the map around a set of points so a route is visible at a glance, and
 * keeps Leaflet's idea of the container size in sync (phone rotation,
 * breakpoint switches, the full-bleed mobile layout). While the user has not
 * panned/zoomed, a container resize re-frames the route.
 */
export function FitBounds({ points, fitKey }: FitBoundsProps) {
  const map = useMap()
  const pointsRef = useRef(points)
  pointsRef.current = points
  const userMoved = useRef(false)
  const programmatic = useRef(false)

  useEffect(() => {
    function fit() {
      const current = pointsRef.current
      if (current.length === 0) return
      const isPhone = window.innerWidth < 1024
      programmatic.current = true
      map.fitBounds(latLngBounds(current), {
        paddingTopLeft: [48, isPhone ? 110 : 48],
        paddingBottomRight: [48, isPhone ? 260 : 48],
        maxZoom: 15,
        animate: false,
      })
      programmatic.current = false
    }

    function markUserMoved() {
      if (!programmatic.current) userMoved.current = true
    }

    userMoved.current = false
    map.invalidateSize(false)
    fit()

    const observer = new ResizeObserver(() => {
      map.invalidateSize(false)
      if (!userMoved.current) fit()
    })
    observer.observe(map.getContainer())
    map.on('dragstart zoomstart', markUserMoved)

    return () => {
      observer.disconnect()
      map.off('dragstart zoomstart', markUserMoved)
    }
  }, [map, fitKey])

  return null
}
