import { useState } from 'react'
import type { FormEvent } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import { ArrowLeft, LayoutDashboard, MessageSquarePlus, ShieldCheck, Trash2 } from 'lucide-react'
import { Button } from '../../components/common/Button'
import { Card } from '../../components/common/Card'
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
    description:
      'Smarter collection routes for authorities, and a direct line to report waste for citizens.',
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

  return (
    <div className="flex min-h-svh items-center justify-center bg-bg px-5 py-12">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center text-center">
          <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-dark text-accent">
            <Trash2 size={22} strokeWidth={2.25} />
          </span>
          <h1 className="mt-4 font-display text-2xl font-semibold text-ink">{title}</h1>
          <p className="mt-1.5 max-w-xs text-sm text-muted">{description}</p>
        </div>

        <Card className="p-6">
          {mode === 'choice' && (
            <div className="space-y-2.5">
              <button
                type="button"
                onClick={() => selectMode('citizen')}
                className="flex w-full items-center gap-3 rounded-lg border border-ink/10 px-4 py-3.5 text-left transition-colors hover:border-primary/40 hover:bg-primary/5"
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-accent/15 text-primary-dark">
                  <MessageSquarePlus size={17} strokeWidth={2} />
                </span>
                <span>
                  <span className="block text-sm font-medium text-ink">Citizen Login</span>
                  <span className="block text-xs text-muted">Report waste &amp; track your reports</span>
                </span>
              </button>
              <button
                type="button"
                onClick={() => selectMode('authority')}
                className="flex w-full items-center gap-3 rounded-lg border border-ink/10 px-4 py-3.5 text-left transition-colors hover:border-primary/40 hover:bg-primary/5"
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary-dark">
                  <LayoutDashboard size={17} strokeWidth={2} />
                </span>
                <span>
                  <span className="block text-sm font-medium text-ink">Authority Login</span>
                  <span className="block text-xs text-muted">
                    Dashboard, route operations &amp; report verification
                  </span>
                </span>
              </button>
            </div>
          )}

          {mode === 'citizen' && (
            <>
              <button
                type="button"
                onClick={() => selectMode('choice')}
                className="mb-4 flex items-center gap-1.5 text-xs font-medium text-muted hover:text-ink"
              >
                <ArrowLeft size={13} />
                Back
              </button>

              <form onSubmit={handleMockSubmit} className="space-y-4">
                <div>
                  <label htmlFor="citizen-identifier" className="text-xs font-medium text-muted">
                    Email or Mobile
                  </label>
                  <input
                    id="citizen-identifier"
                    type="text"
                    autoComplete="username"
                    placeholder="you@example.com or 98765 43210"
                    className="mt-1.5 w-full rounded-lg border border-ink/10 bg-surface px-3.5 py-2.5 text-sm text-ink placeholder:text-muted/70 focus:border-primary/50 focus:outline-none"
                  />
                </div>
                <div>
                  <label htmlFor="citizen-password" className="text-xs font-medium text-muted">
                    Password
                  </label>
                  <input
                    id="citizen-password"
                    type="password"
                    autoComplete="current-password"
                    placeholder="••••••••"
                    className="mt-1.5 w-full rounded-lg border border-ink/10 bg-surface px-3.5 py-2.5 text-sm text-ink placeholder:text-muted/70 focus:border-primary/50 focus:outline-none"
                  />
                </div>
                <Button type="submit" className="w-full justify-center">
                  Log in
                </Button>
                {showFormHint && (
                  <p className="text-center text-xs text-muted">
                    This is a prototype — use the demo account below to continue.
                  </p>
                )}
              </form>

              <div className="my-5 flex items-center gap-3">
                <span className="h-px flex-1 bg-ink/10" aria-hidden="true" />
                <span className="text-xs text-muted">or</span>
                <span className="h-px flex-1 bg-ink/10" aria-hidden="true" />
              </div>

              <Button
                type="button"
                variant="secondary"
                className="w-full justify-center"
                onClick={() => handleDemoLogin('citizen')}
              >
                Use Demo Citizen Account
              </Button>
            </>
          )}

          {mode === 'authority' && (
            <>
              <button
                type="button"
                onClick={() => selectMode('choice')}
                className="mb-4 flex items-center gap-1.5 text-xs font-medium text-muted hover:text-ink"
              >
                <ArrowLeft size={13} />
                Back
              </button>

              <div className="mb-4 flex items-start gap-2 rounded-lg bg-ink/[0.04] px-3.5 py-3 text-xs text-muted">
                <ShieldCheck size={15} className="mt-0.5 shrink-0 text-primary-dark" />
                <span>Restricted to verified waste-management personnel.</span>
              </div>

              <form onSubmit={handleMockSubmit} className="space-y-4">
                <div>
                  <label htmlFor="authority-id" className="text-xs font-medium text-muted">
                    Authority ID
                  </label>
                  <input
                    id="authority-id"
                    type="text"
                    autoComplete="username"
                    placeholder="e.g. WM-2451"
                    className="mt-1.5 w-full rounded-lg border border-ink/10 bg-surface px-3.5 py-2.5 text-sm text-ink placeholder:text-muted/70 focus:border-primary/50 focus:outline-none"
                  />
                </div>
                <div>
                  <label htmlFor="authority-password" className="text-xs font-medium text-muted">
                    Password
                  </label>
                  <input
                    id="authority-password"
                    type="password"
                    autoComplete="current-password"
                    placeholder="••••••••"
                    className="mt-1.5 w-full rounded-lg border border-ink/10 bg-surface px-3.5 py-2.5 text-sm text-ink placeholder:text-muted/70 focus:border-primary/50 focus:outline-none"
                  />
                </div>
                <Button type="submit" className="w-full justify-center">
                  Login as Authority
                </Button>
                {showFormHint && (
                  <p className="text-center text-xs text-muted">
                    This is a prototype — use the demo account below to continue.
                  </p>
                )}
              </form>

              <div className="my-5 flex items-center gap-3">
                <span className="h-px flex-1 bg-ink/10" aria-hidden="true" />
                <span className="text-xs text-muted">or</span>
                <span className="h-px flex-1 bg-ink/10" aria-hidden="true" />
              </div>

              <Button
                type="button"
                variant="secondary"
                className="w-full justify-center"
                onClick={() => handleDemoLogin('authority')}
              >
                Use Demo Authority Account
              </Button>
            </>
          )}
        </Card>
      </div>
    </div>
  )
}
