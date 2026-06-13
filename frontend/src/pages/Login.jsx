import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useGoogleLogin } from '@react-oauth/google'
import { useAuth } from '../contexts/AuthContext'
import { Mail, Lock, Eye, EyeOff, TrendingUp, ArrowRight } from 'lucide-react'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const { login, googleLogin } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await login(email, password)
      navigate('/dashboard')
    } catch (error) {
      alert(error.response?.data?.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  const googleLoginHandler = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        await googleLogin({ accessToken: tokenResponse.access_token })
        navigate('/dashboard')
      } catch (error) {
        alert('Google login failed')
      }
    },
    onError: () => {
      alert('Google login failed')
    }
  })

  return (
    <div className="min-h-screen sm:min-h-[90vh] flex items-center justify-center py-8 sm:py-12 lg:py-20 px-4 sm:px-6">
      <div className="w-full max-w-lg animate-fade-in-up">
        <div className="text-center mb-8 sm:mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-2xl sm:rounded-[32px] bg-zinc-900 shadow-2xl mb-6 sm:mb-8 group transition-transform hover:scale-110">
            <TrendingUp className="h-8 w-8 sm:h-10 sm:w-10 text-white" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-zinc-900 dark:text-zinc-100 tracking-tighter transition-colors">Welcome Back</h1>
          <p className="text-xs sm:text-sm font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-[0.15em] sm:tracking-[0.2em] mt-2 sm:mt-3 transition-colors">Access your market terminal</p>
        </div>

        <div className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-3xl sm:rounded-[40px] p-6 sm:p-8 lg:p-12 shadow-sm transition-all duration-300">
          <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
            <div>
              <label className="block text-[10px] sm:text-xs font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-[0.15em] sm:tracking-[0.2em] mb-2 sm:mb-3 ml-1 transition-colors">Email Terminal</label>
              <div className="relative group">
                <Mail className="absolute left-4 sm:left-5 top-1/2 -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-zinc-300 dark:text-zinc-600 group-focus-within:text-zinc-900 dark:group-focus-within:text-zinc-100 transition-colors" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-11 sm:pl-14 pr-4 sm:pr-6 py-4 sm:py-5 bg-zinc-50 dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-800 rounded-xl sm:rounded-2xl text-zinc-900 dark:text-zinc-100 font-bold text-sm sm:text-base placeholder:text-zinc-300 dark:placeholder:text-zinc-700 focus:bg-white dark:focus:bg-zinc-900 focus:border-zinc-900 dark:focus:border-zinc-100 focus:ring-4 focus:ring-zinc-900/5 dark:focus:ring-zinc-100/5 transition-all outline-none"
                  placeholder="name@company.com"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] sm:text-xs font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-[0.15em] sm:tracking-[0.2em] mb-2 sm:mb-3 ml-1 transition-colors">Secure Key</label>
              <div className="relative group">
                <Lock className="absolute left-4 sm:left-5 top-1/2 -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-zinc-300 dark:text-zinc-600 group-focus-within:text-zinc-900 dark:group-focus-within:text-zinc-100 transition-colors" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-11 sm:pl-14 pr-11 sm:pr-14 py-4 sm:py-5 bg-zinc-50 dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-800 rounded-xl sm:rounded-2xl text-zinc-900 dark:text-zinc-100 font-bold text-sm sm:text-base placeholder:text-zinc-300 dark:placeholder:text-zinc-700 focus:bg-white dark:focus:bg-zinc-900 focus:border-zinc-900 dark:focus:border-zinc-100 focus:ring-4 focus:ring-zinc-900/5 dark:focus:ring-zinc-100/5 transition-all outline-none"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 sm:right-5 top-1/2 -translate-y-1/2 text-zinc-300 dark:text-zinc-600 hover:text-zinc-900 dark:hover:text-zinc-100 transition-all"
                >
                  {showPassword ? <EyeOff className="h-4 w-4 sm:h-5 sm:w-5" /> : <Eye className="h-4 w-4 sm:h-5 sm:w-5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 py-4 sm:py-5 rounded-xl sm:rounded-2xl font-black text-xs sm:text-sm uppercase tracking-widest hover:bg-zinc-800 dark:hover:bg-zinc-200 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-zinc-200 dark:shadow-none disabled:opacity-50 flex items-center justify-center gap-2 sm:gap-3"
            >
              {loading ? (
                <><div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white/30 dark:border-zinc-900/30 border-t-white dark:border-t-zinc-900 rounded-full animate-spin" /> Authenticating...</>
              ) : (
                <>Sign In Securely <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5" /></>
              )}
            </button>
          </form>

          <div className="relative my-8 sm:my-10">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-zinc-100 dark:border-zinc-800" />
            </div>
            <div className="relative flex justify-center text-[10px] font-black uppercase tracking-[0.2em] sm:tracking-[0.3em]">
              <span className="px-4 sm:px-6 bg-white dark:bg-zinc-900 text-zinc-300 dark:text-zinc-700 transition-colors">Or connect with</span>
            </div>
          </div>

          <button
            onClick={() => googleLoginHandler()}
            className="w-full flex items-center justify-center gap-3 sm:gap-4 py-4 sm:py-5 rounded-xl sm:rounded-2xl border border-zinc-100 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 font-black text-xs sm:text-sm hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-all group"
          >
            <svg className="h-5 w-5 sm:h-6 sm:w-6 group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            <span>Google Network</span>
          </button>

          <p className="text-center text-[10px] sm:text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest mt-8 sm:mt-12 transition-colors">
            New to the platform?{' '}
            <Link to="/register" className="text-zinc-900 dark:text-zinc-100 border-b-2 border-zinc-900 dark:border-zinc-100 ml-1 hover:text-zinc-600 dark:hover:text-zinc-400 hover:border-zinc-600 dark:hover:border-zinc-400 transition-all">Create Account</Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Login