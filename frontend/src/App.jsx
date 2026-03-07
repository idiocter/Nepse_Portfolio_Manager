import { Routes, Route } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import Navbar from './components/Layout/Navbar'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Portfolio from './pages/Portfolio'
import StockDetail from './pages/StockDetail'
import PrivateRoute from './components/Layout/PrivateRoute'

function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
            <Route path="/portfolio" element={<PrivateRoute><Portfolio /></PrivateRoute>} />
            <Route path="/stock/:symbol" element={<PrivateRoute><StockDetail /></PrivateRoute>} />
          </Routes>
        </main>
      </div>
    </AuthProvider>
  )
}

export default App