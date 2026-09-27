import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { LayoutDashboard, Map, Route as RouteIcon, MessageSquarePlus, ClipboardList, Menu, X, Trash2 } from 'lucide-react'
import { PRIMARY_NAV, SECONDARY_NAV } from '../../constants/nav'

const PRIMARY_ICONS = [LayoutDashboard, RouteIcon, Map]
const SECONDARY_ICONS = [MessageSquarePlus, ClipboardList]

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

  return (
    <header className="sticky top-0 z-30 bg-primary-dark">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-3 lg:px-8">
        <NavLink to="/" className="flex items-center gap-2 text-white" onClick={() => setIsMenuOpen(false)}>
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent/90 text-primary-dark">
            <Trash2 size={18} strokeWidth={2.25} />
          </span>
          <span className="font-display text-lg font-semibold tracking-tight">TrashMaps</span>
        </NavLink>

        <nav className="hidden items-center lg:flex">
          <ul className="flex items-center">
            {PRIMARY_NAV.map((item, index) => {
              const Icon = PRIMARY_ICONS[index]
              return (
                <li key={item.path}>
                  <NavLink to={item.path} className={primaryLinkClasses}>
                    {({ isActive }) => (
                      <>
                        <Icon size={16} strokeWidth={2.25} />
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

          <span className="mx-4 h-6 w-px bg-white/15" aria-hidden="true" />

          <ul className="flex items-center gap-1">
            {SECONDARY_NAV.map((item, index) => {
              const Icon = SECONDARY_ICONS[index]
              return (
                <li key={item.path}>
                  <NavLink to={item.path} className={secondaryLinkClasses}>
                    <Icon size={14} strokeWidth={2} />
                    {item.label}
                  </NavLink>
                </li>
              )
            })}
          </ul>
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
          <p className="pt-3 pb-1 text-xs font-medium text-white/40">Operations</p>
          <ul className="flex flex-col">
            {PRIMARY_NAV.map((item, index) => {
              const Icon = PRIMARY_ICONS[index]
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
                    <Icon size={17} strokeWidth={2.25} />
                    {item.label}
                  </NavLink>
                </li>
              )
            })}
          </ul>
          <p className="pt-3 pb-1 text-xs font-medium text-white/40">Citizen reporting</p>
          <ul className="flex flex-col">
            {SECONDARY_NAV.map((item, index) => {
              const Icon = SECONDARY_ICONS[index]
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
                    <Icon size={15} strokeWidth={2} />
                    {item.label}
                  </NavLink>
                </li>
              )
            })}
          </ul>
        </nav>
      )}
    </header>
  )
}
