import { Cypress, Shrub, Tree } from './Foliage'

interface CitizenReporterProps {
  className?: string
  /** 'slice' fills the box (crops); 'meet' keeps the whole figure visible. */
  fit?: 'slice' | 'meet'
}

/** A resident in a green jacket spotting waste and reporting it on their phone. */
export function CitizenReporter({ className = 'h-full w-full', fit = 'slice' }: CitizenReporterProps) {
  return (
    <svg
      viewBox="0 0 360 220"
      preserveAspectRatio={`xMidYMax ${fit}`}
      className={className}
      role="img"
      aria-label="Resident reporting waste with a phone"
    >
      <rect width="360" height="220" fill="#eef2dd" />
      {/* Skyline haze */}
      <g fill="#d5e4cb">
        <rect x="150" y="70" width="22" height="90" rx="3" />
        <rect x="176" y="50" width="26" height="110" rx="3" />
        <rect x="206" y="82" width="20" height="78" rx="3" />
        <rect x="230" y="62" width="28" height="98" rx="3" />
        <rect x="262" y="90" width="22" height="70" rx="3" />
      </g>
      <path d="M0 150 Q90 120 190 148 T360 138 V220 H0 Z" fill="#c4dca9" />
      <path d="M0 184 Q120 160 240 182 T360 176 V220 H0 Z" fill="#a8cf8a" />

      <Tree x={36} y={176} scale={1.15} />
      <Cypress x={92} y={170} scale={0.7} />
      <Tree x={332} y={172} scale={1.1} flip />
      <Shrub x={330} y={212} scale={1} tone="deep" />
      <Shrub x={28} y={214} scale={1.1} tone="deep" />

      {/* Backpack */}
      <path d="M142 150 Q130 168 136 216 L170 216 L168 152 Z" fill="#2f6f4b" />
      <path d="M204 150 Q218 168 212 216 L178 216 L180 152 Z" fill="#2f6f4b" />

      {/* Torso / jacket */}
      <path d="M128 220 Q124 168 152 152 L208 152 Q236 168 232 220 Z" fill="#86ae6a" />
      <path d="M170 152 L180 184 L190 152 Z" fill="#f4efe0" />
      <path d="M180 184 V220" stroke="#6b9552" strokeWidth="3" />
      <path d="M146 158 Q142 190 150 220" stroke="#6b9552" strokeWidth="3" fill="none" opacity="0.6" />

      {/* Neck */}
      <rect x="171" y="136" width="18" height="20" rx="6" fill="#e2a982" />

      {/* Hair back */}
      <path d="M148 98 Q146 62 180 60 Q216 62 212 98 Q214 130 202 144 L158 144 Q146 130 148 98 Z" fill="#2a2322" />
      {/* Face */}
      <ellipse cx="180" cy="102" rx="26" ry="31" fill="#ecb792" />
      {/* Fringe */}
      <path d="M152 98 Q154 66 182 66 Q208 68 208 96 Q196 80 178 82 Q162 84 152 98 Z" fill="#2a2322" />
      {/* Face details */}
      <circle cx="170" cy="104" r="2.200" fill="#2a2322" />
      <circle cx="192" cy="104" r="2.200" fill="#2a2322" />
      <path d="M172 116 Q181 123 191 116" stroke="#a5543f" strokeWidth="2.400" strokeLinecap="round" fill="none" />
      <circle cx="164" cy="113" r="4" fill="#f09a86" opacity="0.5" />
      <circle cx="198" cy="113" r="4" fill="#f09a86" opacity="0.5" />

      {/* Arms + phone */}
      <path d="M140 170 Q122 196 168 206 L176 188 Q150 184 156 166 Z" fill="#86ae6a" />
      <path d="M220 170 Q240 196 196 206 L188 188 Q212 184 206 166 Z" fill="#86ae6a" />
      <g transform="rotate(-8 182 190)">
        <rect x="160" y="170" width="44" height="40" rx="7" fill="#27312c" />
        <rect x="164" y="174" width="36" height="32" rx="4" fill="#cfe9e2" />
        <path d="M172 192 L182 200 L196 182" stroke="#176b4d" strokeWidth="3.500" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      </g>
      <ellipse cx="160" cy="200" rx="7" ry="5" fill="#ecb792" />
      <ellipse cx="204" cy="200" rx="7" ry="5" fill="#ecb792" />
    </svg>
  )
}
