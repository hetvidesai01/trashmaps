import { divIcon } from 'leaflet'
import { STATUS_COLOR, CITIZEN_SOURCE_COLOR } from '../../constants/status'
import type { CollectionPoint } from '../../types'

const CIRCLE_HTML = (color: string) =>
  `<span style="display:block;width:14px;height:14px;border-radius:9999px;background:${color};border:2px solid white;box-shadow:0 1px 4px rgba(0,0,0,0.35)"></span>`

const DIAMOND_HTML = (color: string) =>
  `<span style="display:block;width:12px;height:12px;transform:rotate(45deg);background:${color};border:2px solid white;box-shadow:0 1px 4px rgba(0,0,0,0.35)"></span>`

export function pointIcon(point: CollectionPoint) {
  if (point.source === 'citizen') {
    return divIcon({
      className: '',
      html: DIAMOND_HTML(CITIZEN_SOURCE_COLOR),
      iconSize: [14, 14],
      iconAnchor: [7, 7],
    })
  }

  return divIcon({
    className: '',
    html: CIRCLE_HTML(STATUS_COLOR[point.status]),
    iconSize: [14, 14],
    iconAnchor: [7, 7],
  })
}
