import { useState, useEffect } from 'react'
import marketService from '../../services/marketService'
import { formatCurrency, formatPercent } from '../../utils/formatters'

const TopMovers = () => {
  const [gainers, setGainers] = useState([])
  const [losers, setLosers] = useState([])
  const [activeTab, setActiveTab] = useState('gainers')

  useEffect(() => {
    const fetchMovers = async () => {
      try {
        const [g, l] = await Promise.all([marketService.getGainers(), marketService.getLosers()])
        setGainers(g); setLosers(l)
      } catch (error) { console.error('Error fetching movers:', error) }
    }
    fetchMovers()
    const interval = setInterval(fetchMovers, 30000)
    return () => clearInterval(interval)
  }, [])

  const data = activeTab === 'gainers' ? gainers : losers
  const isGainers = activeTab === 'gainers'

  return (
    <div className="panel overflow-hidden">
      <div className="flex border-b border-line">
        {['gainers', 'losers'].map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className={`flex-1 px-3 py-2 text-[11px] font-mono uppercase tracking-wider transition-colors border-b-2 -mb-px ${activeTab === tab
              ? `${tab === 'gainers' ? 'up border-[var(--color-up)]' : 'down border-[var(--color-down)]'}`
              : 'text-faint border-transparent hover:text-ink'}`}>
            {tab === 'gainers' ? '▲ Gainers' : '▼ Losers'}
          </button>
        ))}
      </div>
      <table className="dt">
        <tbody>
          {data.map((stock, index) => (
            <tr key={stock.symbol}>
              <td className="text-faint tnum w-6">{index + 1}</td>
              <td>
                <div className="font-semibold text-ink">{stock.symbol}</div>
                <div className="text-[11px] text-muted truncate max-w-[120px]">{stock.name}</div>
              </td>
              <td className="text-right tnum text-ink">{formatCurrency(stock.lastPrice)}</td>
              <td className={`text-right tnum ${isGainers ? 'up' : 'down'}`}>{formatPercent(stock.changePercent)}</td>
            </tr>
          ))}
          {data.length === 0 && (
            <tr><td colSpan={4} className="text-center py-8 label">NO MARKET DATA</td></tr>
          )}
        </tbody>
      </table>
    </div>
  )
}

export default TopMovers
