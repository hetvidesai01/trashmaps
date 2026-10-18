import { GREENS, Leaf, Sparkle } from './Foliage'

interface RecycleBinProps {
  className?: string
  /** Adds twinkling sparkles — used on the success screen. */
  sparkles?: boolean
}

/** Recycling bin with a seedling growing out of it. */
export function RecycleBin({ className = 'h-auto w-full', sparkles = false }: RecycleBinProps) {
  return (
    <svg viewBox="0 0 200 220" className={className} fill="none" role="img" aria-label="Recycling bin with a growing sprout">
      <ellipse cx="100" cy="208" rx="70" ry="7" fill="#0f3a2a" opacity="0.14" />

      {/* Sprout */}
      <path d="M100 70 C100 52 98 40 94 30" stroke="#3f8b57" strokeWidth="4" strokeLinecap="round" />
      <Leaf x={96} y={36} scale={0.9} rotate={-38} fill={GREENS.fresh} />
      <Leaf x={99} y={44} scale={0.75} rotate={42} fill={GREENS.light} />
      <Leaf x={95} y={32} scale={0.55} rotate={-4} fill={GREENS.mid} />

      {/* Bin */}
      <path d="M52 86 H148 L140 196 Q139 204 131 204 H69 Q61 204 60 196 Z" fill="#2d8656" />
      <path d="M52 86 H100 V204 H69 Q61 204 60 196 Z" fill="#37966a" opacity="0.55" />
      <path d="M72 100 L76 192 M100 100 V192 M128 100 L124 192" stroke="#1f6a45" strokeWidth="3" strokeLinecap="round" opacity="0.4" />
      {/* Lid */}
      <rect x="44" y="70" width="112" height="18" rx="8" fill="#1f6a45" />
      <rect x="86" y="62" width="28" height="10" rx="5" fill="#194d3c" />

      {/* Recycle emblem */}
      <circle cx="100" cy="142" r="24" fill="#fdfcf8" opacity="0.96" />
      <path d="M100 126 C89 128 85 140 91 150" stroke="#2d8656" strokeWidth="4.500" strokeLinecap="round" />
      <path d="M110 150 C117 141 114 130 105 126" stroke="#5ea463" strokeWidth="4.500" strokeLinecap="round" />
      <path d="M88 153 L100 156 M112 124 L105 135 M118 150 L108 152" stroke="#2d8656" strokeWidth="4" strokeLinecap="round" />

      {/* Ground foliage */}
      <g>
        <ellipse cx="46" cy="198" rx="22" ry="12" fill="#3f8b57" />
        <ellipse cx="34" cy="194" rx="14" ry="9" fill="#5ea463" />
        <ellipse cx="156" cy="199" rx="24" ry="12" fill="#3f8b57" />
        <ellipse cx="168" cy="194" rx="14" ry="9" fill="#86bb6e" />
        <circle cx="152" cy="190" r="6" fill="#f0a24b" />
        <circle cx="166" cy="199" r="4.500" fill="#f0a24b" opacity="0.85" />
      </g>

      {sparkles && (
        <g>
          <Sparkle x={38} y={52} size={9} />
          <Sparkle x={166} y={44} size={12} delay={0.6} />
          <Sparkle x={150} y={96} size={7} delay={1.2} />
          <Sparkle x={26} y={110} size={6} delay={0.3} />
        </g>
      )}
    </svg>
  )
}
