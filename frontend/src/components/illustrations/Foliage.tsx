/**
 * Foliage primitives shared by every illustration. Tree / Shrub / Leaf render
 * <g> groups so they can be composed inside any parent <svg>.
 */

export const GREENS = {
  deep: '#2c7048',
  mid: '#3f8b57',
  fresh: '#5ea463',
  light: '#86bb6e',
  pale: '#b4d594',
  mist: '#d4e6bd',
  trunk: '#7b5a3c',
} as const

interface PlacedProps {
  x: number
  y: number
  scale?: number
  flip?: boolean
}

function place({ x, y, scale = 1, flip }: PlacedProps) {
  return `translate(${x} ${y}) scale(${flip ? -scale : scale} ${scale})`
}

/** Round, layered canopy tree. Origin is the base of the trunk. */
export function Tree(props: PlacedProps & { sway?: boolean }) {
  return (
    <g transform={place(props)}>
      <g className={props.sway ? 'tm-sway' : undefined}>
        <path d="M-5 0 L-3 -46 L3 -46 L5 0 Z" fill={GREENS.trunk} />
        <path d="M0 -34 L-12 -52" stroke={GREENS.trunk} strokeWidth="3" strokeLinecap="round" />
        <path d="M0 -30 L13 -46" stroke={GREENS.trunk} strokeWidth="3" strokeLinecap="round" />
        <circle cx="-22" cy="-62" r="22" fill={GREENS.mid} />
        <circle cx="22" cy="-64" r="21" fill={GREENS.mid} />
        <circle cx="0" cy="-86" r="26" fill={GREENS.fresh} />
        <circle cx="-14" cy="-70" r="20" fill={GREENS.fresh} />
        <circle cx="16" cy="-74" r="18" fill={GREENS.light} />
        <circle cx="-6" cy="-92" r="14" fill={GREENS.light} />
        <circle cx="8" cy="-100" r="8" fill={GREENS.pale} opacity="0.8" />
      </g>
    </g>
  )
}

/** Tall, slim conifer-like tree for variety against the round ones. */
export function Cypress(props: PlacedProps) {
  return (
    <g transform={place(props)}>
      <rect x="-3" y="-14" width="6" height="14" fill={GREENS.trunk} />
      <path d="M0 -118 C 20 -92 24 -50 14 -14 L-14 -14 C -24 -50 -20 -92 0 -118 Z" fill={GREENS.mid} />
      <path d="M0 -112 C 12 -90 14 -56 8 -20 L-3 -20 C -10 -56 -10 -90 0 -112 Z" fill={GREENS.fresh} />
    </g>
  )
}

/** Low bushy shrub made of overlapping blobs. */
export function Shrub(props: PlacedProps & { tone?: 'deep' | 'mid' | 'light' }) {
  const [a, b, c] =
    props.tone === 'deep'
      ? [GREENS.deep, GREENS.mid, GREENS.fresh]
      : props.tone === 'light'
        ? [GREENS.fresh, GREENS.light, GREENS.pale]
        : [GREENS.mid, GREENS.fresh, GREENS.light]
  return (
    <g transform={place(props)}>
      <ellipse cx="-18" cy="-10" rx="22" ry="14" fill={a} />
      <ellipse cx="18" cy="-9" rx="22" ry="13" fill={a} />
      <ellipse cx="0" cy="-20" rx="24" ry="18" fill={b} />
      <ellipse cx="-8" cy="-26" rx="12" ry="9" fill={c} />
    </g>
  )
}

/** Single leaf with a centre vein, pointing up from its origin. */
export function Leaf({
  x,
  y,
  scale = 1,
  rotate = 0,
  fill = GREENS.fresh,
  vein = GREENS.deep,
}: {
  x: number
  y: number
  scale?: number
  rotate?: number
  fill?: string
  vein?: string
}) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${rotate}) scale(${scale})`}>
      <path d="M0 0 C -16 -12 -14 -34 0 -48 C 14 -34 16 -12 0 0 Z" fill={fill} />
      <path d="M0 -2 L0 -40" stroke={vein} strokeWidth="1.600" strokeLinecap="round" opacity="0.55" />
    </g>
  )
}

/** Four-pointed sparkle used for success / optimise accents. */
export function Sparkle({
  x,
  y,
  size = 10,
  fill = '#f2b544',
  delay = 0,
}: {
  x: number
  y: number
  size?: number
  fill?: string
  delay?: number
}) {
  const s = size
  return (
    <path
      className="tm-twinkle"
      style={{ animationDelay: `${delay}s` }}
      d={`M${x} ${y - s} Q${x + s * 0.18} ${y - s * 0.18} ${x + s} ${y} Q${x + s * 0.18} ${y + s * 0.18} ${x} ${y + s} Q${x - s * 0.18} ${y + s * 0.18} ${x - s} ${y} Q${x - s * 0.18} ${y - s * 0.18} ${x} ${y - s} Z`}
      fill={fill}
    />
  )
}
