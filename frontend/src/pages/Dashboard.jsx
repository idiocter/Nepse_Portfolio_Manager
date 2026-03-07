import { useState, useEffect } from 'react'
import axios from 'axios'
import PortfolioSummary from '../components/Dashboard/PortfolioSummary'
import AllocationChart from '../components/Dashboard/AllocationChart'
import HoldingsTable from '../components/Dashboard/HoldingsTable'
import TopMovers from '../components/Dashboard/TopMovers'

const Dashboard = () => {
  const [portfolio, setPortfolio] = useState({ holdings: [], summary: {} })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchPortfolio()
    // Poll every 10 seconds during market hours
    const interval = setInterval(fetchPortfolio, 10000)
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
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <div className="text-sm text-gray-500">
          Last updated: {new Date().toLocaleTimeString()}
        </div>
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