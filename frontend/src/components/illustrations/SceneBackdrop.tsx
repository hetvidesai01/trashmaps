import { Cypress, GREENS, Shrub, Tree } from './Foliage'

interface SceneBackdropProps {
  /** Intrinsic canvas size; trees hug the left/right edges of whatever it is. */
  width: number
  height: number
  className?: string
}

const BUILDINGS: [number, number][] = [
  [0.0, 0.1],
  [0.05, 0.16],
  [0.1, 0.12],
  [0.15, 0.22],
  [0.21, 0.14],
  [0.26, 0.19],
  [0.32, 0.11],
  [0.37, 0.25],
  [0.43, 0.15],
  [0.48, 0.2],
  [0.54, 0.12],
  [0.59, 0.18],
]

/**
 * Layered green cityscape: pale sky, hazy skyline, rolling hills, a winding
 * path and framing trees. Used as the welcome-screen backdrop.
 */
export function SceneBackdrop({ width: w, height: h, className = '' }: SceneBackdropProps) {
  const s = h / 800
  const horizon = h * 0.5
  const skylineW = Math.min(w * 0.6, 640)
  const skylineX = (w - skylineW) / 2
  const bw = skylineW / BUILDINGS.length

  return (
    <svg
      viewBox={`0 0 ${w} ${h}`}
      preserveAspectRatio="xMidYMax slice"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      <rect width={w} height={h} fill="#f3f4e4" />
      <ellipse cx={w * 0.5} cy={horizon - 60 * s} rx={w * 0.45} ry={170 * s} fill="#eaf0d8" />

      {/* Hazy skyline */}
      <g opacity="0.85">
        {BUILDINGS.map(([x, tall], i) => (
          <rect
            key={i}
            x={skylineX + x * (skylineW / 0.64)}
            y={horizon - tall * h * 0.75}
            width={bw * 0.85}
            height={tall * h * 0.75 + 10}
            rx="3"
            fill={i % 2 ? '#cbdcc3' : '#d6e4cd'}
          />
        ))}
      </g>

      {/* Far hills */}
      <path
        d={`M0 ${horizon + 20 * s} Q${w * 0.25} ${horizon - 40 * s} ${w * 0.5} ${horizon + 10 * s} T${w} ${horizon - 10 * s} V${h} H0 Z`}
        fill="#d4e5bf"
      />
      {/* Mid hills */}
      <path
        d={`M0 ${horizon + 90 * s} Q${w * 0.3} ${horizon + 30 * s} ${w * 0.6} ${horizon + 80 * s} T${w} ${horizon + 50 * s} V${h} H0 Z`}
        fill="#bcd9a0"
      />
      {/* Winding path */}
      <path
        d={`M${w * 0.5 - 14} ${horizon + 70 * s} C${w * 0.3} ${horizon + 150 * s}, ${w * 0.78} ${horizon + 210 * s}, ${w * 0.42} ${h} L${w * 0.7} ${h} C${w * 0.86} ${horizon + 220 * s}, ${w * 0.4} ${horizon + 130 * s}, ${w * 0.5 + 14} ${horizon + 70 * s} Z`}
        fill="#efe9c8"
      />
      {/* Near hill */}
      <path
        d={`M0 ${h * 0.82} Q${w * 0.2} ${h * 0.74} ${w * 0.4} ${h * 0.84} T${w} ${h * 0.8} V${h} H0 Z`}
        fill="#a2cb86"
        opacity="0.9"
      />
      <path d={`M0 ${h * 0.92} Q${w * 0.3} ${h * 0.86} ${w * 0.6} ${h * 0.93} T${w} ${h * 0.9} V${h} H0 Z`} fill={GREENS.light} />

      {/* Left framing trees */}
      <Tree x={w * 0.02} y={h * 0.72} scale={2.3 * s} />
      <Tree x={w * 0.14} y={h * 0.66} scale={1.2 * s} />
      <Cypress x={w * 0.08} y={h * 0.6} scale={1.1 * s} />
      <Shrub x={w * 0.07} y={h * 0.82} scale={1.7 * s} tone="deep" />
      <Shrub x={w * 0.2} y={h * 0.7} scale={0.9 * s} />

      {/* Right framing trees */}
      <Tree x={w * 0.98} y={h * 0.68} scale={2.1 * s} flip />
      <Tree x={w * 0.86} y={h * 0.64} scale={1.1 * s} flip />
      <Cypress x={w * 0.93} y={h * 0.58} scale={1.2 * s} />
      <Shrub x={w * 0.95} y={h * 0.84} scale={1.9 * s} tone="deep" />
      <Shrub x={w * 0.82} y={h * 0.7} scale={0.85 * s} tone="light" />
    </svg>
  )
}
