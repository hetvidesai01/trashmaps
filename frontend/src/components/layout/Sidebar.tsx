import { Link, NavLink, useNavigate } from 'react-router-dom'
import { LogOut } from 'lucide-react'
import { useAuth } from '../../auth/AuthContext'
import { ROLE_HOME } from '../../auth/roleHome'
import { AUTHORITY_PRIMARY_NAV } from '../../constants/nav'
import { LeafMark } from '../illustrations'
import { NAV_ICONS } from './navIcons'
import { ResetDemoButton } from './ResetDemoButton'

/** Deep-green navigation rail for the authority experience (desktop). */
export function Sidebar() {
  const { user, role, logout } = useAuth()
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate('/login', { replace: true })
  }

  return (
    <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col bg-primary-dark px-4 py-6 lg:flex">
      <Link to={role ? ROLE_HOME[role] : '/'} className="flex items-center gap-3 px-2">
        <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10">
          <LeafMark className="h-7 w-7" tone="light" />
        </span>
        <span className="font-display text-xl font-semibold tracking-tight text-white">TrashMaps</span>
      </Link>

      <nav className="mt-10 flex-1" aria-label="Main">
        <ul className="space-y-1.5">
          {AUTHORITY_PRIMARY_NAV.map((item) => {
            const Icon = NAV_ICONS[item.path]
            return (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    `tm-press flex items-center gap-3 rounded-2xl px-4 py-3 text-[15px] font-bold ${
                      isActive ? 'bg-sage text-primary-dark' : 'text-white/70 hover:bg-white/10 hover:text-white'
                    }`
                  }
                >
                  {Icon && <Icon size={18} strokeWidth={2.25} />}
                  {item.label}
                </NavLink>
              </li>
            )
          })}
        </ul>
      </nav>

      <div className="border-t border-white/10 pt-4">
        <div className="flex items-center gap-3 px-2">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-accent/30 text-sm font-extrabold text-white">
            {user?.name.charAt(0) ?? 'A'}
          </span>
          <div className="min-w-0">
            <p className="truncate text-sm font-bold text-white">{user?.name}</p>
            <p className="text-xs text-white/55">Waste management</p>
          </div>
        </div>
        <div className="mt-3 flex flex-col gap-1">
          <ResetDemoButton
            label="Reset demo data"
            className="w-full justify-start px-3 py-2 text-xs font-bold text-white/55 hover:bg-white/10 hover:text-white"
            popoverClassName="bottom-full left-0 mb-2"
          />
          <button
            type="button"
            onClick={handleLogout}
            className="flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-bold text-white/55 transition-colors hover:bg-white/10 hover:text-white"
          >
            <LogOut size={15} />
            Log out
          </button>
        </div>
      </div>
    </aside>
  )
}
