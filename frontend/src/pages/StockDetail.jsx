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
      <div className="min-h-screen bg-slate-50 p-8 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-slate-200 border-b-slate-900 rounded-full animate-spin" />
          <p className="text-sm text-slate-500">Loading stock data...</p>
        </div>
      </div>
    )
  }

  const isPositive = details?.change >= 0

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Back Link */}
        <Link 
          to="/market" 
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors"
        >
          <div className="p-2 bg-white border border-slate-200 rounded-lg hover:border-slate-300 transition-colors">
            <ArrowLeft className="h-4 w-4" />
          </div>
          <span>Back to Market</span>
        </Link>

        {/* Main Header Card */}
        <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <h1 className="text-4xl font-bold text-slate-900 tracking-tight">{symbol}</h1>
                <span className="px-3 py-1 bg-slate-100 text-slate-500 text-xs font-semibold uppercase tracking-wider rounded-md">
                  NEPSE
                </span>
              </div>
              <p className="text-sm text-slate-500">{details?.securityName}</p>
            </div>
            
            <div className="flex flex-col items-start md:items-end gap-2">
              <p className="text-4xl font-bold text-slate-900 tracking-tight tabular-nums">
                {formatCurrency(details?.lastTradedPrice || 0)}
              </p>
              <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold ${isPositive ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'}`}>
                {isPositive ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                <span className="tabular-nums">
                  {isPositive ? '+' : ''}{(details?.change || 0).toFixed(2)} ({formatPercent(details?.percentChange || 0)})
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Price Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-slate-100 rounded-lg">
                <BarChart3 className="h-4 w-4 text-slate-600" />
              </div>
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Open Price</span>
            </div>
            <p className="text-2xl font-bold text-slate-900 tabular-nums">
              {formatCurrency(details?.openPrice || 0)}
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-emerald-50 rounded-lg">
                <TrendingUp className="h-4 w-4 text-emerald-600" />
              </div>
              <span className="text-xs font-semibold text-emerald-600 uppercase tracking-wider">Day High</span>
            </div>
            <p className="text-2xl font-bold text-emerald-700 tabular-nums">
              {formatCurrency(details?.highPrice || 0)}
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-red-50 rounded-lg">
                <TrendingDown className="h-4 w-4 text-red-600" />
              </div>
              <span className="text-xs font-semibold text-red-600 uppercase tracking-wider">Day Low</span>
            </div>
            <p className="text-2xl font-bold text-red-700 tabular-nums">
              {formatCurrency(details?.lowPrice || 0)}
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-slate-100 rounded-lg">
                <Activity className="h-4 w-4 text-slate-600" />
              </div>
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Volume</span>
            </div>
            <p className="text-2xl font-bold text-slate-900 tabular-nums">
              {formatVolume(details?.totalTradedQuantity || 0)}
            </p>
          </div>
        </div>

        {/* Chart & Sector Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Main Chart - Fixed Height */}
          <div className="lg:col-span-9 bg-slate-900 rounded-2xl border border-slate-800 p-4 shadow-lg">
            <div className="h-[400px]">
              {history.length > 0 ? (
                <StockChart data={history} symbol={symbol} />
              ) : (
                <div className="h-full flex flex-col items-center justify-center gap-4">
                  <div className="p-4 bg-slate-800 rounded-xl">
                    <Activity className="h-8 w-8 text-slate-600" />
                  </div>
                  <p className="text-sm text-slate-500">Historical data unavailable</p>
                </div>
              )}
            </div>
          </div>

          {/* Sector Sidebar - Scrollable */}
          <div className="lg:col-span-3 bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col max-h-[400px]">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between shrink-0">
              <h3 className="text-sm font-bold text-slate-900">Sector Indices</h3>
              <div className={`w-2 h-2 rounded-full ${details ? 'bg-emerald-500 animate-pulse' : 'bg-slate-300'}`} />
            </div>
            <div className="flex-1 overflow-y-auto p-4">
              <SectorIndices />
            </div>
            <div className="p-4 border-t border-slate-100 shrink-0">
              <p className="text-xs text-slate-400 text-center">
                Real-time NEPSE sub-indices
              </p>
            </div>
          </div>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Trading Metrics */}
          <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
            <h3 className="text-lg font-bold text-slate-900 mb-6">Trading Metrics</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between py-3 border-b border-slate-100">
                <span className="text-sm text-slate-500">Previous Close</span>
                <span className="font-semibold text-slate-900 tabular-nums">
                  {formatCurrency(details?.previousClose || 0)}
                </span>
              </div>
              <div className="flex items-center justify-between py-3 border-b border-slate-100">
                <span className="text-sm text-slate-500">52 Week High</span>
                <span className="font-semibold text-emerald-700 tabular-nums">
                  {formatCurrency(details?.fiftyTwoWeekHigh || 0)}
                </span>
              </div>
              <div className="flex items-center justify-between py-3 border-b border-slate-100">
                <span className="text-sm text-slate-500">52 Week Low</span>
                <span className="font-semibold text-red-700 tabular-nums">
                  {formatCurrency(details?.fiftyTwoWeekLow || 0)}
                </span>
              </div>
              <div className="flex items-center justify-between py-3">
                <span className="text-sm text-slate-500">Average Traded</span>
                <span className="font-semibold text-slate-900 tabular-nums">
                  {formatCurrency(details?.averageTradedPrice || 0)}
                </span>
              </div>
            </div>
          </div>

          {/* Market Metadata */}
          <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
            <h3 className="text-lg font-bold text-slate-900 mb-6">Market Metadata</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between py-3 border-b border-slate-100">
                <span className="text-sm text-slate-500">Market Cap</span>
                <span className="font-semibold text-slate-900 tabular-nums">
                  {formatVolume(details?.marketCapitalization || 0)}
                </span>
              </div>
              <div className="flex items-center justify-between py-3 border-b border-slate-100">
                <span className="text-sm text-slate-500">Listed Shares</span>
                <span className="font-semibold text-slate-900 tabular-nums">
                  {formatVolume(details?.outstandingShares || 0)}
                </span>
              </div>
              <div className="flex items-center justify-between py-3 border-b border-slate-100">
                <span className="text-sm text-slate-500">Sector</span>
                <span className="font-semibold text-slate-900">
                  {details?.sectorName || '—'}
                </span>
              </div>
              <div className="flex items-center justify-between py-3">
                <span className="text-sm text-slate-500">Last Updated</span>
                <span className="text-sm font-semibold text-slate-900">
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