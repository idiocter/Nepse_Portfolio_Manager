import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import {
  TrendingUp, LogOut, User, PieChart, Home,
  Activity, Eye, Menu, X, ChevronDown
} from 'lucide-react'

const Navbar = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const isActive = (path) => location.pathname === path

  const navLinks = user
    ? [
      { to: '/dashboard', label: 'Dashboard', icon: <Home className="h-4 w-4" /> },
      { to: '/portfolio', label: 'Portfolio', icon: <PieChart className="h-4 w-4" /> },
      { to: '/market', label: 'Market', icon: <Activity className="h-4 w-4" /> },
      { to: '/watchlist', label: 'Watchlist', icon: <Eye className="h-4 w-4" /> },
    ]
    : [
      { to: '/market', label: 'Market', icon: <Activity className="h-4 w-4" /> },
    ]

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to={user ? '/dashboard' : '/'} className="flex items-center gap-2.5 no-underline">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-md">
              <TrendingUp className="h-5 w-5 text-white" />
            </div>
            <span className="text-lg font-extrabold text-gray-900 tracking-tight">
              NEPSE<span className="text-primary-600">Tracker</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map(link => (
              <Link
                key={link.to}
                to={link.to}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all no-underline ${isActive(link.to)
                    ? 'bg-primary-50 text-primary-700'
                    : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'
                  }`}
              >
                {link.icon}
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right side */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl hover:bg-gray-100 transition-all"
                >
                  {user.avatar ? (
                    <img src={user.avatar} alt={user.name} className="h-8 w-8 rounded-lg object-cover ring-2 ring-primary-100" />
                  ) : (
                    <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center">
                      <span className="text-sm font-bold text-white">{user.name?.charAt(0)?.toUpperCase()}</span>
                    </div>
                  )}
                  <span className="text-sm font-medium text-gray-700">{user.name?.split(' ')[0]}</span>
                  <ChevronDown className={`h-3.5 w-3.5 text-gray-400 transition-transform ${profileOpen ? 'rotate-180' : ''}`} />
                </button>

                {profileOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setProfileOpen(false)} />
                    <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-200 p-2 z-50 animate-fade-in" style={{ animationDuration: '0.15s' }}>
                      <div className="px-3 py-2 border-b border-gray-100 mb-2">
                        <p className="text-sm font-semibold text-gray-900">{user.name}</p>
                        <p className="text-xs text-gray-400">{user.email}</p>
                      </div>
                      <Link
                        to="/profile"
                        className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition-colors no-underline"
                        onClick={() => setProfileOpen(false)}
                      >
                        <User className="h-4 w-4 text-gray-400" />
                        My Profile
                      </Link>
                      <button
                        onClick={() => { setProfileOpen(false); handleLogout() }}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <LogOut className="h-4 w-4" />
                        Sign Out
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link to="/login" className="btn-ghost no-underline">Sign In</Link>
                <Link to="/register" className="btn-primary no-underline">Get Started</Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 text-gray-500 hover:text-gray-700 transition-colors"
          >
            {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 animate-fade-in" style={{ animationDuration: '0.2s' }}>
          <div className="container mx-auto px-4 py-4 space-y-2">
            {navLinks.map(link => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all no-underline ${isActive(link.to)
                    ? 'bg-primary-50 text-primary-700'
                    : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
                  }`}
              >
                {link.icon}
                {link.label}
              </Link>
            ))}

            {user ? (
              <>
                <Link
                  to="/profile"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-500 hover:text-gray-900 hover:bg-gray-50 transition-all no-underline"
                >
                  <User className="h-4 w-4" />
                  Profile
                </Link>
                <button
                  onClick={() => { setMobileOpen(false); handleLogout() }}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 transition-all"
                >
                  <LogOut className="h-4 w-4" />
                  Sign Out
                </button>
              </>
            ) : (
              <div className="flex flex-col gap-2 pt-2 border-t border-gray-100">
                <Link to="/login" onClick={() => setMobileOpen(false)} className="btn-secondary text-center no-underline">Sign In</Link>
                <Link to="/register" onClick={() => setMobileOpen(false)} className="btn-primary text-center no-underline">Get Started</Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}

export default Navbar