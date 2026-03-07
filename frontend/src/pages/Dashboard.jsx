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
    }, 1000)
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
      <div className="animate-fade-in-up space-y-8 p-6">
        <div className="h-8 w-64 bg-zinc-100 animate-pulse rounded-lg mb-2" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-white border border-zinc-100 rounded-3xl p-8 shadow-sm">
              <div className="h-4 w-24 bg-zinc-100 animate-pulse rounded mb-4" />
              <div className="h-10 w-48 bg-zinc-100 animate-pulse rounded-lg" />
            </div>
          ))}
        </div>
        <div className="bg-white border border-zinc-100 rounded-3xl p-8 shadow-sm h-80">
          <div className="h-full w-full bg-zinc-50 animate-pulse rounded-2xl" />
        </div>
      </div>
    )
  }

  return (
    <div className="animate-fade-in-up space-y-12 pb-12">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-zinc-900 flex items-center gap-4 tracking-tighter">
            <LayoutDashboard className="h-8 w-8 text-zinc-900" />
            Welcome back, {user?.name?.split(' ')[0]}
          </h1>
          <div className="flex items-center gap-2 mt-2 text-sm font-bold text-zinc-400 uppercase tracking-widest">
            <Clock className="h-4 w-4" />
            Live Analytics • {lastUpdated.toLocaleTimeString()}
          </div>
        </div>
        <button
          onClick={() => { fetchPortfolio(); setLastUpdated(new Date()) }}
          className="px-6 py-3 bg-white border border-zinc-200 text-zinc-700 rounded-xl font-bold text-sm hover:bg-zinc-50 hover:border-zinc-300 transition-all flex items-center gap-3 shadow-sm active:scale-95"
        >
          <RefreshCw className="h-4 w-4" /> Refresh Data
        </button>
      </div>

      <PortfolioSummary summary={portfolio.summary} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <HoldingsTable holdings={portfolio.holdings} />
        </div>
        <div className="space-y-8">
          <AllocationChart holdings={portfolio.holdings} />
          <TopMovers />
        </div>
      </div>
    </div>
  )
}

export default Dashboard