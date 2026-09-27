export function RouteArt() {
  return (
    <svg
      viewBox="0 0 420 340"
      className="h-full w-full"
      fill="none"
      role="img"
      aria-label="Diagram of an optimized waste collection route connecting active stops"
    >
      <path
        d="M40 280 C 90 230, 70 170, 130 150 S 220 190, 210 120 S 300 60, 360 70"
        stroke="#8BC34A"
        strokeWidth="3"
        strokeDasharray="1 12"
        strokeLinecap="round"
      />
      <path
        d="M40 280 C 90 230, 70 170, 130 150 S 220 190, 210 120"
        stroke="#1E7A4C"
        strokeWidth="3"
        strokeLinecap="round"
      />

      <circle cx="40" cy="280" r="9" fill="#145C38" />
      <circle cx="130" cy="150" r="7" fill="#1E7A4C" />
      <circle cx="210" cy="120" r="7" fill="#1E7A4C" />
      <circle cx="300" cy="60" r="7" fill="#9CA3AF" />
      <circle cx="360" cy="70" r="8" fill="#7C3AED" />

      <text x="52" y="284" fontSize="11" fill="#145C38" fontFamily="Inter, sans-serif" fontWeight="600">
        Depot
      </text>
      <text x="300" y="46" fontSize="10" fill="#6B7280" fontFamily="Inter, sans-serif">
        Skipped
      </text>
      <text x="330" y="90" fontSize="10" fill="#7C3AED" fontFamily="Inter, sans-serif">
        Citizen-added
      </text>
    </svg>
  )
}
