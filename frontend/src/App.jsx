import { Routes, Route } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import Navbar from './components/Layout/Navbar'
import PrivateRoute from './components/Layout/PrivateRoute'
import Landing from './pages/Landing'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Portfolio from './pages/Portfolio'
import StockDetail from './pages/StockDetail'
import Market from './pages/Market'
import Watchlist from './pages/Watchlist'
import Profile from './pages/Profile'

function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-paper text-ink">
        <Navbar />
        <main>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/market" element={<Market />} />

            {/* Protected routes */}
            <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
            <Route path="/portfolio" element={<PrivateRoute><Portfolio /></PrivateRoute>} />
            <Route path="/stock/:symbol" element={<PrivateRoute><StockDetail /></PrivateRoute>} />
            <Route path="/watchlist" element={<PrivateRoute><Watchlist /></PrivateRoute>} />
            <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
          </Routes>
        </main>
      </div>
    </AuthProvider>
  )
}

export default App
