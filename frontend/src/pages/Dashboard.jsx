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
    const dataInterval = setInterval(fetchPortfolio, 10000)
    return () => clearInterval(dataInterval)
  }, [fetchPortfolio])

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
      <div className="min-h-screen bg-slate-50 p-8 space-y-8">
        <div className="h-10 w-64 bg-slate-200 animate-pulse rounded-lg" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-40 bg-white rounded-2xl border border-slate-200 animate-pulse" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 h-[500px] bg-white rounded-2xl border border-slate-200 animate-pulse" />
          <div className="h-[500px] bg-white rounded-2xl border border-slate-200 animate-pulse" />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header - Proper Spacing */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
              Dashboard
            </h1>
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <Clock className="h-4 w-4" />
              <span>Updated {formatTime(lastUpdated)}</span>
            </div>
          </div>
          <button
            onClick={fetchPortfolio}
            className="flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-300 text-slate-700 rounded-xl text-sm font-semibold hover:bg-slate-50 hover:border-slate-400 transition-all active:scale-95 shadow-sm"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh Data
          </button>
        </div>

        {/* Stats Grid - Proper Gaps & Padding */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Positions */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-slate-100 rounded-xl">
                <Wallet className="h-5 w-5 text-slate-600" />
              </div>
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Positions</span>
            </div>
            <div className="space-y-1">
              <p className="text-3xl font-bold text-slate-900 tabular-nums">{totalHoldings}</p>
              <p className="text-sm text-slate-500">Total Holdings</p>
            </div>
          </div>

          {/* Winners */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-emerald-50 rounded-xl">
                <TrendingUp className="h-5 w-5 text-emerald-600" />
              </div>
              <span className="text-xs font-semibold text-emerald-600 uppercase tracking-wider">Winners</span>
            </div>
            <div className="space-y-1">
              <p className="text-3xl font-bold text-slate-900 tabular-nums">{profitableStocks}</p>
              <p className="text-sm text-slate-500">In Profit</p>
            </div>
          </div>

          {/* Losers */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-red-50 rounded-xl">
                <TrendingDown className="h-5 w-5 text-red-600" />
              </div>
              <span className="text-xs font-semibold text-red-600 uppercase tracking-wider">Losers</span>
            </div>
            <div className="space-y-1">
              <p className="text-3xl font-bold text-slate-900 tabular-nums">{lossStocks}</p>
              <p className="text-sm text-slate-500">In Loss</p>
            </div>
          </div>

          {/* Top Pick - Featured Card */}
          <div className="bg-slate-900 rounded-2xl p-6 text-white shadow-lg">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-white/10 rounded-xl">
                <Zap className="h-5 w-5 text-amber-400" />
              </div>
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Top Pick</span>
            </div>
            <div className="space-y-2">
              <p className="text-2xl font-bold truncate">{topGainer?.symbol || '—'}</p>
              <div className="flex items-center gap-1.5">
                {topGainer?.changePercent >= 0 ? (
                  <ArrowUpRight className="h-4 w-4 text-emerald-400" />
                ) : (
                  <ArrowDownRight className="h-4 w-4 text-red-400" />
                )}
                <span className={`text-sm font-semibold ${topGainer?.changePercent >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                  {topGainer?.changePercent ? `${Math.abs(topGainer.changePercent).toFixed(2)}%` : '0%'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Portfolio Summary - Full Width with Padding */}
        <div className="py-2">
          <PortfolioSummary summary={portfolio.summary} />
        </div>

        {/* Main Content Grid - Proper Gaps */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Holdings - Main Table */}
          <div className="lg:col-span-8">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="px-8 py-5 border-b border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-slate-100 rounded-lg">
                    <Activity className="h-5 w-5 text-slate-600" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">Your Holdings</h3>
                </div>
                <span className="text-sm font-medium text-slate-500 bg-slate-100 px-3 py-1.5 rounded-lg">
                  {totalHoldings} Stocks
                </span>
              </div>
              <div className="p-2">
                <HoldingsTable holdings={portfolio.holdings} />
              </div>
            </div>
          </div>

          {/* Sidebar - Sticky with Proper Spacing */}
          <div className="lg:col-span-4 space-y-8 lg:sticky lg:top-8 lg:self-start">
            
            {/* Allocation */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-slate-100 rounded-lg">
                  <PieChart className="h-5 w-5 text-slate-600" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">Allocation</h3>
              </div>
              <AllocationChart holdings={portfolio.holdings} />
            </div>

            {/* Top Movers */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="px-8 py-5 border-b border-slate-200">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-slate-100 rounded-lg">
                    <BarChart3 className="h-5 w-5 text-slate-600" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">Top Movers</h3>
                </div>
              </div>
              <div className="p-6">
                <TopMovers />
              </div>
            </div>

            {/* Market Overview */}
            <div className="bg-slate-900 rounded-2xl p-8 text-white shadow-lg">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-white/10 rounded-lg">
                  <Target className="h-5 w-5 text-slate-400" />
                </div>
                <h3 className="text-lg font-bold">Market Overview</h3>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between py-3 border-b border-slate-800">
                  <span className="text-sm text-slate-400">NEPSE Index</span>
                  <span className="text-lg font-bold tabular-nums">2,145.67</span>
                </div>
                <div className="flex items-center justify-between py-3 border-b border-slate-800">
                  <span className="text-sm text-slate-400">Turnover</span>
                  <span className="text-lg font-bold tabular-nums">Rs. 1.2B</span>
                </div>
                <div className="flex items-center justify-between py-3">
                  <span className="text-sm text-slate-400">Market Cap</span>
                  <span className="text-lg font-bold tabular-nums">Rs. 3.4T</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard