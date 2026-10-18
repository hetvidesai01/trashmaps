interface GarbageTruckProps {
  className?: string
}

/** Raw truck shapes in a 300x170 coordinate space, for embedding in other SVGs. */
export function TruckShapes() {
  return (
    <>
      <ellipse cx="152" cy="150" rx="128" ry="8" fill="#0f3a2a" opacity="0.16" />

      {/* Rear loader + compactor body */}
      <path d="M14 112 L14 50 Q14 38 26 38 L58 38 L58 112 Z" fill="#1f6a45" />
      <rect x="40" y="26" width="140" height="92" rx="14" fill="#2d8656" />
      <path d="M40 40 Q40 26 54 26 L166 26 Q180 26 180 40 L180 52 L40 52 Z" fill="#37966a" />
      <rect x="40" y="96" width="140" height="22" rx="6" fill="#1f6a45" />
      {/* Panel ribs */}
      <path d="M72 52 V96 M104 52 V96 M136 52 V96" stroke="#1f6a45" strokeWidth="2.500" opacity="0.55" />
      {/* Recycle badge */}
      <circle cx="108" cy="74" r="17" fill="#fdfcf8" opacity="0.95" />
      <path d="M108 63 C100 65 98 74 102 80" stroke="#2d8656" strokeWidth="3" strokeLinecap="round" />
      <path d="M115 80 C120 74 118 66 111 62" stroke="#5ea463" strokeWidth="3" strokeLinecap="round" />
      <path d="M100 82 L109 84 M116 62 L112 70" stroke="#2d8656" strokeWidth="3" strokeLinecap="round" />
      {/* Hopper lip */}
      <rect x="10" y="108" width="52" height="10" rx="4" fill="#194d3c" />
      <rect x="22" y="44" width="10" height="8" rx="2" fill="#f2c14e" />

      {/* Cab */}
      <path d="M182 118 L182 52 Q182 42 192 42 L226 42 Q236 42 242 52 L262 86 Q266 92 266 100 L266 118 Z" fill="#f2c14e" />
      <path d="M190 52 L222 52 Q228 52 232 58 L248 86 L190 86 Z" fill="#cfe7ee" />
      <path d="M190 52 L214 52 L196 86 L190 86 Z" fill="#fdfcf8" opacity="0.5" />
      <rect x="182" y="104" width="86" height="14" rx="4" fill="#e0a92e" />
      <rect x="258" y="94" width="10" height="8" rx="3" fill="#fff3c4" />
      <rect x="196" y="90" width="20" height="4" rx="2" fill="#e0a92e" />

      {/* Chassis */}
      <rect x="20" y="116" width="250" height="14" rx="6" fill="#2a3a33" />

      {/* Wheels */}
      <g>
        <circle cx="76" cy="130" r="20" fill="#26332d" />
        <circle cx="76" cy="130" r="9" fill="#c9d3cc" />
        <circle cx="76" cy="130" r="3.500" fill="#7a8a82" />
      </g>
      <g>
        <circle cx="214" cy="130" r="20" fill="#26332d" />
        <circle cx="214" cy="130" r="9" fill="#c9d3cc" />
        <circle cx="214" cy="130" r="3.500" fill="#7a8a82" />
      </g>
    </>
  )
}

/** Green waste-collection truck with a yellow cab, facing right. */
export function GarbageTruck({ className = 'h-auto w-full' }: GarbageTruckProps) {
  return (
    <svg viewBox="0 0 300 170" className={className} fill="none" role="img" aria-label="Waste collection truck">
      <TruckShapes />
    </svg>
  )
}
