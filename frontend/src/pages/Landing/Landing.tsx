import type { CSSProperties } from 'react'
import { AnimatedBackdrop, LeafMark } from '../../components/illustrations'
import type { UserRole } from '../../auth/authStorage'
import { AuthorityArt, CitizenArt } from './CardArt'
import { RoleCard } from './RoleCard'

interface LandingProps {
  /** Called with the role whose login flow should open. */
  onSelect: (role: UserRole) => void
}

const enter = (delay: number, duration = 0.7): CSSProperties => ({
  animationDelay: `${delay}s`,
  animationDuration: `${duration}s`,
})

/**
 * Animated welcome screen. Choreography on load: scene fades in, logo fades,
 * heading rises, tagline follows, then the two role cards stagger in.
 * Selection only reports which role was chosen — the existing login forms and
 * demo sign-in still live in pages/Login.
 */
export function Landing({ onSelect }: LandingProps) {
  return (
    <div className="relative min-h-svh overflow-hidden bg-[#f3f4e4]">
      <AnimatedBackdrop />

      <div className="relative z-10 mx-auto flex min-h-svh w-full max-w-5xl flex-col px-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-[max(2rem,env(safe-area-inset-top))] md:px-8 md:pb-10 md:pt-12">
        <header className="flex flex-col items-center text-center">
          <div className="tm-fade" style={enter(0.05, 0.8)}>
            <LeafMark className="h-14 w-14 md:h-[4.5rem] md:w-[4.5rem]" />
          </div>
          <h1
            className="tm-rise mt-1 font-display text-5xl font-semibold tracking-tight text-primary-dark md:text-7xl"
            style={enter(0.18)}
          >
            TrashMaps
          </h1>
          <p
            className="tm-rise mt-2.5 text-base font-bold leading-snug text-ink/80 md:mt-3 md:text-xl"
            style={enter(0.34)}
          >
            <span className="block md:inline">Cleaner Cities.</span>{' '}
            <span className="block md:inline">Smarter Routes.</span>
          </p>
        </header>

        <div className="min-h-6 flex-1" />

        <div className="grid gap-3 md:grid-cols-2 md:gap-6">
          <RoleCard
            title="Continue as Authority"
            description="Plan smarter routes. Manage cleaner cities."
            art={<AuthorityArt />}
            tintClassName="bg-[#e1eed3] hover:bg-[#d3e6c0]"
            delay={0.5}
            onClick={() => onSelect('authority')}
          />
          <RoleCard
            title="Continue as Citizen"
            description="Spot waste. Report it. Make a difference."
            art={<CitizenArt />}
            tintClassName="bg-[#fbf4e2] hover:bg-[#f7ebcd]"
            delay={0.65}
            onClick={() => onSelect('citizen')}
          />
        </div>
      </div>
    </div>
  )
}
