import { divIcon } from 'leaflet'
import { STATUS_COLOR, CITIZEN_SOURCE_COLOR } from '../../constants/status'
import type { CollectionPoint } from '../../types'

const CHECK_SVG = `<svg width="9" height="9" viewBox="0 0 16 16" fill="none" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M3 8.5 6.5 12 13 4"/></svg>`

// Requires collection: solid, filled circle — reads as "needs attention now"
const SOLID_CIRCLE = (color: string) =>
  `<span style="display:block;width:14px;height:14px;border-radius:9999px;background:${color};border:2px solid white;box-shadow:0 1px 4px rgba(0,0,0,0.35)"></span>`

// Skipped: hollow, faded ring — reads as "present but inactive"
const FADED_RING = (color: string) =>
  `<span style="display:block;width:14px;height:14px;border-radius:9999px;background:white;border:2.5px solid ${color};opacity:0.6"></span>`

// Collected: filled circle with a check mark — reads as "done"
const CHECK_CIRCLE = (color: string) =>
  `<span style="display:flex;align-items:center;justify-content:center;width:14px;height:14px;border-radius:9999px;background:${color};border:2px solid white;box-shadow:0 1px 4px rgba(0,0,0,0.35)">${CHECK_SVG}</span>`

// Citizen-added: diamond — reads as "additional, not part of the original set"
const DIAMOND_HTML = (color: string) =>
  `<span style="display:block;width:12px;height:12px;transform:rotate(45deg);background:${color};border:2px solid white;box-shadow:0 1px 4px rgba(0,0,0,0.35)"></span>`

// Numbered variants — used for stops in the currently optimized sequence.
const NUMBERED_CIRCLE = (color: string, order: number) =>
  `<span style="display:flex;align-items:center;justify-content:center;width:20px;height:20px;border-radius:9999px;background:${color};border:2px solid white;box-shadow:0 1px 4px rgba(0,0,0,0.4);color:white;font:700 10px/1 Inter,sans-serif">${order}</span>`

const NUMBERED_DIAMOND = (color: string, order: number) =>
  `<span style="display:flex;align-items:center;justify-content:center;width:18px;height:18px;transform:rotate(45deg);background:${color};border:2px solid white;box-shadow:0 1px 4px rgba(0,0,0,0.4)"><span style="display:block;transform:rotate(-45deg);color:white;font:700 9px/1 Inter,sans-serif">${order}</span></span>`

export function pointIcon(point: CollectionPoint, orderLabel?: number) {
  if (point.source === 'citizen') {
    if (orderLabel != null) {
      return divIcon({
        className: '',
        html: NUMBERED_DIAMOND(CITIZEN_SOURCE_COLOR, orderLabel),
        iconSize: [18, 18],
        iconAnchor: [9, 9],
      })
    }
    return divIcon({
      className: '',
      html: DIAMOND_HTML(CITIZEN_SOURCE_COLOR),
      iconSize: [14, 14],
      iconAnchor: [7, 7],
    })
  }

  const color = STATUS_COLOR[point.status]

  if (orderLabel != null) {
    return divIcon({
      className: '',
      html: NUMBERED_CIRCLE(color, orderLabel),
      iconSize: [20, 20],
      iconAnchor: [10, 10],
    })
  }

  const html =
    point.status === 'skipped'
      ? FADED_RING(color)
      : point.status === 'collected'
        ? CHECK_CIRCLE(color)
        : SOLID_CIRCLE(color)

  return divIcon({ className: '', html, iconSize: [14, 14], iconAnchor: [7, 7] })
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

/** Marker used while a citizen is choosing a report's location on the map. */
export function citizenPinIcon() {
  return divIcon({
    className: '',
    html: `<span style="display:block;width:18px;height:18px;transform:rotate(45deg);background:${CITIZEN_SOURCE_COLOR};border:2.5px solid white;box-shadow:0 2px 6px rgba(0,0,0,0.4)"></span>`,
    iconSize: [18, 18],
    iconAnchor: [9, 9],
  })
}
