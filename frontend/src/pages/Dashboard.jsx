import { useState, useEffect } from 'react'
import axios from 'axios'
import { useAuth } from '../contexts/AuthContext'
import PortfolioSummary from '../components/Dashboard/PortfolioSummary'
import AllocationChart from '../components/Dashboard/AllocationChart'
import HoldingsTable from '../components/Dashboard/HoldingsTable'
import TopMovers from '../components/Dashboard/TopMovers'
import { LayoutDashboard, Clock, RefreshCw } from 'lucide-react'

const Dashboard = () => {
  const { user } = useAuth()
  const [portfolio, setPortfolio] = useState({ holdings: [], summary: {} })
  const [loading, setLoading] = useState(true)
  const [lastUpdated, setLastUpdated] = useState(new Date())

  useEffect(() => {
    fetchPortfolio()
    const interval = setInterval(() => {
      fetchPortfolio()
      setLastUpdated(new Date())
    }, 10000)
    return () => clearInterval(interval)
  }, [])

  const fetchPortfolio = async () => {
    try {
      const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/api/portfolio`)
      setPortfolio(data)
    } catch (error) {
      console.error('Error fetching portfolio:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="page-enter space-y-6">
        <div className="skeleton h-8 w-56 mb-2" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => <div key={i} className="card h-28"><div className="skeleton h-4 w-24 mb-3" /><div className="skeleton h-8 w-32" /></div>)}
        </div>
        <div className="card h-64"><div className="skeleton h-full w-full" /></div>
      </div>
    )
  }

  return (
    <div className="page-enter space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
            <LayoutDashboard className="h-7 w-7 text-primary-600" />
            Welcome back, {user?.name?.split(' ')[0]}
          </h1>
          <div className="flex items-center gap-2 mt-1 text-sm text-gray-500">
            <Clock className="h-3.5 w-3.5" />
            Last updated: {lastUpdated.toLocaleTimeString()}
          </div>
        </div>
        <button onClick={() => { fetchPortfolio(); setLastUpdated(new Date()) }}
          className="btn-secondary flex items-center gap-2 self-start">
          <RefreshCw className="h-4 w-4" /> Refresh
        </button>
      </div>

      <PortfolioSummary summary={portfolio.summary} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <HoldingsTable holdings={portfolio.holdings} />
        </div>
        <div className="space-y-6">
          <AllocationChart holdings={portfolio.holdings} />
          <TopMovers />
        </div>
      </div>
    </div>
  )
}

export default Dashboard