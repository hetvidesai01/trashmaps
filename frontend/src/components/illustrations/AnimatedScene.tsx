import type { CSSProperties } from 'react'
import { Cypress, GREENS, Leaf, Shrub, Tree } from './Foliage'
import { TruckShapes } from './GarbageTruck'

/**
 * Animated eco-city scene for the landing page. Pure SVG + CSS transforms:
 *  - clouds drift (slowest, at different speeds/sizes for depth)
 *  - trees sway, leaves float, a small truck drives along the road
 * Every ambient loop carries a `tm-*` class that index.css disables under
 * prefers-reduced-motion, leaving a still, complete illustration.
 */

const vars = (values: Record<string, string | number>) => values as CSSProperties

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

interface CloudProps {
  x: number
  y: number
  scale: number
  width: number
  dur: number
  delay: number
  opacity?: number
}

function Cloud({ x, y, scale, width, dur, delay, opacity = 0.85 }: CloudProps) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <g
        className="tm-cloud"
        style={vars({
          '--from': `${-x - 200}px`,
          '--to': `${width - x + 200}px`,
          '--dur': `${dur}s`,
          animationDelay: `${delay}s`,
        })}
      >
        <g transform={`scale(${scale})`} fill="#ffffff" opacity={opacity}>
          <ellipse cx="0" cy="0" rx="44" ry="14" />
          <circle cx="-20" cy="-10" r="17" />
          <circle cx="8" cy="-18" r="21" />
          <circle cx="34" cy="-6" r="14" />
        </g>
      </g>
    </g>
  )
}

interface FloatingLeafProps {
  x: number
  y: number
  scale: number
  dur: number
  delay: number
  fill: string
  rotate?: number
}

function FloatingLeaf({ x, y, scale, dur, delay, fill, rotate = 0 }: FloatingLeafProps) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <g className="tm-leaf" style={vars({ '--dur': `${dur}s`, animationDelay: `${delay}s` })}>
        <Leaf x={0} y={0} scale={scale} rotate={rotate} fill={fill} vein="#2c7048" />
      </g>
    </g>
  )
}

interface AnimatedSceneProps {
  width: number
  height: number
  className?: string
}

export function AnimatedScene({ width: w, height: h, className = '' }: AnimatedSceneProps) {
  const s = h / 800
  const horizon = h * 0.46
  const roadY = h * 0.575
  const skylineW = Math.min(w * 0.6, 640)
  const skylineX = (w - skylineW) / 2
  const bw = skylineW / BUILDINGS.length

  const truckScale = 0.5 * Math.max(s, 0.9)
  const truckBase = w * 0.58
  const truckY = roadY + 8 - 150 * truckScale

  return (
    <svg
      viewBox={`0 0 ${w} ${h}`}
      preserveAspectRatio="xMidYMax slice"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      <rect width={w} height={h} fill="#f3f4e4" />
      <ellipse cx={w * 0.5} cy={horizon - 50 * s} rx={w * 0.46} ry={190 * s} fill="#eaf0d8" />

      {/* Clouds — back to front */}
      <Cloud x={w * 0.2} y={h * 0.2} scale={0.9} width={w} dur={110} delay={-30} opacity={0.7} />
      <Cloud x={w * 0.72} y={h * 0.13} scale={1.25} width={w} dur={80} delay={-55} />
      <Cloud x={w * 0.45} y={h * 0.31} scale={0.7} width={w} dur={140} delay={-90} opacity={0.6} />

      {/* Distant skyline */}
      <g opacity="0.85">
        {BUILDINGS.map(([x, tall], i) => (
          <rect
            key={i}
            x={skylineX + x * (skylineW / 0.64)}
            y={horizon - tall * h * 0.75}
            width={bw * 0.85}
            height={tall * h * 0.75 + 14}
            rx="3"
            fill={i % 2 ? '#cbdcc3' : '#d6e4cd'}
          />
        ))}
      </g>

      {/* Far hills */}
      <path
        d={`M0 ${horizon + 16 * s} Q${w * 0.25} ${horizon - 36 * s} ${w * 0.5} ${horizon + 10 * s} T${w} ${horizon - 8 * s} V${h} H0 Z`}
        fill="#d4e5bf"
      />
      <Shrub x={w * 0.3} y={horizon + 26 * s} scale={0.5 * s + 0.2} tone="light" />
      <Shrub x={w * 0.7} y={horizon + 22 * s} scale={0.45 * s + 0.2} tone="light" />

      {/* Mid hills */}
      <path
        d={`M0 ${horizon + 70 * s} Q${w * 0.3} ${horizon + 22 * s} ${w * 0.6} ${horizon + 64 * s} T${w} ${horizon + 40 * s} V${h} H0 Z`}
        fill="#bcd9a0"
      />

      {/* Winding lane climbing toward the city (narrows with distance) */}
      <path
        d={`M${w * 0.5 - 26 * s - 6} ${roadY - 12} C${w * 0.5 - 90 * s} ${roadY - 34 * s}, ${w * 0.5 + 40 * s} ${roadY - 46 * s}, ${w * 0.5 - 6 * s} ${horizon + 52 * s} S${w * 0.5 + 24 * s} ${horizon + 40 * s} ${w * 0.5 + 8 * s} ${horizon + 30 * s} L${w * 0.5 + 12 * s} ${horizon + 30 * s} C${w * 0.5 + 40 * s} ${horizon + 40 * s}, ${w * 0.5 + 6 * s} ${horizon + 54 * s}, ${w * 0.5 + 40 * s} ${roadY - 36 * s} S${w * 0.5 + 90 * s} ${roadY - 30 * s} ${w * 0.5 + 26 * s + 6} ${roadY - 12} Z`}
        fill="#efe9c8"
      />

      {/* Mid-distance trees */}
      <Tree x={w * 0.24} y={horizon + 62 * s} scale={0.62 * s + 0.12} sway />
      <Cypress x={w * 0.76} y={horizon + 58 * s} scale={0.55 * s + 0.1} />
      <Tree x={w * 0.8} y={horizon + 70 * s} scale={0.6 * s + 0.12} flip sway />

      {/* Road */}
      <path
        d={`M-20 ${roadY - 16} Q${w * 0.25} ${roadY - 24} ${w * 0.5} ${roadY - 15} T${w + 20} ${roadY - 18} V${roadY + 20} Q${w * 0.75} ${roadY + 27} ${w * 0.5} ${roadY + 19} T-20 ${roadY + 22} Z`}
        fill="#d9cfa4"
      />
      <path
        d={`M-20 ${roadY + 3} Q${w * 0.25} ${roadY - 4} ${w * 0.5} ${roadY + 1} T${w + 20} ${roadY - 1}`}
        stroke="#fbf6e2"
        strokeWidth="2.5"
        strokeDasharray="14 12"
        fill="none"
        opacity="0.85"
      />

      {/* Truck: static spot is the reduced-motion resting place; the loop drives it across */}
      <g transform={`translate(${truckBase} ${truckY})`}>
        <g
          className="tm-drive"
          style={vars({ '--from': `${-truckBase - 220}px`, '--to': `${w - truckBase + 220}px`, '--dur': '48s' })}
        >
          <g className="tm-bob">
            <g transform={`scale(${truckScale})`}>
              <TruckShapes />
            </g>
          </g>
        </g>
      </g>

      {/* Near hill */}
      <path
        d={`M0 ${roadY + 44 * s} Q${w * 0.2} ${roadY + 22 * s} ${w * 0.42} ${roadY + 46 * s} T${w} ${roadY + 36 * s} V${h} H0 Z`}
        fill="#a2cb86"
        opacity="0.92"
      />
      <path d={`M0 ${h * 0.9} Q${w * 0.3} ${h * 0.84} ${w * 0.6} ${h * 0.91} T${w} ${h * 0.88} V${h} H0 Z`} fill={GREENS.light} />

      {/* Framing trees — sway at different tempos */}
      <g>
        <Tree x={w * 0.02} y={h * 0.74} scale={2.3 * s} sway />
        <Tree x={w * 0.15} y={h * 0.7} scale={1.15 * s} sway />
        <Cypress x={w * 0.085} y={h * 0.62} scale={1.1 * s} />
        <Shrub x={w * 0.07} y={h * 0.84} scale={1.7 * s} tone="deep" />
        <Shrub x={w * 0.2} y={h * 0.74} scale={0.9 * s} />
      </g>
      <g>
        <Tree x={w * 0.98} y={h * 0.7} scale={2.1 * s} flip sway />
        <Tree x={w * 0.85} y={h * 0.67} scale={1.05 * s} flip sway />
        <Cypress x={w * 0.93} y={h * 0.6} scale={1.2 * s} />
        <Shrub x={w * 0.95} y={h * 0.86} scale={1.9 * s} tone="deep" />
        <Shrub x={w * 0.81} y={h * 0.74} scale={0.85 * s} tone="light" />
      </g>

      {/* Floating leaves */}
      <FloatingLeaf x={w * 0.16} y={h * 0.44} scale={0.34} dur={15} delay={-4} fill="#86bb6e" rotate={20} />
      <FloatingLeaf x={w * 0.34} y={h * 0.52} scale={0.28} dur={18} delay={-11} fill="#5ea463" rotate={-30} />
      <FloatingLeaf x={w * 0.62} y={h * 0.5} scale={0.3} dur={13} delay={-7} fill="#b4d594" rotate={50} />
      <FloatingLeaf x={w * 0.82} y={h * 0.4} scale={0.36} dur={17} delay={-2} fill="#3f8b57" rotate={-10} />
      <FloatingLeaf x={w * 0.9} y={h * 0.55} scale={0.26} dur={14} delay={-9} fill="#e7a65b" rotate={70} />
    </svg>
  )
}

/**
 * Picks the scene composition that suits the viewport's shape (phone / tablet
 * portrait / wide) so trees frame the edges instead of being cropped away.
 * Selection is CSS-only (see .tm-scene-* in index.css).
 */
export function AnimatedBackdrop() {
  const base = 'tm-fade absolute inset-0 h-full w-full'
  return (
    <>
      <AnimatedScene width={420} height={820} className={`${base} tm-scene-phone`} />
      <AnimatedScene width={820} height={1000} className={`${base} tm-scene-tablet`} />
      <AnimatedScene width={1360} height={820} className={`${base} tm-scene-wide`} />
    </>
  )
}
