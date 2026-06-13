import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import marketService from '../services/marketService'
import { formatCurrency, formatPercent, formatVolume } from '../utils/formatters'
import {
  Search,
  TrendingUp,
  TrendingDown,
  Activity,
  BarChart3,
  ArrowUpRight,
  Filter,
  RefreshCw,
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
    // Auto refresh every 60 seconds
    const interval = setInterval(fetchStocks, 60000)
    return () => clearInterval(interval)
  }, [])

  const fetchStocks = async () => {
    // Only show full loading state if we have no stocks yet
    if (stocks.length === 0) setLoading(true)
    try {
      const data = await marketService.getStocks()
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

  // Calculate market stats
  const topGainer = stocks.reduce((max, s) => (s.changePercent > max.changePercent ? s : max), stocks[0] || {})
  const gainersCount = stocks.filter(s => s.changePercent > 0).length
  const totalVolume = stocks.reduce((sum, s) => sum + (s.volume || 0), 0)

  if (loading && stocks.length === 0) {
    return (
      <div className="min-h-screen bg-white dark:bg-zinc-950 p-4 sm:p-6 lg:p-8 space-y-4 sm:space-y-6 lg:space-y-8 transition-colors duration-300">
        <div className="h-8 sm:h-10 w-48 sm:w-64 bg-zinc-100 dark:bg-zinc-900 animate-pulse rounded-xl" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-32 sm:h-40 bg-zinc-50/50 dark:bg-zinc-900/50 rounded-xl sm:rounded-2xl border border-zinc-100 dark:border-zinc-800 animate-pulse" />
          ))}
        </div>
        <div className="h-[300px] sm:h-[400px] lg:h-[500px] bg-zinc-50/50 dark:bg-zinc-900/50 rounded-xl sm:rounded-2xl border border-zinc-100 dark:border-zinc-800 animate-pulse" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 p-4 sm:p-6 lg:p-8 transition-colors duration-300">
      <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6 lg:space-y-8">

        {/* Header - Responsive layout */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 sm:gap-6">
          <div className="space-y-1 sm:space-y-2">
            <h1 className="text-2xl sm:text-3xl font-black text-zinc-900 dark:text-zinc-100 tracking-tight">
              Market Overview
            </h1>
            <p className="text-xs sm:text-sm font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">
              {stocks.length} Securities Listed • Live Data
            </p>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            <div className="relative flex-1 sm:flex-none sm:w-80">
              <Search className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400 dark:text-zinc-500" />
              <input
                type="text"
                placeholder="Search ticker or company..."
                value={searchTerm}
                onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1) }}
                className="w-full pl-9 sm:pl-11 pr-3 sm:pr-4 py-2.5 sm:py-3 bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-lg sm:rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900/5 dark:focus:ring-zinc-100/5 focus:border-zinc-900 dark:focus:border-zinc-100 transition-all shadow-sm dark:text-zinc-100"
              />
            </div>
            <button
              onClick={fetchStocks}
              className="p-2.5 sm:p-3 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-lg sm:rounded-xl hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-all shadow-lg active:scale-95 flex-shrink-0"
            >
              <RefreshCw className={`h-4 w-4 sm:h-5 sm:w-5 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {/* Market Stats - Responsive grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Top Gainer */}
          <div className="bg-zinc-900 dark:bg-zinc-100 rounded-xl sm:rounded-2xl p-5 sm:p-8 text-white dark:text-zinc-900 shadow-xl transition-all">
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="p-2 sm:p-3 bg-white/10 dark:bg-zinc-900/10 rounded-lg sm:rounded-xl">
                  <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 text-emerald-400 dark:text-emerald-600" />
                </div>
                <span className="text-[10px] sm:text-xs font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">Top Gainer</span>
              </div>
            </div>
            <div className="space-y-1 sm:space-y-2">
              <h3 className="text-2xl sm:text-3xl font-black tracking-tight">
                {topGainer?.symbol || '—'}
              </h3>
              <div className="flex items-center gap-1.5 sm:gap-2 text-emerald-400 dark:text-emerald-600">
                <ArrowUpRight className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                <span className="text-base sm:text-lg font-black tabular-nums">
                  +{topGainer?.changePercent?.toFixed(2) || '0.00'}%
                </span>
              </div>
            </div>
          </div>

          {/* Market Heat */}
          <div className="bg-white dark:bg-zinc-900 rounded-xl sm:rounded-2xl p-5 sm:p-8 border border-zinc-100 dark:border-zinc-800 shadow-sm transition-all">
            <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
              <div className="p-2 sm:p-3 bg-zinc-50 dark:bg-zinc-800 rounded-lg sm:rounded-xl">
                <Activity className="h-4 w-4 sm:h-5 sm:w-5 text-zinc-600 dark:text-zinc-400" />
              </div>
              <span className="text-[10px] sm:text-xs font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">Market Heat</span>
            </div>
            <div className="space-y-1 sm:space-y-2">
              <h3 className="text-2xl sm:text-3xl font-black text-zinc-900 dark:text-zinc-100 tracking-tight">
                {gainersCount} <span className="text-zinc-300 dark:text-zinc-600 text-lg sm:text-2xl">/ {stocks.length}</span>
              </h3>
              <p className="text-xs sm:text-sm font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">Securities in the green</p>
            </div>
            {/* Progress Bar */}
            <div className="mt-3 sm:mt-4 h-1.5 sm:h-2 bg-zinc-50 dark:bg-zinc-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-500 dark:bg-emerald-400 rounded-full"
                style={{ width: `${stocks.length ? (gainersCount / stocks.length) * 100 : 0}%` }}
              />
            </div>
          </div>

          {/* Daily Volume */}
          <div className="bg-white dark:bg-zinc-900 rounded-xl sm:rounded-2xl p-5 sm:p-8 border border-zinc-100 dark:border-zinc-800 shadow-sm transition-all">
            <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
              <div className="p-2 sm:p-3 bg-zinc-50 dark:bg-zinc-800 rounded-lg sm:rounded-xl">
                <BarChart3 className="h-4 w-4 sm:h-5 sm:w-5 text-zinc-600 dark:text-zinc-400" />
              </div>
              <span className="text-[10px] sm:text-xs font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">Daily Volume</span>
            </div>
            <div className="space-y-1 sm:space-y-2">
              <h3 className="text-2xl sm:text-3xl font-black text-zinc-900 dark:text-zinc-100 tracking-tight tabular-nums">
                {totalVolume.toLocaleString()}
              </h3>
              <p className="text-xs sm:text-sm font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">Total trades today</p>
            </div>
          </div>
        </div>

        {/* Stocks Table - Mobile optimized */}
        <div className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-xl sm:rounded-2xl shadow-sm overflow-hidden transition-all duration-300">
          {/* Table Header */}
          <div className="px-4 sm:px-6 lg:px-8 py-4 sm:py-6 border-b border-zinc-100 dark:border-zinc-800 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 transition-colors">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="p-1.5 sm:p-2 bg-zinc-50 dark:bg-zinc-800 rounded-lg">
                <Filter className="h-4 w-4 sm:h-5 sm:w-5 text-zinc-600 dark:text-zinc-400" />
              </div>
              <h3 className="text-base sm:text-lg font-black text-zinc-900 dark:text-zinc-100 tracking-tighter">Live Market Feed</h3>
            </div>
            <div className="flex items-center gap-2 sm:gap-3">
              <span className="text-[10px] sm:text-xs font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">Sort by</span>
              <select
                value={sortBy}
                onChange={(e) => handleSort(e.target.value)}
                className="bg-zinc-50 dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-800 rounded-lg px-3 sm:px-4 py-2 text-xs sm:text-sm font-black text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-zinc-900/5 dark:focus:ring-zinc-100/5 cursor-pointer uppercase tracking-tight"
              >
                <option value="symbol">Symbol</option>
                <option value="sector">Sector</option>
                <option value="lastPrice">Price</option>
                <option value="changePercent">Change</option>
                <option value="volume">Volume</option>
              </select>
            </div>
          </div>

          {/* Table - Horizontal scroll on mobile */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[800px] sm:min-w-0">
              <thead>
                <tr className="bg-zinc-50/50 dark:bg-zinc-950/50 border-b border-zinc-100 dark:border-zinc-800">
                  <th className="px-4 sm:px-6 lg:px-8 py-3 sm:py-5 text-[10px] sm:text-xs font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">Symbol</th>
                  <th
                    className="px-3 sm:px-6 py-3 sm:py-5 text-[10px] sm:text-xs font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-widest cursor-pointer hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
                    onClick={() => handleSort('sector')}
                  >
                    Sector
                  </th>
                  <th className="px-3 sm:px-6 py-3 sm:py-5 text-[10px] sm:text-xs font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">Name</th>
                  <th
                    className="px-3 sm:px-6 py-3 sm:py-5 text-right text-[10px] sm:text-xs font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-widest cursor-pointer hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
                    onClick={() => handleSort('lastPrice')}
                  >
                    LTP
                  </th>
                  <th
                    className="px-3 sm:px-6 py-3 sm:py-5 text-right text-[10px] sm:text-xs font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-widest cursor-pointer hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
                    onClick={() => handleSort('changePercent')}
                  >
                    Change
                  </th>
                  <th
                    className="px-3 sm:px-6 py-3 sm:py-5 text-right text-[10px] sm:text-xs font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-widest cursor-pointer hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
                    onClick={() => handleSort('volume')}
                  >
                    Volume
                  </th>
                  <th className="px-4 sm:px-6 lg:px-8 py-3 sm:py-5 text-center text-[10px] sm:text-xs font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                {currentStocks.map((stock) => {
                  const isPositive = stock.changePercent >= 0
                  return (
                    <tr key={stock.symbol} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/50 transition-colors">
                      <td className="px-4 sm:px-6 lg:px-8 py-3 sm:py-5">
                        <div className="flex items-center gap-3 sm:gap-4">
                          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-zinc-50 dark:bg-zinc-800 rounded-lg flex items-center justify-center font-black text-xs sm:text-sm text-zinc-900 dark:text-zinc-100">
                            {stock.symbol?.charAt(0)}
                          </div>
                          <span className="font-black text-zinc-900 dark:text-zinc-100 text-sm sm:text-base tracking-tighter">{stock.symbol}</span>
                        </div>
                      </td>
                      <td className="px-3 sm:px-6 py-3 sm:py-5">
                        <span className="px-2 sm:px-3 py-1 bg-zinc-50 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 text-[10px] sm:text-xs font-black rounded-md uppercase tracking-tight">
                          {stock.sector || 'N/A'}
                        </span>
                      </td>
                      <td className="px-3 sm:px-6 py-3 sm:py-5">
                        <p className="text-xs sm:text-sm font-bold text-zinc-400 dark:text-zinc-500 truncate max-w-[120px] sm:max-w-xs">{stock.name}</p>
                      </td>
                      <td className="px-3 sm:px-6 py-3 sm:py-5 text-right">
                        <p className="font-black text-zinc-900 dark:text-zinc-100 tabular-nums text-sm sm:text-base">{formatCurrency(stock.lastPrice)}</p>
                      </td>
                      <td className="px-3 sm:px-6 py-3 sm:py-5 text-right">
                        <div className={`inline-flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg text-[10px] sm:text-xs font-black ${isPositive ? 'bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400' : 'bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400'}`}>
                          {isPositive ? <TrendingUp className="h-2.5 w-2.5 sm:h-3 sm:w-3" /> : <TrendingDown className="h-2.5 w-2.5 sm:h-3 sm:w-3" />}
                          {formatPercent(stock.changePercent)}
                        </div>
                      </td>
                      <td className="px-3 sm:px-6 py-3 sm:py-5 text-right">
                        <p className="text-xs sm:text-sm font-black text-zinc-400 dark:text-zinc-500 tabular-nums uppercase tracking-tighter">{formatVolume(stock.volume)}</p>
                      </td>
                      <td className="px-4 sm:px-6 lg:px-8 py-3 sm:py-5 text-center">
                        <Link
                          to={`/stock/${stock.symbol}`}
                          className="inline-flex p-1.5 sm:p-2 border border-zinc-100 dark:border-zinc-800 rounded-lg text-zinc-400 dark:text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 hover:border-zinc-900 dark:hover:border-zinc-100 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-all active:scale-95"
                        >
                          <ArrowUpRight className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                        </Link>
                      </td>
                    </tr>
                  )
                })}
                {currentStocks.length === 0 && (
                  <tr>
                    <td colSpan="7" className="px-4 sm:px-8 py-12 sm:py-20 text-center">
                      <div className="flex flex-col items-center gap-3 sm:gap-4">
                        <div className="p-3 sm:p-4 bg-zinc-50 dark:bg-zinc-800 rounded-full">
                          <Search className="h-5 w-5 sm:h-6 sm:w-6 text-zinc-400 dark:text-zinc-500" />
                        </div>
                        <p className="text-[10px] sm:text-xs font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">No matching securities found</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination - Simplified on mobile */}
          {totalPages > 1 && (
            <div className="px-4 sm:px-6 lg:px-8 py-4 sm:py-6 bg-zinc-50/50 dark:bg-zinc-950/50 border-t border-zinc-100 dark:border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 transition-colors">
              <p className="text-[10px] sm:text-xs font-black text-zinc-400 dark:text-zinc-500 text-center sm:text-left uppercase tracking-widest">
                Showing <span className="text-zinc-900 dark:text-zinc-100">{(currentPage - 1) * itemsPerPage + 1}</span> to <span className="text-zinc-900 dark:text-zinc-100">{Math.min(currentPage * itemsPerPage, filteredStocks.length)}</span> of <span className="text-zinc-900 dark:text-zinc-100">{filteredStocks.length}</span> results
              </p>

              <div className="flex items-center gap-1.5 sm:gap-2">
                <button
                  onClick={() => goToPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="p-2 sm:p-2.5 bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-lg text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:border-zinc-300 dark:hover:border-zinc-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm"
                >
                  <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5" />
                </button>

                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.min(3, totalPages) }, (_, i) => {
                    let pageNum
                    if (totalPages <= 3) pageNum = i + 1
                    else if (currentPage <= 2) pageNum = i + 1
                    else if (currentPage >= totalPages - 1) pageNum = totalPages - 2 + i
                    else pageNum = currentPage - 1 + i

                    return (
                      <button
                        key={pageNum}
                        onClick={() => goToPage(pageNum)}
                        className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg text-xs sm:text-sm font-black transition-all ${currentPage === pageNum
                          ? 'bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 shadow-md'
                          : 'bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:border-zinc-300 dark:hover:border-zinc-700 hover:text-zinc-900 dark:hover:text-zinc-100'
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
                  className="p-2 sm:p-2.5 bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-lg text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:border-zinc-300 dark:hover:border-zinc-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm"
                >
                  <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Market