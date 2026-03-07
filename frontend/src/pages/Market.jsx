import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import {
  Search,
  TrendingUp,
  TrendingDown,
  Activity,
  BarChart3,
  ArrowUpRight,
  Filter,
  RefreshCw,
  Building2,
  ChevronLeft,
  ChevronRight
} from 'lucide-react'

const Market = () => {
  const [stocks, setStocks] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [sortBy, setSortBy] = useState('symbol')
  const [sortOrder, setSortOrder] = useState('asc')
  const itemsPerPage = 15

  useEffect(() => {
    fetchStocks()
  }, [])

  const fetchStocks = async () => {
    setLoading(true)
    try {
      const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/api/market/stocks`)
      setStocks(data || [])
    } catch (error) {
      console.error('Error fetching market stocks:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortBy(field)
      setSortOrder('asc')
    }
  }

  const filteredStocks = stocks
    .filter(stock =>
      stock.symbol?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      stock.name?.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      let valA = a[sortBy]
      let valB = b[sortBy]

      // Handle numeric sorts
      if (['lastPrice', 'changePercent', 'volume'].includes(sortBy)) {
        valA = Number(valA) || 0
        valB = Number(valB) || 0
      } else {
        valA = String(valA || '').toLowerCase()
        valB = String(valB || '').toLowerCase()
      }

      if (valA < valB) return sortOrder === 'asc' ? -1 : 1
      if (valA > valB) return sortOrder === 'asc' ? 1 : -1
      return 0
    })

  const totalPages = Math.ceil(filteredStocks.length / itemsPerPage)
  const currentStocks = filteredStocks.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page)
    }
  }

  if (loading && stocks.length === 0) {
    return (
      <div className="animate-fade-in-up space-y-8 p-6">
        <div className="h-12 w-64 bg-zinc-100 animate-pulse rounded-2xl mb-8" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-48 bg-zinc-100 animate-pulse rounded-[32px]" />
          ))}
        </div>
        <div className="h-96 bg-zinc-50 animate-pulse rounded-[32px]" />
      </div>
    )
  }

  return (
    <div className="animate-fade-in-up space-y-8 pb-12">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-zinc-900 tracking-tighter flex items-center gap-4">
            <Activity className="h-10 w-10" />
            Market Overview
          </h1>
          <p className="text-zinc-500 font-bold mt-2 uppercase tracking-widest text-xs">
            Live Ticker Intel • {stocks.length} Securities Listed
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <div className="relative group min-w-[300px]">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400 group-focus-within:text-zinc-900 transition-colors" />
            <input
              type="text"
              placeholder="Search ticker or company..."
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1) }}
              className="w-full pl-12 pr-4 py-3 bg-white border border-zinc-200 rounded-2xl font-bold text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900/5 focus:border-zinc-900 transition-all shadow-sm"
            />
          </div>
          <button
            onClick={fetchStocks}
            className="p-3.5 bg-zinc-900 text-white rounded-2xl hover:bg-zinc-800 transition-all shadow-lg active:scale-95"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Market Stats (Summary) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-zinc-900 rounded-[32px] p-8 text-white relative overflow-hidden shadow-2xl group">
          <div className="relative z-10">
            <p className="text-zinc-400 font-black uppercase tracking-[0.2em] text-[10px] mb-4">Top Ticker</p>
            <h3 className="text-4xl font-black tracking-tighter mb-2">
              {stocks.reduce((max, s) => (s.changePercent > max.changePercent ? s : max), stocks[0] || {}).symbol || '—'}
            </h3>
            <div className="flex items-center gap-2 text-emerald-400">
              <TrendingUp className="h-5 w-5" />
              <span className="text-xl font-black">
                +{stocks.reduce((max, s) => (s.changePercent > max.changePercent ? s : max), stocks[0] || {}).changePercent?.toFixed(2) || '0.00'}%
              </span>
            </div>
          </div>
          <div className="absolute top-0 right-0 p-8 opacity-10 transform translate-x-4 -translate-y-4 group-hover:translate-x-0 group-hover:translate-y-0 transition-transform duration-500">
            <TrendingUp className="h-32 w-32" />
          </div>
        </div>

        <div className="bg-white border border-zinc-200 rounded-[32px] p-8 shadow-sm group hover:border-zinc-300 transition-all">
          <p className="text-zinc-400 font-black uppercase tracking-[0.2em] text-[10px] mb-4">Market Heat</p>
          <h3 className="text-4xl font-black tracking-tighter mb-2 text-zinc-900">
            {stocks.filter(s => s.changePercent > 0).length} / {stocks.length}
          </h3>
          <p className="text-zinc-500 font-bold text-sm">Securities currently in the green</p>
        </div>

        <div className="bg-zinc-100 rounded-[32px] p-8 border border-zinc-200 shadow-sm relative overflow-hidden">
          <p className="text-zinc-400 font-black uppercase tracking-[0.2em] text-[10px] mb-4">Daily Volume</p>
          <h3 className="text-3xl font-black tracking-tighter mb-1 text-zinc-900">
            {stocks.reduce((sum, s) => sum + (s.volume || 0), 0).toLocaleString()}
          </h3>
          <p className="text-zinc-500 font-bold text-sm">Total trades logged today</p>
          <BarChart3 className="absolute -bottom-2 -right-2 h-24 w-24 text-zinc-200" />
        </div>
      </div>

      {/* Stocks Table */}
      <div className="bg-white border border-zinc-200 rounded-[40px] shadow-sm overflow-hidden">
        <div className="px-10 py-8 border-b border-zinc-100 flex items-center justify-between">
          <h3 className="text-xl font-black text-zinc-900 tracking-tight flex items-center gap-3">
            <Filter className="h-5 w-5" />
            Live Market Feed
          </h3>
          <div className="flex items-center gap-4">
            <span className="text-xs font-black text-zinc-400 uppercase tracking-widest hidden md:block">Sort By</span>
            <select
              value={sortBy}
              onChange={(e) => handleSort(e.target.value)}
              className="bg-zinc-50 border-none rounded-xl px-4 py-2 text-xs font-black uppercase tracking-tight focus:ring-2 focus:ring-zinc-900/5 transition-all text-zinc-600 cursor-pointer"
            >
              <option value="symbol">Symbol</option>
              <option value="lastPrice">Price</option>
              <option value="changePercent">Change</option>
              <option value="volume">Volume</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-zinc-50/50 border-b border-zinc-100">
                <th className="px-10 py-6 text-xs font-black text-zinc-400 uppercase tracking-widest">Ticker Int</th>
                <th className="px-6 py-6 text-xs font-black text-zinc-400 uppercase tracking-widest">Security Name</th>
                <th className="px-6 py-6 text-right text-xs font-black text-zinc-400 uppercase tracking-widest cursor-pointer hover:text-zinc-900" onClick={() => handleSort('lastPrice')}>LTP</th>
                <th className="px-6 py-6 text-right text-xs font-black text-zinc-400 uppercase tracking-widest cursor-pointer hover:text-zinc-900" onClick={() => handleSort('changePercent')}>Change</th>
                <th className="px-6 py-6 text-right text-xs font-black text-zinc-400 uppercase tracking-widest cursor-pointer hover:text-zinc-900" onClick={() => handleSort('volume')}>Volume</th>
                <th className="px-10 py-6 text-center text-xs font-black text-zinc-400 uppercase tracking-widest">Connect</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 px-10">
              {currentStocks.map((stock) => {
                const isPositive = stock.changePercent >= 0
                return (
                  <tr key={stock.symbol} className="hover:bg-zinc-50/50 transition-colors group">
                    <td className="px-10 py-6">
                      <div className="flex items-center gap-4">
                        <div className="bg-zinc-100 w-10 h-10 rounded-xl flex items-center justify-center font-black text-xs text-zinc-900 group-hover:bg-zinc-900 group-hover:text-white transition-all duration-300">
                          {stock.symbol?.charAt(0)}
                        </div>
                        <span className="font-black text-zinc-900 tracking-tight">{stock.symbol}</span>
                      </div>
                    </td>
                    <td className="px-6 py-6">
                      <p className="text-sm font-bold text-zinc-500 uppercase tracking-tight truncate max-w-[200px]">{stock.name}</p>
                    </td>
                    <td className="px-6 py-6 text-right">
                      <p className="font-black text-zinc-900 tabular-nums">Rs. {stock.lastPrice?.toFixed(2)}</p>
                    </td>
                    <td className="px-6 py-6 text-right">
                      <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black ${isPositive ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                        {isPositive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                        {isPositive ? '+' : ''}{stock.changePercent?.toFixed(2)}%
                      </div>
                    </td>
                    <td className="px-6 py-6 text-right">
                      <p className="text-xs font-bold text-zinc-400 tabular-nums">{stock.volume?.toLocaleString()}</p>
                    </td>
                    <td className="px-10 py-6 text-center">
                      <Link
                        to={`/stock/${stock.symbol}`}
                        className="p-2 border border-zinc-200 rounded-xl text-zinc-400 hover:text-zinc-900 hover:border-zinc-900 hover:bg-zinc-50 transition-all inline-flex active:scale-95"
                      >
                        <ArrowUpRight className="h-4 w-4" />
                      </Link>
                    </td>
                  </tr>
                )
              })}
              {currentStocks.length === 0 && (
                <tr>
                  <td colSpan="6" className="px-10 py-20 text-center">
                    <div className="flex flex-col items-center gap-4">
                      <Search className="h-10 w-10 text-zinc-200" />
                      <p className="text-xs font-black text-zinc-400 uppercase tracking-widest">No matching tickers found in the archive</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Section */}
        {totalPages > 1 && (
          <div className="px-10 py-8 bg-zinc-50/50 border-t border-zinc-100 flex flex-col md:flex-row items-center justify-between gap-6">
            <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest">
              Showing <span className="text-zinc-900">{(currentPage - 1) * itemsPerPage + 1}</span> to <span className="text-zinc-900">{Math.min(currentPage * itemsPerPage, filteredStocks.length)}</span> of <span className="text-zinc-900">{filteredStocks.length}</span> Securities
            </p>

            <div className="flex items-center gap-3">
              <button
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="p-3 bg-white border border-zinc-200 rounded-2xl text-zinc-600 hover:text-zinc-900 hover:border-zinc-300 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>

              <div className="flex items-center gap-2">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum
                  if (totalPages <= 5) pageNum = i + 1
                  else if (currentPage <= 3) pageNum = i + 1
                  else if (currentPage >= totalPages - 2) pageNum = totalPages - 4 + i
                  else pageNum = currentPage - 2 + i

                  return (
                    <button
                      key={pageNum}
                      onClick={() => goToPage(pageNum)}
                      className={`w-12 h-12 rounded-2xl text-sm font-black transition-all ${currentPage === pageNum
                          ? 'bg-zinc-900 text-white shadow-lg'
                          : 'bg-white border border-zinc-200 text-zinc-500 hover:border-zinc-900 hover:text-zinc-900'
                        }`}
                    >
                      {pageNum}
                    </button>
                  )
                })}
              </div>

              <button
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="p-3 bg-white border border-zinc-200 rounded-2xl text-zinc-600 hover:text-zinc-900 hover:border-zinc-300 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Market