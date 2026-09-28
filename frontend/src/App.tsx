import { BrowserRouter, Routes as RouterRoutes, Route } from 'react-router-dom'
import { AuthProvider } from './auth/AuthContext'
import { RequireAuth } from './components/auth/RequireAuth'
import { RequireRole } from './components/auth/RequireRole'
import { AppLayout } from './components/layout/AppLayout'
import { Home } from './pages/Home'
import { Login } from './pages/Login'
import { Dashboard } from './pages/Dashboard'
import { WasteMap } from './pages/WasteMap'
import { Routes } from './pages/Routes'
import { CitizenReports } from './pages/CitizenReports'
import { ReportWaste } from './pages/ReportWaste'
import { MyReports } from './pages/MyReports'

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <RouterRoutes>
          <Route path="/login" element={<Login />} />

          <Route element={<AppLayout />}>
            <Route path="/" element={<Home />} />

            <Route element={<RequireAuth />}>
              <Route element={<RequireRole role="authority" />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/routes" element={<Routes />} />
                <Route path="/citizen-reports" element={<CitizenReports />} />
                <Route path="/map" element={<WasteMap />} />
              </Route>

              <Route element={<RequireRole role="citizen" />}>
                <Route path="/report" element={<ReportWaste />} />
                <Route path="/my-reports" element={<MyReports />} />
              </Route>
            </Route>
          </Route>
        </RouterRoutes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
