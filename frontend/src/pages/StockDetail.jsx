import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import marketService from '../services/marketService'
import { formatCurrency, formatPercent, formatVolume, formatDate, formatTime } from '../utils/formatters'
import { ArrowLeft, TrendingUp, TrendingDown, Activity, BarChart3 } from 'lucide-react'
import StockChart from '../components/Charts/StockChart'
import SectorIndices from '../components/Charts/SectorIndices'

const StockDetail = () => {
  const { symbol } = useParams()
  const [details, setDetails] = useState(null)
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStockData()
  }, [symbol])

  const fetchStockData = async () => {
    if (!symbol || symbol === 'undefined') return;
    try {
      const [detailsData, historyData] = await Promise.all([
        marketService.getStockDetail(symbol),
        marketService.getChartData(symbol)
      ])
      setDetails(detailsData)
      setHistory(historyData)
    } catch (error) {
      console.error('Error fetching stock data:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-zinc-950 p-4 sm:p-6 lg:p-8 flex items-center justify-center transition-colors duration-300">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 sm:w-12 sm:h-12 border-4 border-zinc-100 dark:border-zinc-800 border-b-zinc-900 dark:border-b-zinc-100 rounded-full animate-spin" />
          <p className="text-sm font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">Loading stock data...</p>
        </div>
      </div>
    )
  }

  const isPositive = details?.change >= 0

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 p-4 sm:p-6 lg:p-8 transition-colors duration-300">
      <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6 lg:space-y-8">

        {/* Back Link - Better touch target on mobile */}
        <Link
          to="/market"
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-black text-zinc-400 dark:text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors uppercase tracking-widest group"
        >
          <div className="p-2.5 sm:p-2 bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-lg group-hover:border-zinc-900 dark:group-hover:border-zinc-100 transition-colors">
            <ArrowLeft className="h-5 w-5 sm:h-4 sm:w-4" />
          </div>
          <span>Back to Market</span>
        </Link>

        {/* Main Header Card - Responsive padding and layout */}
        <div className="bg-white dark:bg-zinc-900 rounded-xl sm:rounded-2xl p-5 sm:p-8 border border-zinc-100 dark:border-zinc-800 shadow-sm transition-all duration-300">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 sm:gap-6">
            <div className="space-y-1 sm:space-y-2">
              <div className="flex items-center gap-2 sm:gap-3">
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-zinc-900 dark:text-zinc-100 tracking-tight transition-colors">{symbol}</h1>
                <span className="px-2 sm:px-3 py-1 bg-zinc-50 dark:bg-zinc-800 text-zinc-400 dark:text-zinc-500 text-[10px] sm:text-xs font-black uppercase tracking-widest rounded-md">
                  NEPSE
                </span>
              </div>
              <p className="text-xs sm:text-sm font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">{details?.securityName}</p>
            </div>

            <div className="flex flex-col items-start md:items-end gap-1 sm:gap-2">
              <p className="text-2xl sm:text-3xl md:text-4xl font-black text-zinc-900 dark:text-zinc-100 tracking-tight tabular-nums transition-colors">
                {formatCurrency(details?.lastTradedPrice || 0)}
              </p>
              <div className={`inline-flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg text-xs sm:text-sm font-black ${isPositive ? 'bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400' : 'bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400'}`}>
                {isPositive ? <TrendingUp className="h-3.5 w-3.5 sm:h-4 sm:w-4" /> : <TrendingDown className="h-3.5 w-3.5 sm:h-4 sm:w-4" />}
                <span className="tabular-nums">
                  {isPositive ? '+' : ''}{(details?.change || 0).toFixed(2)} ({formatPercent(details?.percentChange || 0)})
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Price Stats Grid - 2 cols mobile, 4 cols desktop */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
          <div className="bg-white dark:bg-zinc-900 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-zinc-100 dark:border-zinc-800 shadow-sm transition-all">
            <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
              <div className="p-1.5 sm:p-2 bg-zinc-50 dark:bg-zinc-800 rounded-lg transition-colors">
                <BarChart3 className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-zinc-600 dark:text-zinc-400" />
              </div>
              <span className="text-[10px] sm:text-xs font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">Open Price</span>
            </div>
            <p className="text-xl sm:text-2xl font-black text-zinc-900 dark:text-zinc-100 tabular-nums tracking-tighter transition-colors">
              {formatCurrency(details?.openPrice || 0)}
            </p>
          </div>

          <div className="bg-white dark:bg-zinc-900 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-zinc-100 dark:border-zinc-800 shadow-sm transition-all">
            <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
              <div className="p-1.5 sm:p-2 bg-emerald-50 dark:bg-emerald-950/20 rounded-lg transition-colors">
                <TrendingUp className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-emerald-600 dark:text-emerald-400" />
              </div>
              <span className="text-[10px] sm:text-xs font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">Day High</span>
            </div>
            <p className="text-xl sm:text-2xl font-black text-emerald-700 dark:text-emerald-500 tabular-nums tracking-tighter transition-colors">
              {formatCurrency(details?.highPrice || 0)}
            </p>
          </div>

          <div className="bg-white dark:bg-zinc-900 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-zinc-100 dark:border-zinc-800 shadow-sm transition-all">
            <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
              <div className="p-1.5 sm:p-2 bg-rose-50 dark:bg-rose-950/20 rounded-lg transition-colors">
                <TrendingDown className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-rose-600 dark:text-rose-400" />
              </div>
              <span className="text-[10px] sm:text-xs font-black text-rose-600 dark:text-rose-400 uppercase tracking-widest">Day Low</span>
            </div>
            <p className="text-xl sm:text-2xl font-black text-rose-700 dark:text-rose-500 tabular-nums tracking-tighter transition-colors">
              {formatCurrency(details?.lowPrice || 0)}
            </p>
          </div>

          <div className="bg-white dark:bg-zinc-900 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-zinc-100 dark:border-zinc-800 shadow-sm transition-all">
            <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
              <div className="p-1.5 sm:p-2 bg-zinc-50 dark:bg-zinc-800 rounded-lg transition-colors">
                <Activity className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-zinc-600 dark:text-zinc-400" />
              </div>
              <span className="text-[10px] sm:text-xs font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">Volume</span>
            </div>
            <p className="text-xl sm:text-2xl font-black text-zinc-900 dark:text-zinc-100 tabular-nums tracking-tighter transition-colors">
              {formatVolume(details?.totalTradedQuantity || 0)}
            </p>
          </div>
        </div>

        {/* Chart & Sector Grid - Responsive layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6">
          {/* Main Chart - Responsive height */}
          <div className="lg:col-span-9 bg-zinc-900 rounded-xl sm:rounded-2xl border border-zinc-800 p-3 sm:p-4 shadow-lg transition-colors">
            <div className="h-[300px] sm:h-[350px] lg:h-[400px]">
              {history.length > 0 ? (
                <StockChart data={history} symbol={symbol} />
              ) : (
                <div className="h-full flex flex-col items-center justify-center gap-4">
                  <div className="p-3 sm:p-4 bg-zinc-800 rounded-xl">
                    <Activity className="h-6 w-6 sm:h-8 sm:w-8 text-zinc-600 dark:text-zinc-500" />
                  </div>
                  <p className="text-[10px] sm:text-xs font-black text-zinc-500 dark:text-zinc-600 uppercase tracking-widest">Historical data unavailable</p>
                </div>
              )}
            </div>
          </div>

          {/* Sector Sidebar - Scrollable, responsive height */}
          <div className="lg:col-span-3 bg-white dark:bg-zinc-900 rounded-xl sm:rounded-2xl border border-zinc-100 dark:border-zinc-800 shadow-sm flex flex-col h-[300px] sm:h-[350px] lg:h-auto lg:max-h-[400px] transition-all duration-300">
            <div className="p-4 sm:p-5 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between shrink-0 transition-colors">
              <h3 className="text-[10px] sm:text-xs font-black text-zinc-900 dark:text-zinc-100 uppercase tracking-widest">Sector Indices</h3>
              <div className={`w-2 h-2 rounded-full ${details ? 'bg-emerald-500 animate-pulse' : 'bg-zinc-300 dark:bg-zinc-700'}`} />
            </div>
            <div className="flex-1 overflow-y-auto p-3 sm:p-4 no-scrollbar">
              <SectorIndices />
            </div>
            <div className="p-3 sm:p-4 border-t border-zinc-100 dark:border-zinc-800 shrink-0 transition-colors">
              <p className="text-[10px] font-black text-zinc-400 dark:text-zinc-500 text-center uppercase tracking-tighter">
                Real-time NEPSE sub-indices
              </p>
            </div>
          </div>
        </div>

        {/* Details Grid - Single column on mobile */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {/* Trading Metrics */}
          <div className="bg-white dark:bg-zinc-900 rounded-xl sm:rounded-2xl border border-zinc-100 dark:border-zinc-800 p-5 sm:p-8 shadow-sm transition-all">
            <h3 className="text-xs sm:text-sm font-black text-zinc-900 dark:text-zinc-100 mb-4 sm:mb-6 uppercase tracking-widest">Trading Metrics</h3>
            <div className="space-y-3 sm:space-y-4">
              <div className="flex items-center justify-between py-2 sm:py-3 border-b border-zinc-50 dark:border-zinc-800 transition-colors">
                <span className="text-[10px] sm:text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">Previous Close</span>
                <span className="font-black text-zinc-900 dark:text-zinc-100 tabular-nums text-sm sm:text-base tracking-tighter">
                  {formatCurrency(details?.previousClose || 0)}
                </span>
              </div>
              <div className="flex items-center justify-between py-2 sm:py-3 border-b border-zinc-50 dark:border-zinc-800 transition-colors">
                <span className="text-[10px] sm:text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">52 Week High</span>
                <span className="font-black text-emerald-600 dark:text-emerald-400 tabular-nums text-sm sm:text-base tracking-tighter">
                  {formatCurrency(details?.fiftyTwoWeekHigh || 0)}
                </span>
              </div>
              <div className="flex items-center justify-between py-2 sm:py-3 border-b border-zinc-50 dark:border-zinc-800 transition-colors">
                <span className="text-[10px] sm:text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">52 Week Low</span>
                <span className="font-black text-rose-600 dark:text-rose-400 tabular-nums text-sm sm:text-base tracking-tighter">
                  {formatCurrency(details?.fiftyTwoWeekLow || 0)}
                </span>
              </div>
              <div className="flex items-center justify-between py-2 sm:py-3">
                <span className="text-[10px] sm:text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">Average Traded</span>
                <span className="font-black text-zinc-900 dark:text-zinc-100 tabular-nums text-sm sm:text-base tracking-tighter">
                  {formatCurrency(details?.averageTradedPrice || 0)}
                </span>
              </div>
            </div>
          </div>

          {/* Market Metadata */}
          <div className="bg-white dark:bg-zinc-900 rounded-xl sm:rounded-2xl border border-zinc-100 dark:border-zinc-800 p-5 sm:p-8 shadow-sm transition-all">
            <h3 className="text-xs sm:text-sm font-black text-zinc-900 dark:text-zinc-100 mb-4 sm:mb-6 uppercase tracking-widest">Market Metadata</h3>
            <div className="space-y-3 sm:space-y-4">
              <div className="flex items-center justify-between py-2 sm:py-3 border-b border-zinc-50 dark:border-zinc-800 transition-colors">
                <span className="text-[10px] sm:text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">Market Cap</span>
                <span className="font-black text-zinc-900 dark:text-zinc-100 tabular-nums text-sm sm:text-base tracking-tighter">
                  {formatVolume(details?.marketCapitalization || 0)}
                </span>
              </div>
              <div className="flex items-center justify-between py-2 sm:py-3 border-b border-zinc-50 dark:border-zinc-800 transition-colors">
                <span className="text-[10px] sm:text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">Listed Shares</span>
                <span className="font-black text-zinc-900 dark:text-zinc-100 tabular-nums text-sm sm:text-base tracking-tighter">
                  {formatVolume(details?.outstandingShares || 0)}
                </span>
              </div>
              <div className="flex items-center justify-between py-2 sm:py-3 border-b border-zinc-50 dark:border-zinc-800 transition-colors">
                <span className="text-[10px] sm:text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">Sector</span>
                <span className="font-black text-zinc-900 dark:text-zinc-100 text-sm sm:text-base tracking-tight">
                  {details?.sectorName || '—'}
                </span>
              </div>
              <div className="flex items-center justify-between py-2 sm:py-3">
                <span className="text-[10px] sm:text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">Last Updated</span>
                <span className="text-[10px] sm:text-xs font-black text-zinc-900 dark:text-zinc-100 uppercase tracking-tighter">
                  {formatDate(details?.lastUpdatedDate)} {formatTime(details?.lastUpdatedDate)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default StockDetail
