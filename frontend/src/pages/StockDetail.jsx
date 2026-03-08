import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import axios from 'axios'
import { ArrowLeft, TrendingUp, TrendingDown, Activity, DollarSign, BarChart3 } from 'lucide-react'
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
      const [detailsRes, historyRes] = await Promise.all([
        axios.get(`${import.meta.env.VITE_API_URL}/api/market/stock/${symbol}`),
        axios.get(`${import.meta.env.VITE_API_URL}/api/market/history/${symbol}`)
      ])
      setDetails(detailsRes.data)
      setHistory(historyRes.data)
    } catch (error) {
      console.error('Error fetching stock data:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-96 animate-fade-in-up">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-zinc-100 border-b-zinc-900 mb-4"></div>
        <p className="text-xs font-black text-zinc-400 uppercase tracking-widest">GATHERING TICKER INTEL...</p>
      </div>
    )
  }

  const isPositive = details?.change >= 0

  return (
    <div className="animate-fade-in-up space-y-12 pb-12">
      <Link to="/" className="inline-flex items-center space-x-3 text-zinc-400 font-bold transition-all group">
        <div className="p-2 bg-zinc-50 rounded-xl group-hover:bg-zinc-100">
          <ArrowLeft className="h-5 w-5" />
        </div>
        <span className="text-sm uppercase tracking-widest group-hover:text-zinc-900">Back to Terminal</span>
      </Link>

      <div className="bg-white border border-zinc-100 rounded-[32px] p-10 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8">
          <div>
            <div className="flex items-center gap-4 mb-2">
              <h1 className="text-5xl font-black text-zinc-900 tracking-tighter">{symbol}</h1>
              <span className="px-3 py-1 bg-zinc-50 text-zinc-400 text-[10px] font-black uppercase tracking-widest rounded-lg border border-zinc-100">NEPSE Listed</span>
            </div>
            <p className="text-sm font-bold text-zinc-400 uppercase tracking-widest">{details?.securityName}</p>
          </div>
          <div className="text-right flex flex-col items-end">
            <p className="text-5xl font-black text-zinc-900 tracking-tighter tabular-nums">Rs. {(details?.lastTradedPrice || 0).toFixed(2)}</p>
            <div className={`flex items-center gap-2 mt-3 px-4 py-1.5 rounded-full ${isPositive ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
              {isPositive ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
              <span className="text-lg font-black tabular-nums">
                {isPositive ? '+' : ''}{(details?.change || 0).toFixed(2)} ({isPositive ? '+' : ''}{(details?.percentChange || 0).toFixed(2)}%)
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
        <div className="bg-white border border-zinc-100 rounded-3xl p-8 shadow-sm">
          <div className="flex items-center gap-3 text-zinc-400 mb-4">
            <div className="p-2 bg-zinc-50 rounded-lg">
              <BarChart3 className="h-4 w-4" />
            </div>
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Open Price</span>
          </div>
          <p className="text-2xl font-black text-zinc-900 tabular-nums">Rs. {(details?.openPrice || 0).toFixed(2)}</p>
        </div>
        <div className="bg-white border border-zinc-100 rounded-3xl p-8 shadow-sm">
          <div className="flex items-center gap-3 text-emerald-400 mb-4">
            <div className="p-2 bg-emerald-50 rounded-lg">
              <TrendingUp className="h-4 w-4" />
            </div>
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Day High</span>
          </div>
          <p className="text-2xl font-black text-emerald-600 tabular-nums">Rs. {(details?.highPrice || 0).toFixed(2)}</p>
        </div>
        <div className="bg-white border border-zinc-100 rounded-3xl p-8 shadow-sm">
          <div className="flex items-center gap-3 text-rose-400 mb-4">
            <div className="p-2 bg-rose-50 rounded-lg">
              <TrendingDown className="h-4 w-4" />
            </div>
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Day Low</span>
          </div>
          <p className="text-2xl font-black text-rose-600 tabular-nums">Rs. {(details?.lowPrice || 0).toFixed(2)}</p>
        </div>
        <div className="bg-white border border-zinc-100 rounded-3xl p-8 shadow-sm">
          <div className="flex items-center gap-3 text-zinc-400 mb-4">
            <div className="p-2 bg-zinc-50 rounded-lg">
              <Activity className="h-4 w-4" />
            </div>
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Volume</span>
          </div>
          <p className="text-2xl font-black text-zinc-900 tabular-nums">{(details?.totalTradedQuantity || 0).toLocaleString()}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-[600px]">
        <div className="lg:col-span-9 bg-zinc-950 border border-zinc-800 rounded-[32px] p-2 shadow-2xl overflow-hidden group">
          {history.length > 0 ? (
            <StockChart data={history} symbol={symbol} />
          ) : (
            <div className="h-full flex flex-col items-center justify-center space-y-4">
              <div className="p-4 bg-zinc-900 rounded-2xl border border-zinc-800 animate-pulse">
                <Activity className="h-8 w-8 text-zinc-700" />
              </div>
              <p className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.3em]">Historical Analysis unavailable for this security</p>
            </div>
          )}
        </div>

        {/* Sector Stats */}
        <div className="lg:col-span-3 bg-white border border-zinc-100 rounded-[32px] p-6 shadow-sm overflow-hidden flex flex-col min-h-[400px]">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em]">Sector Wise Pricing</h3>
            <div className={`w-2 h-2 rounded-full ${details ? 'bg-emerald-500 animate-pulse' : 'bg-zinc-200'}`} />
          </div>
          <div className="flex-grow overflow-hidden">
            <SectorIndices />
          </div>
          <div className="mt-4 pt-4 border-t border-zinc-50">
            <p className="text-[9px] font-bold text-zinc-300 uppercase leading-relaxed text-center">
              Real-time NEPSE sub-indices data
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white border border-zinc-100 rounded-3xl p-10 shadow-sm">
          <h3 className="text-xl font-black text-zinc-900 mb-8 uppercase tracking-tighter">Trading Metrics</h3>
          <div className="space-y-6">
            <div className="flex justify-between items-center py-4 border-b border-zinc-50">
              <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Previous Close</span>
              <span className="font-black text-zinc-900 tabular-nums">Rs. {(details?.previousClose || 0).toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center py-4 border-b border-zinc-50">
              <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest">52 Week High</span>
              <span className="font-black text-emerald-600 tabular-nums">Rs. {(details?.fiftyTwoWeekHigh || 0).toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center py-4 border-b border-zinc-50">
              <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest">52 Week Low</span>
              <span className="font-black text-rose-600 tabular-nums">Rs. {(details?.fiftyTwoWeekLow || 0).toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center py-4">
              <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Average Traded</span>
              <span className="font-black text-zinc-900 tabular-nums">Rs. {(details?.averageTradedPrice || 0).toFixed(2)}</span>
            </div>
          </div>
        </div>

        <div className="bg-white border border-zinc-100 rounded-3xl p-10 shadow-sm">
          <h3 className="text-xl font-black text-zinc-900 mb-8 uppercase tracking-tighter">Market Metadata</h3>
          <div className="space-y-6">
            <div className="flex justify-between items-center py-4 border-b border-zinc-50">
              <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Market Cap</span>
              <span className="font-black text-zinc-900 tabular-nums">{(details?.marketCapitalization || 0).toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center py-4 border-b border-zinc-50">
              <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Listed Shares</span>
              <span className="font-black text-zinc-900 tabular-nums">{(details?.outstandingShares || 0).toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center py-4 border-b border-zinc-50">
              <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Sector</span>
              <span className="font-black text-zinc-900 uppercase tracking-tight">{details?.sectorName}</span>
            </div>
            <div className="flex justify-between items-center py-4">
              <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Last Sync</span>
              <span className="text-xs font-black text-zinc-900 uppercase tracking-tight">{new Date(details?.lastUpdatedDate).toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default StockDetail