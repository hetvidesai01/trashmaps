import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../auth/AuthContext'
import { ROLE_HOME } from '../../auth/roleHome'
import { CITIZEN_PRIMARY_NAV } from '../../constants/nav'
import { LeafMark } from '../illustrations'
import { NAV_ICONS } from './navIcons'
import { ResetDemoButton } from './ResetDemoButton'

/**
 * Header for citizens and signed-out visitors. Citizens get inline nav on
 * desktop (mobile uses the bottom tab bar instead).
 */
export function TopBar() {
  const { user, role, logout } = useAuth()
  const navigate = useNavigate()

  return (
    <header className="sticky top-0 z-30 border-b border-line/70 bg-bg/95 backdrop-blur-sm">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-3 lg:px-8">
        <Link to={role ? ROLE_HOME[role] : '/'} className="flex items-center gap-2.5 text-primary-dark">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-dark">
            <LeafMark className="h-6 w-6" tone="light" />
          </span>
          <span className="font-display text-lg font-semibold tracking-tight">TrashMaps</span>
        </Link>

        {role === 'citizen' && (
          <nav className="hidden items-center gap-1 lg:flex" aria-label="Main">
            {CITIZEN_PRIMARY_NAV.map((item) => {
              const Icon = NAV_ICONS[item.path]
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    `tm-press flex items-center gap-2 rounded-2xl px-4 py-2 text-sm font-bold ${
                      isActive ? 'bg-sage text-primary-dark' : 'text-muted hover:bg-ink/5 hover:text-ink'
                    }`
                  }
                >
                  {Icon && <Icon size={16} strokeWidth={2.25} />}
                  {item.label}
                </NavLink>
              )
            })}
          </nav>
        )}

        {user ? (
          <div className="flex items-center gap-1">
            <span className="mr-1 hidden text-xs font-semibold text-muted sm:inline">{user.name}</span>
            <ResetDemoButton />
            <button
              type="button"
              onClick={() => {
                logout()
                navigate('/login', { replace: true })
              }}
              className="hidden rounded-xl px-3 py-2 text-xs font-bold text-muted transition-colors hover:bg-ink/5 hover:text-ink lg:block"
            >
              Log out
            </button>
          </div>
        ) : (
          <Link
            to="/login"
            className="tm-press rounded-2xl bg-primary-dark px-4 py-2 text-sm font-bold text-white shadow-button hover:bg-primary"
          >
            Log in
          </Link>
        )}
      </div>
    </header>
  )
}
