import { useState } from 'react'
import type { FormEvent } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import { ArrowLeft, ArrowRight, ShieldCheck, Truck, Users } from 'lucide-react'
import { Button } from '../../components/common/Button'
import { inputClasses, labelClasses } from '../../components/forms/fieldStyles'
import { LeafMark, SceneBackdrop } from '../../components/illustrations'
import { useAuth } from '../../auth/AuthContext'
import { ROLE_HOME } from '../../auth/roleHome'
import type { UserRole } from '../../auth/authStorage'

interface LocationState {
  from?: string
}

type LoginMode = 'choice' | UserRole

const HEADER_COPY: Record<LoginMode, { title: string; description: string }> = {
  choice: {
    title: 'TrashMaps',
    description: 'Cleaner Cities.\nSmarter Routes.',
  },
  authority: {
    title: 'Authority login',
    description: 'Sign in with your municipal authority credentials.',
  },
  citizen: {
    title: 'Citizen login',
    description: 'Sign in to report waste and track your submissions.',
  },
}

interface RoleCardProps {
  icon: typeof Truck
  title: string
  description: string
  tint: string
  iconColor: string
  onClick: () => void
}

function RoleCard({ icon: Icon, title, description, tint, iconColor, onClick }: RoleCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`tm-press group flex w-full items-center gap-4 rounded-3xl border border-white/70 px-5 py-4 text-left shadow-card ${tint}`}
    >
      <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/80">
        <Icon size={26} strokeWidth={1.9} className={iconColor} />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-base font-extrabold text-ink">{title}</span>
        <span className="mt-0.5 block text-xs font-semibold leading-snug text-muted">{description}</span>
      </span>
      <ArrowRight size={20} className="shrink-0 text-muted transition-transform group-hover:translate-x-1" />
    </button>
  )
}

export function Login() {
  const { isAuthenticated, role, login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [mode, setMode] = useState<LoginMode>('choice')
  const [showFormHint, setShowFormHint] = useState(false)

  if (isAuthenticated && role) {
    return <Navigate to={ROLE_HOME[role]} replace />
  }

  const redirectTo = (location.state as LocationState | null)?.from

  function handleDemoLogin(nextRole: UserRole) {
    login(nextRole)
    navigate(redirectTo ?? ROLE_HOME[nextRole], { replace: true })
  }

  function handleMockSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setShowFormHint(true)
  }

  function selectMode(nextMode: LoginMode) {
    setShowFormHint(false)
    setMode(nextMode)
  }

  const { title, description } = HEADER_COPY[mode]
  const isChoice = mode === 'choice'

  return (
    <div className="relative min-h-svh overflow-hidden bg-[#f3f4e4]">
      <SceneBackdrop width={420} height={820} className="absolute inset-0 h-full w-full md:hidden" />
      <SceneBackdrop width={1360} height={820} className="absolute inset-0 hidden h-full w-full md:block" />

      <div className="relative z-10 mx-auto flex min-h-svh w-full max-w-md flex-col px-6 pb-10 pt-12">
        <header className="tm-rise flex flex-col items-center text-center">
          <LeafMark className={isChoice ? 'h-16 w-16' : 'h-12 w-12'} />
          <h1
            className={`font-display font-semibold tracking-tight text-primary-dark ${
              isChoice ? 'mt-1 text-5xl' : 'mt-3 text-3xl'
            }`}
          >
            {title}
          </h1>
          <p className="mt-3 max-w-xs whitespace-pre-line text-base font-semibold leading-snug text-ink/80">
            {description}
          </p>
        </header>

        <div className="flex-1" />

        <div className="tm-rise mt-10" style={{ animationDelay: '0.12s' }}>
          {isChoice && (
            <div className="space-y-3.5">
              <RoleCard
                icon={Truck}
                title="Continue as Authority"
                description="For verified waste-management personnel"
                tint="bg-sage-soft/95"
                iconColor="text-primary"
                onClick={() => selectMode('authority')}
              />
              <RoleCard
                icon={Users}
                title="Continue as Citizen"
                description="Report waste for a cleaner city"
                tint="bg-surface/95"
                iconColor="text-[#3d6f9e]"
                onClick={() => selectMode('citizen')}
              />
            </div>
          )}

          {mode === 'citizen' && (
            <div className="rounded-3xl border border-white/70 bg-surface p-6 shadow-lift">
              <BackButton onClick={() => selectMode('choice')} />

              <form onSubmit={handleMockSubmit} className="space-y-4">
                <div>
                  <label htmlFor="citizen-identifier" className={labelClasses}>
                    Email or Mobile
                  </label>
                  <input
                    id="citizen-identifier"
                    type="text"
                    autoComplete="username"
                    placeholder="you@example.com or 98765 43210"
                    className={inputClasses}
                  />
                </div>
                <div>
                  <label htmlFor="citizen-password" className={labelClasses}>
                    Password
                  </label>
                  <input
                    id="citizen-password"
                    type="password"
                    autoComplete="current-password"
                    placeholder="••••••••"
                    className={inputClasses}
                  />
                </div>
                <Button type="submit" className="w-full">
                  Log in
                </Button>
                {showFormHint && <PrototypeHint />}
              </form>

              <Divider />

              <Button type="button" variant="soft" className="w-full" onClick={() => handleDemoLogin('citizen')}>
                Use Demo Citizen Account
              </Button>
            </div>
          )}

          {mode === 'authority' && (
            <div className="rounded-3xl border border-white/70 bg-surface p-6 shadow-lift">
              <BackButton onClick={() => selectMode('choice')} />

              <div className="mb-4 flex items-start gap-2.5 rounded-2xl bg-sage-soft px-4 py-3 text-xs font-semibold text-primary-dark">
                <ShieldCheck size={16} className="mt-0.5 shrink-0" />
                <span>Restricted to verified waste-management personnel.</span>
              </div>

              <form onSubmit={handleMockSubmit} className="space-y-4">
                <div>
                  <label htmlFor="authority-id" className={labelClasses}>
                    Authority ID
                  </label>
                  <input
                    id="authority-id"
                    type="text"
                    autoComplete="username"
                    placeholder="e.g. WM-2451"
                    className={inputClasses}
                  />
                </div>
                <div>
                  <label htmlFor="authority-password" className={labelClasses}>
                    Password
                  </label>
                  <input
                    id="authority-password"
                    type="password"
                    autoComplete="current-password"
                    placeholder="••••••••"
                    className={inputClasses}
                  />
                </div>
                <Button type="submit" className="w-full">
                  Login as Authority
                </Button>
                {showFormHint && <PrototypeHint />}
              </form>

              <Divider />

              <Button type="button" variant="soft" className="w-full" onClick={() => handleDemoLogin('authority')}>
                Use Demo Authority Account
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function BackButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="mb-4 flex items-center gap-1.5 text-xs font-bold text-muted transition-colors hover:text-ink"
    >
      <ArrowLeft size={14} />
      Back
    </button>
  )
}

function PrototypeHint() {
  return (
    <p className="text-center text-xs font-semibold text-muted">
      This is a prototype — use the demo account below to continue.
    </p>
  )
}

function Divider() {
  return (
    <div className="my-5 flex items-center gap-3">
      <span className="h-px flex-1 bg-line" aria-hidden="true" />
      <span className="text-xs font-semibold text-muted">or</span>
      <span className="h-px flex-1 bg-line" aria-hidden="true" />
    </div>
  )
}
