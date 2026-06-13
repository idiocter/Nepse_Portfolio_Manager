import { Navigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] p-4">
        <div className="flex flex-col items-center gap-3">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-line border-b-[var(--color-accent)]" />
          <p className="label">AUTHENTICATING…</p>
        </div>
      </div>
    )
  }

  return user ? children : <Navigate to="/login" />
}

export default PrivateRoute
