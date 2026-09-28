import { useState } from 'react'
import type { ComponentType } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard,
  Map,
  Route as RouteIcon,
  MessageSquarePlus,
  ClipboardList,
  ClipboardCheck,
  Menu,
  X,
  Trash2,
  LogOut,
} from 'lucide-react'
import { useAuth } from '../../auth/AuthContext'
import { ROLE_HOME } from '../../auth/roleHome'
import { AUTHORITY_PRIMARY_NAV, AUTHORITY_SECONDARY_NAV, CITIZEN_PRIMARY_NAV } from '../../constants/nav'
import type { NavItem } from '../../constants/nav'
import { ResetDemoButton } from './ResetDemoButton'

const NAV_ICONS: Record<string, ComponentType<{ size?: number; strokeWidth?: number }>> = {
  '/dashboard': LayoutDashboard,
  '/routes': RouteIcon,
  '/citizen-reports': ClipboardCheck,
  '/map': Map,
  '/report': MessageSquarePlus,
  '/my-reports': ClipboardList,
}

const primaryLinkClasses = ({ isActive }: { isActive: boolean }) =>
  `relative flex items-center gap-2 px-3 py-2 text-[15px] font-semibold transition-colors ${
    isActive ? 'text-white' : 'text-white/65 hover:text-white'
  }`

const secondaryLinkClasses = ({ isActive }: { isActive: boolean }) =>
  `flex items-center gap-1.5 px-2 py-1.5 text-sm transition-colors ${
    isActive ? 'text-white/90' : 'text-white/45 hover:text-white/75'
  }`

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { user, role, logout } = useAuth()
  const navigate = useNavigate()

  const primaryNav: NavItem[] =
    role === 'authority' ? AUTHORITY_PRIMARY_NAV : role === 'citizen' ? CITIZEN_PRIMARY_NAV : []
  const secondaryNav: NavItem[] = role === 'authority' ? AUTHORITY_SECONDARY_NAV : []

  function handleLogout() {
    logout()
    setIsMenuOpen(false)
    navigate('/login', { replace: true })
  }

  return (
    <header className="sticky top-0 z-30 bg-primary-dark">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-3 lg:px-8">
        <Link
          to={role ? ROLE_HOME[role] : '/'}
          className="flex items-center gap-2 text-white"
          onClick={() => setIsMenuOpen(false)}
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent/90 text-primary-dark">
            <Trash2 size={18} strokeWidth={2.25} />
          </span>
          <span className="font-display text-lg font-semibold tracking-tight">TrashMaps</span>
        </Link>

        <nav className="hidden items-center lg:flex">
          {primaryNav.length > 0 && (
            <ul className="flex items-center">
              {primaryNav.map((item) => {
                const Icon = NAV_ICONS[item.path]
                return (
                  <li key={item.path}>
                    <NavLink to={item.path} className={primaryLinkClasses}>
                      {({ isActive }) => (
                        <>
                          {Icon && <Icon size={16} strokeWidth={2.25} />}
                          {item.label}
                          <span
                            className={`absolute inset-x-3 -bottom-[13px] h-[2.5px] rounded-full bg-accent transition-opacity ${
                              isActive ? 'opacity-100' : 'opacity-0'
                            }`}
                          />
                        </>
                      )}
                    </NavLink>
                  </li>
                )
              })}
            </ul>
          )}

          {secondaryNav.length > 0 && (
            <>
              <span className="mx-4 h-6 w-px bg-white/15" aria-hidden="true" />
              <ul className="flex items-center gap-1">
                {secondaryNav.map((item) => {
                  const Icon = NAV_ICONS[item.path]
                  return (
                    <li key={item.path}>
                      <NavLink to={item.path} className={secondaryLinkClasses}>
                        {Icon && <Icon size={14} strokeWidth={2} />}
                        {item.label}
                      </NavLink>
                    </li>
                  )
                })}
              </ul>
            </>
          )}

          {user ? (
            <div className="ml-4 flex items-center gap-1 border-l border-white/15 pl-4">
              <span className="mr-1 text-xs text-white/50">{user.name}</span>
              <div className="relative">
                <ResetDemoButton />
              </div>
              <button
                type="button"
                onClick={handleLogout}
                aria-label="Log out"
                title="Log out"
                className="flex h-8 w-8 items-center justify-center rounded-lg text-white/50 hover:bg-white/10 hover:text-white"
              >
                <LogOut size={15} />
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="ml-4 rounded-lg bg-accent/90 px-3.5 py-2 text-sm font-medium text-primary-dark transition-colors hover:bg-accent"
            >
              Log in
            </Link>
          )}
        </nav>

        <button
          className="flex h-9 w-9 items-center justify-center rounded-lg text-white lg:hidden"
          onClick={() => setIsMenuOpen((open) => !open)}
          aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
        >
          {isMenuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {isMenuOpen && (
        <nav className="border-t border-white/10 px-5 pb-4 lg:hidden">
          {primaryNav.length > 0 && (
            <>
              <p className="pt-3 pb-1 text-xs font-medium text-white/40">
                {role === 'authority' ? 'Operations' : 'Citizen reporting'}
              </p>
              <ul className="flex flex-col">
                {primaryNav.map((item) => {
                  const Icon = NAV_ICONS[item.path]
                  return (
                    <li key={item.path}>
                      <NavLink
                        to={item.path}
                        onClick={() => setIsMenuOpen(false)}
                        className={({ isActive }) =>
                          `flex items-center gap-2.5 rounded-lg px-2 py-2.5 text-[15px] font-semibold ${
                            isActive ? 'text-white' : 'text-white/60'
                          }`
                        }
                      >
                        {Icon && <Icon size={17} strokeWidth={2.25} />}
                        {item.label}
                      </NavLink>
                    </li>
                  )
                })}
              </ul>
            </>
          )}

          {secondaryNav.length > 0 && (
            <>
              <p className="pt-3 pb-1 text-xs font-medium text-white/40">More</p>
              <ul className="flex flex-col">
                {secondaryNav.map((item) => {
                  const Icon = NAV_ICONS[item.path]
                  return (
                    <li key={item.path}>
                      <NavLink
                        to={item.path}
                        onClick={() => setIsMenuOpen(false)}
                        className={({ isActive }) =>
                          `flex items-center gap-2.5 rounded-lg px-2 py-2 text-sm ${
                            isActive ? 'text-white/90' : 'text-white/50'
                          }`
                        }
                      >
                        {Icon && <Icon size={15} strokeWidth={2} />}
                        {item.label}
                      </NavLink>
                    </li>
                  )
                })}
              </ul>
            </>
          )}

          {user ? (
            <div className="mt-3 flex items-center justify-between border-t border-white/10 pt-3">
              <span className="text-xs text-white/40">{user.name}</span>
              <div className="flex items-center gap-1">
                <ResetDemoButton iconColorClassName="text-white/40" />
                <button
                  type="button"
                  onClick={handleLogout}
                  aria-label="Log out"
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-white/40 hover:bg-white/10 hover:text-white"
                >
                  <LogOut size={15} />
                </button>
              </div>
            </div>
          ) : (
            <div className="mt-3 border-t border-white/10 pt-3">
              <Link
                to="/login"
                onClick={() => setIsMenuOpen(false)}
                className="block rounded-lg bg-accent/90 px-3 py-2 text-center text-sm font-medium text-primary-dark"
              >
                Log in
              </Link>
            </div>
          )}
        </nav>
      )}
    </header>
  )
}
