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

const HOME_SVG = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M3 10.5 12 3l9 7.5"/><path d="M5 9.5V20a1 1 0 0 0 1 1h4v-6h4v6h4a1 1 0 0 0 1-1V9.5"/></svg>`

export function depotIcon() {
  return divIcon({
    className: '',
    html: `<span style="display:flex;align-items:center;justify-content:center;width:26px;height:26px;border-radius:8px;background:#145C38;border:2px solid white;box-shadow:0 2px 6px rgba(0,0,0,0.4)">${HOME_SVG}</span>`,
    iconSize: [26, 26],
    iconAnchor: [13, 13],
  })
}
