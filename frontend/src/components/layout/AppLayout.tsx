import { Outlet } from 'react-router-dom'
import { Navbar } from './Navbar'

export function AppLayout() {
  return (
    <div className="flex min-h-svh flex-col bg-bg">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  )
}
