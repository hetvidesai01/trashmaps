import { useState } from 'react'
import type { FormEvent } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import { ArrowLeft, ShieldCheck } from 'lucide-react'
import { Button } from '../../components/common/Button'
import { inputClasses, labelClasses } from '../../components/forms/fieldStyles'
import { AnimatedBackdrop, LeafMark } from '../../components/illustrations'
import { Landing } from '../Landing'
import { useAuth } from '../../auth/AuthContext'
import { ROLE_HOME } from '../../auth/roleHome'
import type { UserRole } from '../../auth/authStorage'

interface LocationState {
  from?: string
  /** Set when arriving from the public landing page with a role already chosen. */
  mode?: UserRole
}

type LoginMode = 'choice' | UserRole

const HEADER_COPY: Record<UserRole, { title: string; description: string }> = {
  authority: {
    title: 'Authority login',
    description: 'Sign in with your municipal authority credentials.',
  },
  citizen: {
    title: 'Citizen login',
    description: 'Sign in to report waste and track your submissions.',
  },
}

export function Login() {
  const { isAuthenticated, role, login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [mode, setMode] = useState<LoginMode>(() => (location.state as LocationState | null)?.mode ?? 'choice')
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

  if (mode === 'choice') {
    return <Landing onSelect={selectMode} />
  }

  const { title, description } = HEADER_COPY[mode]

  return (
    <div className="relative min-h-svh overflow-hidden bg-[#f3f4e4]">
      <AnimatedBackdrop />

      <div className="relative z-10 mx-auto flex min-h-svh w-full max-w-md flex-col px-6 pb-10 pt-12">
        <header className="tm-rise flex flex-col items-center text-center">
          <LeafMark className="h-12 w-12" />
          <h1 className="mt-3 font-display text-3xl font-semibold tracking-tight text-primary-dark">{title}</h1>
          <p className="mt-3 max-w-xs text-base font-semibold leading-snug text-ink/80">{description}</p>
        </header>

        <div className="flex-1" />

        <div className="tm-rise mt-10" style={{ animationDelay: '0.12s' }}>
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
      className="-mt-2 mb-2 flex min-h-11 items-center gap-1.5 text-xs font-bold text-muted transition-colors hover:text-ink"
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
