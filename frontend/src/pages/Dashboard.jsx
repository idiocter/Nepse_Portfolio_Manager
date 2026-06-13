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
  const topGainer = portfolio.holdings?.reduce((max, h) => h.pnlPercent > max.pnlPercent ? h : max, portfolio.holdings[0] || {})

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 p-4 sm:p-6 lg:p-8 space-y-4 sm:space-y-6 lg:space-y-8 transition-colors duration-300">
        <div className="h-8 sm:h-10 w-48 sm:w-64 bg-zinc-200 dark:bg-zinc-800 animate-pulse rounded-lg" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-32 sm:h-40 bg-white dark:bg-zinc-900 rounded-xl sm:rounded-2xl border border-zinc-200 dark:border-zinc-800 animate-pulse" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          <div className="lg:col-span-2 h-[300px] sm:h-[400px] lg:h-[500px] bg-white dark:bg-zinc-900 rounded-xl sm:rounded-2xl border border-zinc-200 dark:border-zinc-800 animate-pulse" />
          <div className="h-[300px] sm:h-[400px] lg:h-[500px] bg-white dark:bg-zinc-900 rounded-xl sm:rounded-2xl border border-zinc-200 dark:border-zinc-800 animate-pulse" />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 p-4 sm:p-6 lg:p-8 transition-colors duration-300">
      <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6 lg:space-y-8">

        {/* Header - Responsive spacing and layout */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-6">
          <div className="space-y-1 sm:space-y-2">
            <h1 className="text-2xl sm:text-3xl font-black text-zinc-900 dark:text-zinc-100 tracking-tight transition-colors">
              Dashboard
            </h1>
            <div className="flex items-center gap-2 text-xs sm:text-sm font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest transition-colors">
              <Clock className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              <span>Updated {formatTime(lastUpdated)}</span>
            </div>
          </div>
          <button
            onClick={fetchPortfolio}
            className="flex items-center justify-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 rounded-lg sm:rounded-xl font-black text-xs sm:text-sm uppercase tracking-widest hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-all active:scale-95 shadow-sm w-full sm:w-auto"
          >
            <RefreshCw className="h-4 w-4" />
            <span>Refresh Data</span>
          </button>
        </div>

        {/* Stats Grid - 2 cols mobile, 4 cols desktop */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
          {/* Positions */}
          <div className="bg-white dark:bg-zinc-900 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-zinc-100 dark:border-zinc-800 shadow-sm transition-all">
            <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
              <div className="p-2 sm:p-3 bg-zinc-50 dark:bg-zinc-800 rounded-lg sm:rounded-xl transition-colors">
                <Wallet className="h-4 w-4 sm:h-5 sm:w-5 text-zinc-500 dark:text-zinc-400" />
              </div>
              <span className="text-[10px] sm:text-xs font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-widest transition-colors">Positions</span>
            </div>
            <div className="space-y-0.5 sm:space-y-1">
              <p className="text-2xl sm:text-3xl font-black text-zinc-900 dark:text-zinc-100 tabular-nums transition-colors">{totalHoldings}</p>
              <p className="text-[10px] sm:text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest transition-colors">Total Holdings</p>
            </div>
          </div>

          {/* Winners */}
          <div className="bg-white dark:bg-zinc-900 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-zinc-100 dark:border-zinc-800 shadow-sm transition-all">
            <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
              <div className="p-2 sm:p-3 bg-emerald-50 dark:bg-emerald-950/20 rounded-lg sm:rounded-xl transition-colors">
                <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 text-emerald-600 dark:text-emerald-400" />
              </div>
              <span className="text-[10px] sm:text-xs font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-widest transition-colors">Winners</span>
            </div>
            <div className="space-y-0.5 sm:space-y-1">
              <p className="text-2xl sm:text-3xl font-black text-zinc-900 dark:text-zinc-100 tabular-nums transition-colors">{profitableStocks}</p>
              <p className="text-[10px] sm:text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest transition-colors">In Profit</p>
            </div>
          </div>

          {/* Losers */}
          <div className="bg-white dark:bg-zinc-900 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-zinc-100 dark:border-zinc-800 shadow-sm transition-all">
            <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
              <div className="p-2 sm:p-3 bg-rose-50 dark:bg-rose-950/20 rounded-lg sm:rounded-xl transition-colors">
                <TrendingDown className="h-4 w-4 sm:h-5 sm:w-5 text-rose-600 dark:text-rose-400" />
              </div>
              <span className="text-[10px] sm:text-xs font-black text-rose-600 dark:text-rose-400 uppercase tracking-widest transition-colors">Losers</span>
            </div>
            <div className="space-y-0.5 sm:space-y-1">
              <p className="text-2xl sm:text-3xl font-black text-zinc-900 dark:text-zinc-100 tabular-nums transition-colors">{lossStocks}</p>
              <p className="text-[10px] sm:text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest transition-colors">In Loss</p>
            </div>
          </div>

          {/* Top Pick - Featured Card */}
          <div className="bg-zinc-900 dark:bg-zinc-100 rounded-xl sm:rounded-2xl p-4 sm:p-6 text-white dark:text-zinc-900 shadow-lg border border-transparent transition-all">
            <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
              <div className="p-2 sm:p-3 bg-white/10 dark:bg-zinc-800 rounded-lg sm:rounded-xl transition-colors">
                <Zap className="h-4 w-4 sm:h-5 sm:w-5 text-amber-400" />
              </div>
              <span className="text-[10px] sm:text-xs font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-widest transition-colors">Top Pick</span>
            </div>
            <div className="space-y-1 sm:space-y-2">
              <p className="text-lg sm:text-2xl font-black truncate transition-colors">{topGainer?.symbol || '—'}</p>
              <div className="flex items-center gap-1 sm:gap-1.5 font-bold">
                {topGainer?.pnlPercent >= 0 ? (
                  <ArrowUpRight className="h-3 w-3 sm:h-4 sm:w-4 text-emerald-400" />
                ) : (
                  <ArrowDownRight className="h-3 w-3 sm:h-4 sm:w-4 text-rose-400" />
                )}
                <span className={`text-xs sm:text-sm tracking-tight transition-colors ${topGainer?.pnlPercent >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {topGainer?.pnlPercent ? `${Math.abs(topGainer.pnlPercent).toFixed(2)}%` : '0%'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Portfolio Summary */}
        <PortfolioSummary summary={portfolio.summary} />

        {/* Main Content Grid - Single column mobile, 12-col desktop */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 lg:gap-8">

          {/* Holdings - Main Table */}
          <div className="lg:col-span-8">
            <HoldingsTable holdings={portfolio.holdings} />
          </div>

          {/* Sidebar - Sticky only on desktop */}
          <div className="lg:col-span-4 space-y-4 sm:space-y-6 lg:space-y-8 lg:sticky lg:top-8 lg:self-start">

            {/* Allocation */}
            <div className="bg-white dark:bg-zinc-900 rounded-2xl sm:rounded-3xl border border-zinc-100 dark:border-zinc-800 shadow-sm p-5 sm:p-6 lg:p-8 transition-all duration-300">
              <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
                <div className="p-1.5 sm:p-2 bg-zinc-50 dark:bg-zinc-800 rounded-lg transition-colors">
                  <PieChart className="h-4 w-4 sm:h-5 sm:w-5 text-zinc-500 dark:text-zinc-400" />
                </div>
                <h3 className="text-base sm:text-lg font-black text-zinc-900 dark:text-zinc-100 transition-colors uppercase tracking-tight">Allocation</h3>
              </div>
              <AllocationChart holdings={portfolio.holdings} />
            </div>

            {/* Top Movers */}
            <TopMovers />

            {/* Market Overview */}
            <div className="bg-zinc-900 dark:bg-zinc-950 rounded-2xl sm:rounded-3xl p-5 sm:p-6 lg:p-8 text-white shadow-lg border border-transparent dark:border-zinc-800 transition-all duration-300">
              <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
                <div className="p-1.5 sm:p-2 bg-white/10 dark:bg-zinc-900 rounded-lg transition-colors">
                  <Target className="h-4 w-4 sm:h-5 sm:w-5 text-zinc-400 dark:text-zinc-500" />
                </div>
                <h3 className="text-base sm:text-lg font-black tracking-tight uppercase">Market Overview</h3>
              </div>
              <div className="space-y-2 sm:space-y-4">
                <div className="flex items-center justify-between py-2 sm:py-3 border-b border-zinc-800">
                  <span className="text-[10px] sm:text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">NEPSE Index</span>
                  <span className="text-base sm:text-lg font-black tabular-nums transition-colors">2,145.67</span>
                </div>
                <div className="flex items-center justify-between py-2 sm:py-3 border-b border-zinc-800">
                  <span className="text-[10px] sm:text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">Turnover</span>
                  <span className="text-base sm:text-lg font-black tabular-nums transition-colors">Rs. 1.2B</span>
                </div>
                <div className="flex items-center justify-between py-2 sm:py-3">
                  <span className="text-[10px] sm:text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">Market Cap</span>
                  <span className="text-base sm:text-lg font-black tabular-nums transition-colors">Rs. 3.4T</span>
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