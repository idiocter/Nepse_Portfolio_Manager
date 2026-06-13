import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import marketService from '../services/marketService'
import { formatCurrency, formatPercent, formatVolume, formatDate, formatTime } from '../utils/formatters'
import { ArrowLeft, Activity } from 'lucide-react'
import StockChart from '../components/Charts/StockChart'
import SectorIndices from '../components/Charts/SectorIndices'

const StockDetail = () => {
  const { symbol } = useParams()
  const [details, setDetails] = useState(null)
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => { fetchStockData() }, [symbol])

  const fetchStockData = async () => {
    if (!symbol || symbol === 'undefined') return
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
      <div className="max-w-[1400px] mx-auto px-4 py-20 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-line border-b-[var(--color-accent)] rounded-full animate-spin" />
          <p className="label">LOADING {symbol}</p>
        </div>
      </div>
    )
  }

  const isPositive = details?.change >= 0

  const metrics = [
    { label: 'PREV CLOSE', value: formatCurrency(details?.previousClose || 0) },
    { label: '52W HIGH', value: formatCurrency(details?.fiftyTwoWeekHigh || 0), cls: 'up' },
    { label: '52W LOW', value: formatCurrency(details?.fiftyTwoWeekLow || 0), cls: 'down' },
    { label: 'AVG TRADED', value: formatCurrency(details?.averageTradedPrice || 0) },
  ]
  const meta = [
    { label: 'MARKET CAP', value: formatVolume(details?.marketCapitalization || 0) },
    { label: 'LISTED SHARES', value: formatVolume(details?.outstandingShares || 0) },
    { label: 'SECTOR', value: details?.sectorName || '—' },
    { label: 'UPDATED', value: `${formatDate(details?.lastUpdatedDate)} ${formatTime(details?.lastUpdatedDate)}` },
  ]
  const stats = [
    { label: 'OPEN', value: formatCurrency(details?.openPrice || 0) },
    { label: 'DAY HIGH', value: formatCurrency(details?.highPrice || 0), cls: 'up' },
    { label: 'DAY LOW', value: formatCurrency(details?.lowPrice || 0), cls: 'down' },
    { label: 'VOLUME', value: formatVolume(details?.totalTradedQuantity || 0) },
  ]

  return (
    <div className="max-w-[1400px] mx-auto px-4 py-6 space-y-4">
      <Link to="/market" className="inline-flex items-center gap-1.5 label hover:text-ink no-underline transition-colors">
        <ArrowLeft className="h-3.5 w-3.5" /> BACK TO MARKET
      </Link>

      {/* Header */}
      <div className="panel p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-3xl font-bold text-ink tracking-tight">{symbol}</h1>
            <span className="chip">NEPSE</span>
          </div>
          <p className="text-[13px] text-muted mt-0.5">{details?.securityName}</p>
        </div>
        <div className="flex flex-col md:items-end">
          <p className="text-3xl font-semibold text-ink tnum">{formatCurrency(details?.lastTradedPrice || 0)}</p>
          <p className={`tnum text-[15px] ${isPositive ? 'up' : 'down'}`}>
            {isPositive ? '▲' : '▼'} {isPositive ? '+' : ''}{(details?.change || 0).toFixed(2)} ({formatPercent(details?.percentChange || 0)})
          </p>
        </div>
      </div>

      {/* Day stats strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 border border-line divide-x divide-[var(--color-line)]">
        {stats.map(s => (
          <div key={s.label} className="bg-panel p-3">
            <p className="label">{s.label}</p>
            <p className={`text-xl font-semibold tnum mt-0.5 ${s.cls || 'text-ink'}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Chart + sector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        <div className="lg:col-span-9 h-[380px]">
          {history.length > 0 ? (
            <StockChart data={history} symbol={symbol} />
          ) : (
            <div className="panel h-full flex flex-col items-center justify-center gap-3">
              <Activity className="h-7 w-7 text-faint" />
              <p className="label">HISTORICAL DATA UNAVAILABLE</p>
            </div>
          )}
        </div>
        <div className="lg:col-span-3 panel flex flex-col h-[380px]">
          <div className="px-3 py-2 bg-sunk border-b border-line flex items-center justify-between">
            <span className="label">SECTOR INDICES</span>
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-up)] animate-blink" />
          </div>
          <div className="flex-1 overflow-y-auto custom-scrollbar p-2">
            <SectorIndices />
          </div>
        </div>
      </div>

      {/* Metric tables */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[{ t: 'TRADING METRICS', rows: metrics }, { t: 'MARKET METADATA', rows: meta }].map(block => (
          <div key={block.t} className="panel overflow-hidden">
            <div className="px-3 py-2 bg-sunk border-b border-line"><span className="label">{block.t}</span></div>
            <div className="divide-y divide-[var(--color-line)]">
              {block.rows.map(r => (
                <div key={r.label} className="flex items-center justify-between px-3 py-2.5">
                  <span className="label">{r.label}</span>
                  <span className={`tnum text-[13px] font-medium ${r.cls || 'text-ink'}`}>{r.value}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default StockDetail
