import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '../contexts/AuthContext'
import portfolioService from '../services/portfolioService'
import { formatTime } from '../utils/formatters'
import PortfolioSummary from '../components/Dashboard/PortfolioSummary'
import AllocationChart from '../components/Dashboard/AllocationChart'
import HoldingsTable from '../components/Dashboard/HoldingsTable'
import TopMovers from '../components/Dashboard/TopMovers'
import {
  LayoutDashboard,
  Clock,
  RefreshCw,
  TrendingUp,
  TrendingDown,
  Wallet,
  PieChart,
  Activity,
  Target,
  BarChart3,
  Zap,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react'

const Dashboard = () => {
  const { user } = useAuth()
  const [portfolio, setPortfolio] = useState({ holdings: [], summary: {} })
  const [loading, setLoading] = useState(true)
  const [lastUpdated, setLastUpdated] = useState(new Date())

  // Separate data fetching from timestamp updates
  const fetchPortfolio = useCallback(async () => {
    try {
      const data = await portfolioService.getHoldings()
      setPortfolio(data)
      setLastUpdated(new Date())
    } catch (error) {
      console.error('Error fetching portfolio:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchPortfolio()
    // Poll every 10 seconds for data (not every 1 second)
    const dataInterval = setInterval(fetchPortfolio, 10000)
    return () => clearInterval(dataInterval)
  }, [fetchPortfolio])

  // Separate effect for live timestamp (updates every second without fetching data)
  useEffect(() => {
    const timeInterval = setInterval(() => {
      setLastUpdated(new Date())
    }, 1000)
    return () => clearInterval(timeInterval)
  }, [])

  const totalHoldings = portfolio.holdings?.length || 0
  const profitableStocks = portfolio.holdings?.filter(h => h.pnl > 0).length || 0
  const lossStocks = totalHoldings - profitableStocks
  const topGainer = portfolio.holdings?.reduce((max, h) => h.changePercent > max.changePercent ? h : max, portfolio.holdings[0] || {})

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
    <div className="animate-fade-in-up space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-zinc-900 flex items-center gap-4 tracking-tighter">
            <LayoutDashboard className="h-8 w-8 text-zinc-900" />
            Welcome back, {user?.name?.split(' ')[0]}
          </h1>
          <div className="flex items-center gap-2 mt-2 text-sm font-bold text-zinc-400 uppercase tracking-widest">
            <Clock className="h-4 w-4" />
            Live Analytics • {formatTime(lastUpdated)}
          </div>
        </div>
        <button
          onClick={fetchPortfolio}
          className="px-6 py-3 bg-white border border-zinc-200 text-zinc-700 rounded-xl font-bold text-sm hover:bg-zinc-50 hover:border-zinc-300 transition-all flex items-center gap-3 shadow-sm active:scale-95"
        >
          <RefreshCw className="h-4 w-4" /> Refresh Data
        </button>
      </div>


      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white border border-zinc-200 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="p-2 bg-zinc-100 rounded-xl">
              <Wallet className="h-5 w-5 text-zinc-700" />
            </div>
            <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Positions</span>
          </div>
          <p className="text-2xl font-black text-zinc-900">{totalHoldings}</p>
          <p className="text-xs font-bold text-zinc-500 mt-1">Total Holdings</p>
        </div>

        <div className="bg-white border border-zinc-200 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="p-2 bg-zinc-100 rounded-xl">
              <TrendingUp className="h-5 w-5 text-zinc-700" />
            </div>
            <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Winners</span>
          </div>
          <p className="text-2xl font-black text-zinc-900">{profitableStocks}</p>
          <p className="text-xs font-bold text-zinc-500 mt-1">In Profit</p>
        </div>

        <div className="bg-white border border-zinc-200 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="p-2 bg-zinc-100 rounded-xl">
              <TrendingDown className="h-5 w-5 text-zinc-700" />
            </div>
            <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Losers</span>
          </div>
          <p className="text-2xl font-black text-zinc-900">{lossStocks}</p>
          <p className="text-xs font-bold text-zinc-500 mt-1">In Loss</p>
        </div>

        {/* Top Pick */}
        <div className="bg-zinc-100 border-2 border-zinc-200 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="p-2 bg-white rounded-xl shadow-sm">
              <Zap className="h-5 w-5 text-zinc-700" />
            </div>
            <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Top Pick</span>
          </div>
          <p className="text-xl font-black text-zinc-900 truncate">{topGainer?.symbol || '—'}</p>
          <div className="flex items-center gap-1 mt-1">
            {topGainer?.changePercent >= 0 ? (
              <ArrowUpRight className="h-3 w-3 text-zinc-600" />
            ) : (
              <ArrowDownRight className="h-3 w-3 text-zinc-600" />
            )}
            <span className="text-xs font-bold text-zinc-600">
              {topGainer?.changePercent ? `${Math.abs(topGainer.changePercent).toFixed(2)}%` : '0%'}
            </span>
          </div>
        </div>
      </div>

      <PortfolioSummary summary={portfolio.summary} />

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Holdings */}
        <div className="lg:col-span-8">
          <div className="bg-white border border-zinc-200 rounded-3xl shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-zinc-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Activity className="h-5 w-5 text-zinc-700" />
                <h3 className="font-black text-zinc-900 tracking-tight">Your Holdings</h3>
              </div>
              <span className="text-xs font-bold text-zinc-500 bg-zinc-100 px-3 py-1.5 rounded-lg">
                {totalHoldings} Stocks
              </span>
            </div>
            <HoldingsTable holdings={portfolio.holdings} />
          </div>
        </div>

        {/* Sidebar - Sticky to prevent scroll issues */}
        <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-6">
          {/* Allocation Chart */}
          <div className="bg-white border border-zinc-200 rounded-3xl shadow-sm p-6">
            <div className="flex items-center gap-3 mb-4">
              <PieChart className="h-5 w-5 text-zinc-700" />
              <h3 className="font-black text-zinc-900 tracking-tight">Allocation</h3>
            </div>
            <AllocationChart holdings={portfolio.holdings} />
          </div>

          {/* Top Movers */}
          <div className="bg-white border border-zinc-200 rounded-3xl shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-zinc-100">
              <div className="flex items-center gap-3">
                <BarChart3 className="h-5 w-5 text-zinc-700" />
                <h3 className="font-black text-zinc-900 tracking-tight">Market Movers</h3>
              </div>
            </div>
            <div className="p-6">
              <TopMovers />
            </div>
          </div>

          {/* Market Overview */}
          <div className="bg-zinc-100 border border-zinc-200 rounded-3xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <Target className="h-5 w-5 text-zinc-600" />
              <h3 className="font-bold text-zinc-900">Market Status</h3>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between py-2 border-b border-zinc-200">
                <span className="text-sm font-bold text-zinc-500">NEPSE Index</span>
                <span className="text-sm font-black text-zinc-900">2,145.67</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-zinc-200">
                <span className="text-sm font-bold text-zinc-500">Turnover</span>
                <span className="text-sm font-black text-zinc-900">Rs. 1.2B</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-sm font-bold text-zinc-500">Market Cap</span>
                <span className="text-sm font-black text-zinc-900">Rs. 3.4T</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard