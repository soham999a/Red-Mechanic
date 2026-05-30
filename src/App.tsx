import { Routes, Route, useLocation } from 'react-router-dom'
import Sidebar from './components/Sidebar'
import Landing from './pages/Landing'
import Diagnostics from './pages/Diagnostics'
import Results from './pages/Results'
import Matching from './pages/Matching'
import ShopDetail from './pages/ShopDetail'
import Dashboard from './pages/Dashboard'
import History from './pages/History'

export default function App() {
  const location = useLocation()
  const isLanding = location.pathname === '/'

  return (
    <div className="flex min-h-screen bg-bg">
      {!isLanding && <Sidebar />}
      <main className={`flex-1 ${isLanding ? '' : 'ml-[240px]'}`}>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/diagnostics" element={<Diagnostics />} />
          <Route path="/results" element={<Results />} />
          <Route path="/matching" element={<Matching />} />
          <Route path="/shop/:id" element={<ShopDetail />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/history" element={<History />} />
        </Routes>
      </main>
    </div>
  )
}
