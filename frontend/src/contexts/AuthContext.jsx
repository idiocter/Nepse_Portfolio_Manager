import { createContext, useState, useContext, useEffect } from 'react'
import axios from 'axios'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
      fetchUser()
    } else {
      setLoading(false)
    }
  }, [])

  const fetchUser = async () => {
    try {
      const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/api/auth/me`)
      setUser(data)
    } catch (error) {
      logout()
    } finally {
      setLoading(false)
    }
  }

  const login = async (email, password) => {
    const { data } = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/login`, {
      email,
      password
    })
    localStorage.setItem('token', data.token)
    axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`
    setUser(data.user)
    return data
  }

  const googleLogin = async (credential) => {
    const { data } = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/google`, {
      credential
    })
    localStorage.setItem('token', data.token)
    axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`
    setUser(data.user)
    return data
  }

  const register = async (name, email, password) => {
    const { data } = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/register`, {
      name,
      email,
      password
    })
    localStorage.setItem('token', data.token)
    axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`
    setUser(data.user)
    return data
  }

  const logout = () => {
    localStorage.removeItem('token')
    delete axios.defaults.headers.common['Authorization']
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, register, googleLogin, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)