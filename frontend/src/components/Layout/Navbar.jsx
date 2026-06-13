import { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import {
  LogOut, User, PieChart, Home,
  Activity, Eye, Menu, X, ChevronDown, Settings
} from 'lucide-react'

const Navbar = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const [isMarketOpen, setIsMarketOpen] = useState(false)
  const [now, setNow] = useState(new Date())

  useEffect(() => {
    const tick = () => {
      const n = new Date()
      setNow(n)
      const nepal = new Date(n.toLocaleString('en-US', { timeZone: 'Asia/Kathmandu' }))
      const day = nepal.getDay()
      const hours = nepal.getHours()
      setIsMarketOpen(day >= 0 && day <= 4 && hours >= 11 && hours < 15)
    }
    tick()
    const interval = setInterval(tick, 1000)
    return () => clearInterval(interval)
  }, [])

  const handleLogout = () => { logout(); navigate('/login') }
  const isActive = (path) => location.pathname === path

  const navLinks = user
    ? [
      { to: '/dashboard', label: 'Dashboard', icon: <Home className="h-3.5 w-3.5" /> },
      { to: '/portfolio', label: 'Portfolio', icon: <PieChart className="h-3.5 w-3.5" /> },
      { to: '/market', label: 'Market', icon: <Activity className="h-3.5 w-3.5" /> },
      { to: '/watchlist', label: 'Watchlist', icon: <Eye className="h-3.5 w-3.5" /> },
    ]
    : [
      { to: '/market', label: 'Market', icon: <Activity className="h-3.5 w-3.5" /> },
    ]

  const nepalTime = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Kathmandu' }))
    .toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit' })

  return (
    <nav className="bg-panel border-b border-line sticky top-0 z-50">
      {/* status strip */}
      <div className="bg-ink text-paper">
        <div className="max-w-[1400px] mx-auto px-4 h-7 flex items-center justify-between text-[11px]">
          <div className="flex items-center gap-2">
            <span className={`h-1.5 w-1.5 rounded-full ${isMarketOpen ? 'bg-[var(--color-up)] animate-blink' : 'bg-[var(--color-down)]'}`} />
            <span className="font-mono tracking-wide">
              NEPSE {isMarketOpen ? 'OPEN' : 'CLOSED'}
            </span>
          </div>
          <div className="font-mono tracking-wide text-paper/70 flex items-center gap-3">
            <span className="hidden sm:inline">KATHMANDU</span>
            <span className="tnum text-paper">{nepalTime}</span>
          </div>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-4">
        <div className="flex justify-between items-center h-14">

          {/* Logo */}
          <Link to={user ? '/dashboard' : '/'} className="flex items-center gap-2.5 no-underline group">
            <div className="w-8 h-8 bg-panel border border-line flex items-center justify-center overflow-hidden p-1 rounded-md">
              <img src="/favicon.png" alt="NEPSE" className="w-full h-full object-contain" />
            </div>
            <span className="text-[15px] font-bold text-ink tracking-tight">
              NEPSE<span className="accent">·TERM</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center">
            {navLinks.map(link => (
              <Link
                key={link.to}
                to={link.to}
                className={`flex items-center gap-1.5 px-3.5 h-14 text-[13px] font-medium transition-colors no-underline border-b-2 -mb-px ${isActive(link.to)
                  ? 'text-ink border-[var(--color-accent)]'
                  : 'text-muted border-transparent hover:text-ink'
                  }`}
              >
                {link.icon}
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right side - Desktop */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="flex items-center gap-2 pl-1 pr-2 py-1 border border-line rounded-lg hover:border-line-strong transition-colors"
                >
                  {user.avatar ? (
                    <img src={user.avatar} alt={user.name} className="h-6 w-6 rounded-md object-cover" />
                  ) : (
                    <div className="h-6 w-6 rounded-md bg-ink flex items-center justify-center">
                      <span className="text-[11px] font-semibold text-paper">{user.name?.charAt(0)?.toUpperCase()}</span>
                    </div>
                  )}
                  <span className="text-[13px] font-medium text-ink">{user.name?.split(' ')[0]}</span>
                  <ChevronDown className={`h-3.5 w-3.5 text-faint transition-transform ${profileOpen ? 'rotate-180' : ''}`} />
                </button>

                {profileOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setProfileOpen(false)} />
                    <div className="absolute right-0 top-full mt-1.5 w-60 panel shadow-lg p-1.5 z-50">
                      <div className="px-3 py-2.5 border-b border-line mb-1">
                        <p className="text-[13px] font-semibold text-ink">{user.name}</p>
                        <p className="text-[11px] text-muted truncate font-mono">{user.email}</p>
                      </div>
                      <Link to="/profile?tab=overview" onClick={() => setProfileOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-md text-[13px] font-medium text-muted hover:text-ink hover:bg-sunk transition-colors no-underline">
                        <User className="h-3.5 w-3.5" /> Profile
                      </Link>
                      <Link to="/profile?tab=preferences" onClick={() => setProfileOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-md text-[13px] font-medium text-muted hover:text-ink hover:bg-sunk transition-colors no-underline">
                        <Settings className="h-3.5 w-3.5" /> Settings
                      </Link>
                      <button onClick={() => { setProfileOpen(false); handleLogout() }}
                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-md text-[13px] font-medium down hover:bg-[var(--color-down)]/8 transition-colors">
                        <LogOut className="h-3.5 w-3.5" /> Sign Out
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login" className="btn btn-ghost no-underline">Sign In</Link>
                <Link to="/register" className="btn btn-accent no-underline">Get Started</Link>
              </div>
            )}
          </div>

          {/* Mobile button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 text-muted hover:text-ink transition-colors"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden bg-panel border-t border-line absolute w-full left-0 shadow-lg">
          <div className="max-w-[1400px] mx-auto px-4 py-3 space-y-0.5">
            {navLinks.map(link => (
              <Link key={link.to} to={link.to} onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-2.5 px-3 py-2.5 rounded-md text-[13px] font-medium transition-colors no-underline ${isActive(link.to)
                  ? 'bg-sunk text-ink' : 'text-muted hover:text-ink'}`}>
                {link.icon} {link.label}
              </Link>
            ))}
            <div className="border-t border-line my-2" />
            {user ? (
              <>
                <div className="px-3 py-2">
                  <p className="text-[13px] font-semibold text-ink">{user.name}</p>
                  <p className="text-[11px] text-muted truncate font-mono">{user.email}</p>
                </div>
                <Link to="/profile?tab=overview" onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2.5 rounded-md text-[13px] font-medium text-muted hover:text-ink transition-colors no-underline">
                  <User className="h-3.5 w-3.5" /> Profile
                </Link>
                <Link to="/profile?tab=preferences" onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2.5 rounded-md text-[13px] font-medium text-muted hover:text-ink transition-colors no-underline">
                  <Settings className="h-3.5 w-3.5" /> Settings
                </Link>
                <button onClick={() => { setMobileOpen(false); handleLogout() }}
                  className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-md text-[13px] font-medium down transition-colors">
                  <LogOut className="h-3.5 w-3.5" /> Sign Out
                </button>
              </>
            ) : (
              <div className="flex flex-col gap-2 pt-1">
                <Link to="/login" onClick={() => setMobileOpen(false)} className="btn btn-ghost w-full no-underline">Sign In</Link>
                <Link to="/register" onClick={() => setMobileOpen(false)} className="btn btn-accent w-full no-underline">Get Started</Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}

export default Navbar
