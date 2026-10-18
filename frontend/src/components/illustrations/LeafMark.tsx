interface LeafMarkProps {
  className?: string
  /** 'solid' = deep-green leaf on light; 'light' = pale leaf for dark backgrounds. */
  tone?: 'solid' | 'light'
}

/** The TrashMaps brand leaf. */
export function LeafMark({ className = 'h-8 w-8', tone = 'solid' }: LeafMarkProps) {
  const fill = tone === 'solid' ? '#176b4d' : '#cfe6b8'
  const vein = tone === 'solid' ? '#dcebcf' : '#194d3c'
  return (
    <svg viewBox="0 0 48 48" className={className} fill="none" aria-hidden="true">
      <path
        d="M39 6C20 6 9 17 9 31c0 3 .6 5.400 1.800 7.600C13 41.500 16.500 43 20 43 33 43 41 30 39 6Z"
        fill={fill}
      />
      <path d="M11 41C17 30 24 22 34 15" stroke={vein} strokeWidth="2.600" strokeLinecap="round" />
      <path d="M22 28 16 27M27 22l-5-5" stroke={vein} strokeWidth="2" strokeLinecap="round" opacity="0.8" />
    </svg>
  )
}
