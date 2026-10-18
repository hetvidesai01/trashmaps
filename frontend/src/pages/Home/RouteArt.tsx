export function RouteArt() {
  return (
    <svg
      viewBox="0 0 420 340"
      className="h-full w-full p-4"
      fill="none"
      role="img"
      aria-label="Diagram of an optimized waste collection route connecting active stops"
    >
      <path
        d="M40 280 C 90 230, 70 170, 130 150 S 220 190, 210 120 S 300 60, 360 70"
        stroke="#86bb6e"
        strokeWidth="4"
        strokeDasharray="1 12"
        strokeLinecap="round"
      />
      <path
        d="M40 280 C 90 230, 70 170, 130 150 S 220 190, 210 120"
        stroke="#176b4d"
        strokeWidth="5"
        strokeLinecap="round"
      />

      <circle cx="40" cy="280" r="12" fill="#194d3c" stroke="#fff" strokeWidth="3" />
      <circle cx="130" cy="150" r="11" fill="#176b4d" stroke="#fff" strokeWidth="3" />
      <circle cx="210" cy="120" r="11" fill="#176b4d" stroke="#fff" strokeWidth="3" />
      <circle cx="300" cy="60" r="10" fill="#a3a99f" stroke="#fff" strokeWidth="3" opacity="0.7" />
      <circle cx="360" cy="70" r="12" fill="#e07b2f" stroke="#fff" strokeWidth="3" />

      <text x="56" y="298" fontSize="12" fill="#194d3c" fontFamily="Nunito, sans-serif" fontWeight="800">
        Depot
      </text>
      <text x="278" y="44" fontSize="11" fill="#6d8077" fontFamily="Nunito, sans-serif" fontWeight="700">
        Skipped
      </text>
      <text x="314" y="98" fontSize="11" fill="#e07b2f" fontFamily="Nunito, sans-serif" fontWeight="800">
        Citizen report
      </text>
    </svg>
  )
}
