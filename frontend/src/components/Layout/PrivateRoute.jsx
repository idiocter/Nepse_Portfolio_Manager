import { Navigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="flex flex-col items-center gap-3 sm:gap-4">
          <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-b-2 border-primary-600"></div>
          <p className="text-xs sm:text-sm text-slate-500 animate-pulse">Authenticating...</p>
        </div>
      </div>
    )
  }

  return user ? children : <Navigate to="/login" />
}

export default PrivateRoute