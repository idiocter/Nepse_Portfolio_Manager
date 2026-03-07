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
    <nav className="bg-white border-b border-zinc-100 sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-6">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link to={user ? '/dashboard' : '/'} className="flex items-center gap-3 no-underline group">
            <div className="w-10 h-10 rounded-xl bg-zinc-900 flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform duration-300">
              <TrendingUp className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-black text-zinc-900 tracking-tighter">
              NEPSE<span className="text-zinc-500">Tracker</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map(link => (
              <Link
                key={link.to}
                to={link.to}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 no-underline ${isActive(link.to)
                  ? 'bg-zinc-100 text-zinc-900 shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-900 hover:bg-zinc-50'
                  }`}
              >
                {link.icon}
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right side */}
          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="flex items-center gap-3 px-4 py-2 rounded-2xl border border-transparent hover:border-zinc-100 hover:bg-zinc-50 transition-all duration-200"
                >
                  {user.avatar ? (
                    <img src={user.avatar} alt={user.name} className="h-9 w-9 rounded-xl object-cover ring-2 ring-zinc-100" />
                  ) : (
                    <div className="h-9 w-9 rounded-xl bg-zinc-900 flex items-center justify-center">
                      <span className="text-sm font-black text-white">{user.name?.charAt(0)?.toUpperCase()}</span>
                    </div>
                  )}
                  <span className="text-sm font-bold text-zinc-700">{user.name?.split(' ')[0]}</span>
                  <ChevronDown className={`h-4 w-4 text-zinc-400 transition-transform duration-300 ${profileOpen ? 'rotate-180' : ''}`} />
                </button>

                {profileOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setProfileOpen(false)} />
                    <div className="absolute right-0 top-full mt-3 w-64 bg-white rounded-2xl shadow-2xl shadow-zinc-200 border border-zinc-100 p-2.5 z-50 animate-fade-in" style={{ animationDuration: '0.2s' }}>
                      <div className="px-4 py-3 border-b border-zinc-50 mb-2">
                        <p className="text-sm font-black text-zinc-900">{user.name}</p>
                        <p className="text-xs font-medium text-zinc-400">{user.email}</p>
                      </div>
                      <Link
                        to="/profile"
                        className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50 transition-all no-underline"
                        onClick={() => setProfileOpen(false)}
                      >
                        <User className="h-4 w-4 text-zinc-400" />
                        My Profile
                      </Link>
                      <button
                        onClick={() => { setProfileOpen(false); handleLogout() }}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-rose-600 hover:bg-rose-50 transition-all"
                      >
                        <LogOut className="h-4 w-4" />
                        Sign Out
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <Link to="/login" className="px-6 py-2.5 text-sm font-bold text-zinc-500 hover:text-zinc-900 hover:bg-zinc-50 rounded-xl transition-all no-underline">Sign In</Link>
                <Link to="/register" className="px-6 py-2.5 text-sm font-bold bg-zinc-900 text-white hover:bg-zinc-800 rounded-xl transition-all shadow-lg shadow-zinc-200 no-underline">Get Started</Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 text-zinc-400 hover:text-zinc-900 transition-colors"
          >
            {mobileOpen ? <X className="h-7 w-7" /> : <Menu className="h-7 w-7" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden bg-white border-t border-zinc-50 animate-fade-in" style={{ animationDuration: '0.3s' }}>
          <div className="container mx-auto px-6 py-6 space-y-3">
            {navLinks.map(link => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-4 px-5 py-4 rounded-2xl text-base font-bold transition-all no-underline ${isActive(link.to)
                  ? 'bg-zinc-100 text-zinc-900'
                  : 'text-zinc-500 hover:text-zinc-900 hover:bg-zinc-50'
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
                  className="flex items-center gap-4 px-5 py-4 rounded-2xl text-base font-bold text-zinc-500 hover:text-zinc-900 hover:bg-zinc-50 transition-all no-underline"
                >
                  <User className="h-5 w-5" />
                  Profile
                </Link>
                <button
                  onClick={() => { setMobileOpen(false); handleLogout() }}
                  className="w-full flex items-center gap-4 px-5 py-4 rounded-2xl text-base font-bold text-rose-600 hover:bg-rose-50 transition-all"
                >
                  <LogOut className="h-5 w-5" />
                  Sign Out
                </button>
              </>
            ) : (
              <div className="flex flex-col gap-3 pt-4 border-t border-zinc-100">
                <Link to="/login" onClick={() => setMobileOpen(false)} className="w-full py-4 text-center font-bold text-zinc-600 border border-zinc-200 rounded-2xl no-underline">Sign In</Link>
                <Link to="/register" onClick={() => setMobileOpen(false)} className="w-full py-4 text-center font-bold bg-zinc-900 text-white rounded-2xl no-underline">Get Started</Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}

export default Navbar