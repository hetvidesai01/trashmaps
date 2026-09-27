import { BrowserRouter, Routes as RouterRoutes, Route } from 'react-router-dom'
import { AppLayout } from './components/layout/AppLayout'
import { Home } from './pages/Home'
import { Dashboard } from './pages/Dashboard'
import { WasteMap } from './pages/WasteMap'
import { Routes } from './pages/Routes'
import { ReportWaste } from './pages/ReportWaste'
import { MyReports } from './pages/MyReports'

function App() {
  return (
    <BrowserRouter>
      <RouterRoutes>
        <Route element={<AppLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/map" element={<WasteMap />} />
          <Route path="/routes" element={<Routes />} />
          <Route path="/report" element={<ReportWaste />} />
          <Route path="/my-reports" element={<MyReports />} />
        </Route>
      </RouterRoutes>
    </BrowserRouter>
  )
}

export default App
