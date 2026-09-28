import { useState } from 'react'
import type { FormEvent } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import { LayoutDashboard, MessageSquarePlus, Trash2 } from 'lucide-react'
import { Button } from '../../components/common/Button'
import { Card } from '../../components/common/Card'
import { useAuth } from '../../auth/AuthContext'
import { ROLE_HOME } from '../../auth/roleHome'
import type { UserRole } from '../../auth/authStorage'

interface LocationState {
  from?: string
}

export function Login() {
  const { isAuthenticated, role, login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [showDemoHint, setShowDemoHint] = useState(false)

  if (isAuthenticated && role) {
    return <Navigate to={ROLE_HOME[role]} replace />
  }

  const redirectTo = (location.state as LocationState | null)?.from

  function handleDemoLogin(nextRole: UserRole) {
    login(nextRole)
    navigate(redirectTo ?? ROLE_HOME[nextRole], { replace: true })
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setShowDemoHint(true)
  }

  return (
    <div className="flex min-h-svh items-center justify-center bg-bg px-5 py-12">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center text-center">
          <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-dark text-accent">
            <Trash2 size={22} strokeWidth={2.25} />
          </span>
          <h1 className="mt-4 font-display text-2xl font-semibold text-ink">TrashMaps</h1>
          <p className="mt-1.5 max-w-xs text-sm text-muted">
            Smarter collection routes for authorities, and a direct line to report waste for
            citizens.
          </p>
        </div>

        <Card className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="text-xs font-medium text-muted">
                Email
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                className="mt-1.5 w-full rounded-lg border border-ink/10 bg-surface px-3.5 py-2.5 text-sm text-ink placeholder:text-muted/70 focus:border-primary/50 focus:outline-none"
              />
            </div>
            <div>
              <label htmlFor="password" className="text-xs font-medium text-muted">
                Password
              </label>
              <input
                id="password"
                type="password"
                autoComplete="current-password"
                placeholder="••••••••"
                className="mt-1.5 w-full rounded-lg border border-ink/10 bg-surface px-3.5 py-2.5 text-sm text-ink placeholder:text-muted/70 focus:border-primary/50 focus:outline-none"
              />
            </div>
            <Button type="submit" className="w-full justify-center">
              Log in
            </Button>
            {showDemoHint && (
              <p className="text-center text-xs text-muted">
                This is a prototype — use a demo option below to continue.
              </p>
            )}
          </form>

          <div className="my-5 flex items-center gap-3">
            <span className="h-px flex-1 bg-ink/10" aria-hidden="true" />
            <span className="text-xs text-muted">or try a demo role</span>
            <span className="h-px flex-1 bg-ink/10" aria-hidden="true" />
          </div>

          <div className="space-y-2.5">
            <button
              type="button"
              onClick={() => handleDemoLogin('authority')}
              className="flex w-full items-center gap-3 rounded-lg border border-ink/10 px-4 py-3 text-left transition-colors hover:border-primary/40 hover:bg-primary/5"
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary-dark">
                <LayoutDashboard size={17} strokeWidth={2} />
              </span>
              <span>
                <span className="block text-sm font-medium text-ink">Continue as Authority</span>
                <span className="block text-xs text-muted">
                  Dashboard, route operations &amp; report verification
                </span>
              </span>
            </button>
            <button
              type="button"
              onClick={() => handleDemoLogin('citizen')}
              className="flex w-full items-center gap-3 rounded-lg border border-ink/10 px-4 py-3 text-left transition-colors hover:border-primary/40 hover:bg-primary/5"
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-accent/15 text-primary-dark">
                <MessageSquarePlus size={17} strokeWidth={2} />
              </span>
              <span>
                <span className="block text-sm font-medium text-ink">Continue as Citizen</span>
                <span className="block text-xs text-muted">Report waste &amp; track your reports</span>
              </span>
            </button>
          </div>
        </Card>
      </div>
    </div>
  )
}
