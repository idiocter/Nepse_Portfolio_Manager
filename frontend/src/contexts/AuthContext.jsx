import { createContext, useState, useContext, useEffect } from 'react'
import authService from '../services/authService'
import api from '../services/api'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      fetchUser()
    } else {
      setLoading(false)
    }
  }, [])

  const fetchUser = async () => {
    try {
      const data = await authService.getCurrentUser()
      setUser(data)
    } catch (error) {
      logout()
    } finally {
      setLoading(false)
    }
  }

  const login = async (email, password) => {
    const data = await authService.login(email, password)
    localStorage.setItem('token', data.token)
    setUser(data.user)
    return data
  }

  const googleLogin = async (tokenData) => {
    const data = await authService.googleLogin(tokenData)
    localStorage.setItem('token', data.token)
    setUser(data.user)
    return data
  }

  const register = async (name, email, password) => {
    const data = await authService.register(name, email, password)
    localStorage.setItem('token', data.token)
    setUser(data.user)
    return data
  }

  const logout = () => {
    authService.logout()
    setUser(null)
  }

  const updatePreferences = async (newPreferences) => {
    try {
      const data = await authService.updatePreferences(newPreferences);
      setUser(prev => ({
        ...prev,
        preferences: data.preferences
      }));
      return data;
    } catch (error) {
      console.error('Failed to update preferences:', error);
      throw error;
    }
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, register, googleLogin, loading, updatePreferences }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)