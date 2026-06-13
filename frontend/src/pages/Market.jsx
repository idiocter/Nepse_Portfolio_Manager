import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import marketService from '../services/marketService'
import { formatCurrency, formatPercent, formatVolume } from '../utils/formatters'
import { Search, ArrowUpRight, RefreshCw, ChevronLeft, ChevronRight, ChevronsUpDown } from 'lucide-react'

const Market = () => {
  const [stocks, setStocks] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [sortBy, setSortBy] = useState('symbol')
  const [sortOrder, setSortOrder] = useState('asc')
  const itemsPerPage = 20

  useEffect(() => {
    fetchStocks()
    const interval = setInterval(fetchStocks, 60000)
    return () => clearInterval(interval)
  }, [])

  const fetchStocks = async () => {
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
    if (sortBy === field) setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    else { setSortBy(field); setSortOrder('asc') }
  }

  const filteredStocks = stocks
    .filter(s => s.symbol?.toLowerCase().includes(searchTerm.toLowerCase()) || s.name?.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => {
      let valA = a[sortBy], valB = b[sortBy]
      if (['lastPrice', 'changePercent', 'volume'].includes(sortBy)) { valA = Number(valA) || 0; valB = Number(valB) || 0 }
      else { valA = String(valA || '').toLowerCase(); valB = String(valB || '').toLowerCase() }
      if (valA < valB) return sortOrder === 'asc' ? -1 : 1
      if (valA > valB) return sortOrder === 'asc' ? 1 : -1
      return 0
    })

  const totalPages = Math.ceil(filteredStocks.length / itemsPerPage)
  const currentStocks = filteredStocks.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
  const goToPage = (page) => { if (page >= 1 && page <= totalPages) setCurrentPage(page) }

  const topGainer = stocks.reduce((max, s) => (s.changePercent > max.changePercent ? s : max), stocks[0] || {})
  const gainersCount = stocks.filter(s => s.changePercent > 0).length
  const totalVolume = stocks.reduce((sum, s) => sum + (s.volume || 0), 0)

  const SortHead = ({ field, children, align = 'left' }) => (
    <th className={align === 'right' ? 'text-right' : ''} onClick={() => handleSort(field)} style={{ cursor: 'pointer' }}>
      <span className={`inline-flex items-center gap-1 ${align === 'right' ? 'flex-row-reverse' : ''} ${sortBy === field ? 'accent' : ''}`}>
        {children} <ChevronsUpDown className="h-3 w-3 opacity-50" />
      </span>
    </th>
  )

  if (loading && stocks.length === 0) {
    return (
      <div className="max-w-[1400px] mx-auto px-4 py-6 space-y-4">
        <div className="h-7 w-48 bg-sunk animate-pulse rounded-[3px]" />
        <div className="h-96 panel animate-pulse" />
      </div>
    )
  }

  return (
    <div className="max-w-[1400px] mx-auto px-4 py-6 space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-ink tracking-tight">Market</h1>
          <p className="label mt-0.5">{stocks.length} SECURITIES · LIVE FEED</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative flex-1 sm:w-72">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-faint" />
            <input type="text" placeholder="Search ticker or company…" value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1) }}
              className="field pl-8 py-2 font-mono text-[13px]" />
          </div>
          <button onClick={fetchStocks} className="btn btn-ghost px-2.5">
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Market stat strip */}
      <div className="grid grid-cols-3 border border-line divide-x divide-[var(--color-line)]">
        <div className="bg-panel p-3">
          <p className="label">TOP GAINER</p>
          <p className="text-[15px] font-semibold text-ink mt-0.5 truncate">{topGainer?.symbol || '—'}</p>
          <p className="up tnum text-[13px]">+{topGainer?.changePercent?.toFixed(2) || '0.00'}%</p>
        </div>
        <div className="bg-panel p-3">
          <p className="label">BREADTH</p>
          <p className="text-[15px] font-semibold text-ink tnum mt-0.5">{gainersCount}<span className="text-faint">/{stocks.length}</span></p>
          <div className="mt-1.5 h-1 bg-sunk overflow-hidden rounded-[1px]">
            <div className="h-full bg-[var(--color-up)]" style={{ width: `${stocks.length ? (gainersCount / stocks.length) * 100 : 0}%` }} />
          </div>
        </div>
        <div className="bg-panel p-3">
          <p className="label">DAY VOLUME</p>
          <p className="text-[15px] font-semibold text-ink tnum mt-0.5">{totalVolume.toLocaleString()}</p>
          <p className="label">total trades</p>
        </div>
      </div>

      {/* Table */}
      <div className="panel overflow-hidden">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="dt min-w-[760px] sm:min-w-0">
            <thead>
              <tr>
                <SortHead field="symbol">Symbol</SortHead>
                <SortHead field="sector">Sector</SortHead>
                <th>Name</th>
                <SortHead field="lastPrice" align="right">LTP</SortHead>
                <SortHead field="changePercent" align="right">%Chg</SortHead>
                <SortHead field="volume" align="right">Volume</SortHead>
                <th className="text-center">·</th>
              </tr>
            </thead>
            <tbody>
              {currentStocks.map((stock) => {
                const isPositive = stock.changePercent >= 0
                return (
                  <tr key={stock.symbol}>
                    <td className="font-semibold text-ink">{stock.symbol}</td>
                    <td><span className="chip">{stock.sector || 'N/A'}</span></td>
                    <td className="text-muted text-[12px] truncate max-w-[180px]">{stock.name}</td>
                    <td className="text-right tnum text-ink font-medium">{formatCurrency(stock.lastPrice)}</td>
                    <td className={`text-right tnum ${isPositive ? 'up' : 'down'}`}>
                      {isPositive ? '▲' : '▼'} {formatPercent(stock.changePercent)}
                    </td>
                    <td className="text-right tnum text-faint">{formatVolume(stock.volume)}</td>
                    <td className="text-center">
                      <Link to={`/stock/${stock.symbol}`} className="inline-flex text-faint hover:accent transition-colors">
                        <ArrowUpRight className="h-4 w-4" />
                      </Link>
                    </td>
                  </tr>
                )
              })}
              {currentStocks.length === 0 && (
                <tr><td colSpan={7} className="text-center py-16 label">NO MATCHING SECURITIES</td></tr>
              )}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="px-3 py-2 bg-sunk border-t border-line flex items-center justify-between gap-3">
            <p className="label">
              {(currentPage - 1) * itemsPerPage + 1}–{Math.min(currentPage * itemsPerPage, filteredStocks.length)} OF {filteredStocks.length}
            </p>
            <div className="flex items-center gap-1">
              <button onClick={() => goToPage(currentPage - 1)} disabled={currentPage === 1}
                className="btn btn-ghost px-1.5 py-1 disabled:opacity-40"><ChevronLeft className="h-4 w-4" /></button>
              {Array.from({ length: Math.min(3, totalPages) }, (_, i) => {
                let pageNum
                if (totalPages <= 3) pageNum = i + 1
                else if (currentPage <= 2) pageNum = i + 1
                else if (currentPage >= totalPages - 1) pageNum = totalPages - 2 + i
                else pageNum = currentPage - 1 + i
                return (
                  <button key={pageNum} onClick={() => goToPage(pageNum)}
                    className={`w-7 h-7 text-[12px] font-mono rounded-[3px] border transition-colors ${currentPage === pageNum ? 'bg-ink text-paper border-ink' : 'border-line text-muted hover:border-line-strong'}`}>
                    {pageNum}
                  </button>
                )
              })}
              <button onClick={() => goToPage(currentPage + 1)} disabled={currentPage === totalPages}
                className="btn btn-ghost px-1.5 py-1 disabled:opacity-40"><ChevronRight className="h-4 w-4" /></button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Market
