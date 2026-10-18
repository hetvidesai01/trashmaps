import { divIcon } from 'leaflet'
import { STATUS_COLOR, CITIZEN_SOURCE_COLOR } from '../../constants/status'
import type { CollectionPoint } from '../../types'

const SHADOW = 'box-shadow:0 2px 6px rgba(25,45,35,0.35)'

const CHECK_SVG = `<svg width="11" height="11" viewBox="0 0 16 16" fill="none" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M3 8.5 6.5 12 13 4"/></svg>`

const PERSON_SVG = `<svg width="13" height="13" viewBox="0 0 24 24" fill="white"><circle cx="12" cy="8" r="4.2"/><path d="M4 21c0-4.400 3.600-7 8-7s8 2.600 8 7Z"/></svg>`

const TRUCK_SVG = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 18V6a1 1 0 0 0-1-1H3a1 1 0 0 0-1 1v11a1 1 0 0 0 1 1h1"/><path d="M14 9h4l4 4v4a1 1 0 0 1-1 1h-1"/><circle cx="7" cy="18" r="2"/><circle cx="17" cy="18" r="2"/></svg>`

// Stop to collect, in route order — solid green numbered circle.
const NUMBERED_CIRCLE = (color: string, order: number) =>
  `<span style="display:flex;align-items:center;justify-content:center;width:28px;height:28px;border-radius:9999px;background:${color};border:2.5px solid white;${SHADOW};color:white;font:800 12px/1 Nunito,sans-serif">${order}</span>`

// Stop to collect, no sequence yet.
const SOLID_CIRCLE = (color: string) =>
  `<span style="display:block;width:18px;height:18px;border-radius:9999px;background:${color};border:2.5px solid white;${SHADOW}"></span>`

// Skipped — quiet grey ring so it recedes behind active stops.
const MUTED_CIRCLE = (color: string) =>
  `<span style="display:block;width:18px;height:18px;border-radius:9999px;background:${color};border:2.5px solid white;opacity:0.55"></span>`

// Collected — soft green with a check.
const CHECK_CIRCLE = (color: string) =>
  `<span style="display:flex;align-items:center;justify-content:center;width:22px;height:22px;border-radius:9999px;background:${color};border:2.5px solid white;${SHADOW}">${CHECK_SVG}</span>`

// Citizen report — orange circle, with the stop number once sequenced.
const CITIZEN_CIRCLE = (order?: number) =>
  `<span style="display:flex;align-items:center;justify-content:center;width:${order != null ? 28 : 24}px;height:${order != null ? 28 : 24}px;border-radius:9999px;background:${CITIZEN_SOURCE_COLOR};border:2.5px solid white;${SHADOW};color:white;font:800 12px/1 Nunito,sans-serif">${order != null ? order : PERSON_SVG}</span>`

export function pointIcon(point: CollectionPoint, orderLabel?: number, highlight = false) {
  const className = `tm-marker${highlight ? ' tm-marker-next' : ''}`

  if (point.source === 'citizen' && point.status !== 'collected') {
    const size = orderLabel != null ? 28 : 24
    return divIcon({
      className,
      html: CITIZEN_CIRCLE(orderLabel),
      iconSize: [size, size],
      iconAnchor: [size / 2, size / 2],
    })
  }

  const color = STATUS_COLOR[point.status]

  if (orderLabel != null) {
    return divIcon({
      className,
      html: NUMBERED_CIRCLE(color, orderLabel),
      iconSize: [28, 28],
      iconAnchor: [14, 14],
    })
  }

  if (point.status === 'collected') {
    return divIcon({ className, html: CHECK_CIRCLE(color), iconSize: [22, 22], iconAnchor: [11, 11] })
  }

  return divIcon({
    className,
    html: point.status === 'skipped' ? MUTED_CIRCLE(color) : SOLID_CIRCLE(color),
    iconSize: [18, 18],
    iconAnchor: [9, 9],
  })
}

export function depotIcon() {
  return divIcon({
    className: 'tm-marker',
    html: `<span style="display:flex;align-items:center;justify-content:center;width:34px;height:34px;border-radius:12px;background:#194d3c;border:2.5px solid white;${SHADOW}">${TRUCK_SVG}</span>`,
    iconSize: [34, 34],
    iconAnchor: [17, 17],
  })
}

/** Marker used while a citizen is choosing a report's location on the map. */
export function citizenPinIcon() {
  return divIcon({
    className: 'tm-marker',
    html: `<span style="display:flex;align-items:center;justify-content:center;width:28px;height:28px;border-radius:9999px;background:${CITIZEN_SOURCE_COLOR};border:3px solid white;${SHADOW}">${PERSON_SVG}</span>`,
    iconSize: [28, 28],
    iconAnchor: [14, 14],
  })
}
