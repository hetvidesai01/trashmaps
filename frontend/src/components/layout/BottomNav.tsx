import { NavLink } from 'react-router-dom'
import type { NavItem } from '../../constants/nav'
import { NAV_ICONS } from './navIcons'

interface BottomNavProps {
  items: NavItem[]
}

/**
 * Thumb-reach tab bar shown below the lg breakpoint. Its height is exposed as
 * --bottom-nav-h (index.css) so full-bleed screens can sit exactly above it,
 * and it pads for the home-indicator safe area.
 */
export function BottomNav({ items }: BottomNavProps) {
  return (
    <nav
      aria-label="Main"
      className="fixed inset-x-0 bottom-0 z-[900] flex h-[var(--bottom-nav-h)] items-start gap-1 border-t border-line bg-surface px-2 pt-2 shadow-[0_-8px_24px_rgba(36,53,46,0.06)] lg:hidden"
    >
      {items.map((item) => {
        const Icon = NAV_ICONS[item.path]
        return (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `tm-press flex min-h-[3rem] min-w-0 flex-1 flex-col items-center justify-center gap-0.5 rounded-2xl px-1 text-[11px] font-bold ${
                isActive ? 'bg-sage text-primary-dark' : 'text-muted'
              }`
            }
          >
            {({ isActive }) => (
              <>
                {Icon && <Icon size={22} strokeWidth={isActive ? 2.4 : 2} />}
                <span className="max-w-full truncate">{item.label}</span>
              </>
            )}
          </NavLink>
        )
      })}
    </nav>
  )
}
