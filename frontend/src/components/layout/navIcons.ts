import type { ComponentType } from 'react'
import {
  LayoutDashboard,
  Route as RouteIcon,
  ClipboardCheck,
  MessageSquarePlus,
  ClipboardList,
} from 'lucide-react'

export type NavIcon = ComponentType<{ size?: number; strokeWidth?: number; className?: string }>

export const NAV_ICONS: Record<string, NavIcon> = {
  '/dashboard': LayoutDashboard,
  '/routes': RouteIcon,
  '/citizen-reports': ClipboardCheck,
  '/report': MessageSquarePlus,
  '/my-reports': ClipboardList,
}
