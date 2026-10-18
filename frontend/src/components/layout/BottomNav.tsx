import { NavLink, useNavigate } from 'react-router-dom'
import { LogOut } from 'lucide-react'
import { useAuth } from '../../auth/AuthContext'
import type { NavItem } from '../../constants/nav'
import { NAV_ICONS } from './navIcons'

interface BottomNavProps {
  items: NavItem[]
}

/** Touch-friendly tab bar shown below the lg breakpoint. */
export function BottomNav({ items }: BottomNavProps) {
  const { logout } = useAuth()
  const navigate = useNavigate()

  const tab = 'flex flex-1 flex-col items-center gap-1 rounded-2xl px-1 py-2 text-[11px] font-bold'

  return (
    <nav
      aria-label="Main"
      className="fixed inset-x-0 bottom-0 z-[900] flex gap-1 border-t border-line bg-surface px-3 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-2 shadow-[0_-8px_24px_rgba(36,53,46,0.06)] lg:hidden"
    >
      {items.map((item) => {
        const Icon = NAV_ICONS[item.path]
        return (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `${tab} transition-colors ${isActive ? 'bg-sage text-primary-dark' : 'text-muted'}`
            }
          >
            {Icon && <Icon size={21} strokeWidth={2.1} />}
            {item.label}
          </NavLink>
        )
      })}
      <button
        type="button"
        onClick={() => {
          logout()
          navigate('/login', { replace: true })
        }}
        className={`${tab} text-muted`}
      >
        <LogOut size={21} strokeWidth={2.1} />
        Log out
      </button>
    </nav>
  )
}
