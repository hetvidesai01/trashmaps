import { CitizenReporter, RecycleBin, Sparkle, TruckShapes } from '../../components/illustrations'

/** Route-map illustration for the Authority card: dotted route, numbered stops, truck. */
export function AuthorityArt() {
  return (
    <svg viewBox="0 0 320 176" preserveAspectRatio="xMidYMid slice" className="h-full w-full" aria-hidden="true">
      <rect width="320" height="176" fill="#cfe3bd" />
      {/* Parks */}
      <ellipse cx="60" cy="40" rx="46" ry="24" fill="#b9d89e" />
      <ellipse cx="270" cy="140" rx="54" ry="22" fill="#b9d89e" />
      {/* Streets */}
      <g stroke="#eef5e2" strokeLinecap="round" fill="none">
        <path d="M-10 70 H330" strokeWidth="9" />
        <path d="M-10 140 H330" strokeWidth="7" />
        <path d="M80 -10 V190" strokeWidth="8" />
        <path d="M210 -10 V190" strokeWidth="9" />
        <path d="M-10 20 L330 110" strokeWidth="5" opacity="0.8" />
      </g>
      {/* Route */}
      <path
        d="M36 138 C 58 96, 92 70, 118 92 S 168 124, 196 70 S 226 40, 244 40"
        stroke="#e4efd6"
        strokeWidth="9"
        strokeLinecap="round"
        fill="none"
      />
      <path
        className="tm-dash"
        d="M36 138 C 58 96, 92 70, 118 92 S 168 124, 196 70 S 226 40, 244 40"
        stroke="#176b4d"
        strokeWidth="4.5"
        strokeLinecap="round"
        fill="none"
      />
      {/* Stops */}
      <g fontFamily="Nunito, sans-serif" fontWeight="800" fontSize="12" textAnchor="middle" fill="#fff">
        <circle cx="118" cy="92" r="12" fill="#176b4d" stroke="#fff" strokeWidth="3" />
        <text x="118" y="96.5">1</text>
        <circle cx="196" cy="70" r="12" fill="#176b4d" stroke="#fff" strokeWidth="3" />
        <text x="196" y="74.5">2</text>
        <circle cx="244" cy="40" r="12" fill="#e07b2f" stroke="#fff" strokeWidth="3" />
        <text x="244" y="44.5">3</text>
      </g>
      <rect x="25" y="127" width="22" height="22" rx="7" fill="#194d3c" stroke="#fff" strokeWidth="3" />
      {/* Truck */}
      <g transform="translate(150 78) scale(0.56)">
        <TruckShapes />
      </g>
    </svg>
  )
}

/** Resident-with-phone illustration for the Citizen card. */
export function CitizenArt() {
  return (
    <>
      {/* Small card: fill the frame with the figure */}
      <CitizenReporter className="absolute inset-0 h-full w-full md:hidden" />
      {/* Large card: whole figure, framed by foliage and a recycling bin */}
      <span className="absolute inset-0 hidden bg-[#eef2dd] md:block" />
      <span className="absolute inset-x-0 bottom-0 hidden h-[34%] bg-[#b3d395] md:block" />
      <CitizenReporter fit="meet" className="absolute inset-0 hidden h-full w-full md:block" />
      <span className="absolute bottom-2 right-3 hidden w-16 md:block">
        <RecycleBin />
      </span>
      <svg viewBox="0 0 40 40" className="absolute left-4 top-3 hidden h-8 w-8 md:block" aria-hidden="true">
        <Sparkle x={20} y={20} size={11} delay={0.4} />
      </svg>
    </>
  )
}
