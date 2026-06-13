import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '../contexts/AuthContext'
import portfolioService from '../services/portfolioService'
import { formatTime } from '../utils/formatters'
import PortfolioSummary from '../components/Dashboard/PortfolioSummary'
import AllocationChart from '../components/Dashboard/AllocationChart'
import HoldingsTable from '../components/Dashboard/HoldingsTable'
import TopMovers from '../components/Dashboard/TopMovers'
import { RefreshCw, ArrowUpRight, ArrowDownRight } from 'lucide-react'

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

  const totalHoldings = portfolio.holdings?.length || 0
  const profitableStocks = portfolio.holdings?.filter(h => h.pnl > 0).length || 0
  const lossStocks = totalHoldings - profitableStocks
  const topGainer = portfolio.holdings?.reduce((max, h) => h.pnlPercent > max.pnlPercent ? h : max, portfolio.holdings[0] || {})

  if (loading) {
    return (
      <div className="max-w-[1400px] mx-auto px-4 py-6 space-y-4">
        <div className="h-7 w-48 bg-sunk animate-pulse rounded-lg" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-line border border-line">
          {[1, 2, 3, 4].map(i => <div key={i} className="h-24 bg-panel animate-pulse" />)}
        </div>
        <div className="h-96 panel animate-pulse" />
      </div>
    )
  }

  const tiles = [
    { k: 'POSITIONS', v: totalHoldings, sub: 'total holdings' },
    { k: 'WINNERS', v: profitableStocks, sub: 'in profit', cls: 'up' },
    { k: 'LOSERS', v: lossStocks, sub: 'in loss', cls: 'down' },
  ]

  return (
    <div className="max-w-[1400px] mx-auto px-4 py-6 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-ink tracking-tight">Dashboard</h1>
          <p className="label mt-0.5">UPDATED {formatTime(lastUpdated)}</p>
        </div>
        <button onClick={fetchPortfolio} className="btn btn-ghost">
          <RefreshCw className="h-3.5 w-3.5" /> Refresh
        </button>
      </div>

      {/* Stat tiles */}
      <div className="grid grid-cols-2 lg:grid-cols-4 border border-line divide-x divide-[var(--color-line)]">
        {tiles.map(t => (
          <div key={t.k} className="bg-panel p-4">
            <p className="label">{t.k}</p>
            <p className={`text-3xl font-semibold tnum mt-1 ${t.cls || 'text-ink'}`}>{t.v}</p>
            <p className="label mt-0.5">{t.sub}</p>
          </div>
        ))}
        <div className="bg-ink text-paper p-4">
          <p className="label text-paper/50">TOP PICK</p>
          <p className="text-xl font-semibold mt-1 truncate">{topGainer?.symbol || '—'}</p>
          <p className={`flex items-center gap-1 text-[13px] tnum mt-0.5 ${topGainer?.pnlPercent >= 0 ? 'text-[var(--color-up)]' : 'text-[var(--color-down)]'}`}>
            {topGainer?.pnlPercent >= 0 ? <ArrowUpRight className="h-3.5 w-3.5" /> : <ArrowDownRight className="h-3.5 w-3.5" />}
            {topGainer?.pnlPercent ? `${Math.abs(topGainer.pnlPercent).toFixed(2)}%` : '0%'}
          </p>
        </div>
      </div>

      <PortfolioSummary summary={portfolio.summary} />

      {/* Main grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        <div className="lg:col-span-8">
          <HoldingsTable holdings={portfolio.holdings} />
        </div>
        <div className="lg:col-span-4 space-y-4">
          <div className="panel">
            <div className="px-3 py-2 bg-sunk border-b border-line"><span className="label">ALLOCATION</span></div>
            <div className="p-3">
              <AllocationChart holdings={portfolio.holdings} />
            </div>
          </div>
          <TopMovers />
        </div>
      </div>
    </div>
  )
}

export default Dashboard
