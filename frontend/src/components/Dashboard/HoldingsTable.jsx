import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'

const HoldingsTable = ({ holdings }) => {
  if (!holdings || holdings.length === 0) {
    return (
      <div className="panel p-12 text-center">
        <p className="text-[15px] font-semibold text-ink mb-1">No holdings yet</p>
        <p className="label">Add stocks to your portfolio to begin tracking</p>
      </div>
    )
  }

  return (
    <div className="panel overflow-hidden">
      <div className="px-3 py-2 bg-sunk border-b border-line flex items-center justify-between">
        <span className="label">YOUR HOLDINGS</span>
        <span className="label">{holdings.length} POSITIONS</span>
      </div>
      <div className="overflow-x-auto custom-scrollbar">
        <table className="dt min-w-[720px] sm:min-w-0">
          <thead>
            <tr>
              <th>Symbol</th>
              <th className="text-right">Qty</th>
              <th className="text-right">Avg</th>
              <th className="text-right">LTP</th>
              <th className="text-right">P&L</th>
              <th className="text-right">Day</th>
              <th className="text-center">·</th>
            </tr>
          </thead>
          <tbody>
            {holdings.map((holding) => {
              const isProfit = holding.pnl >= 0
              const dayUp = (holding.dailyChangePercent || 0) >= 0
              return (
                <tr key={holding._id}>
                  <td className="font-semibold text-ink">{holding.symbol}</td>
                  <td className="text-right tnum text-muted">{holding.quantity}</td>
                  <td className="text-right tnum text-faint">{holding.avgPrice?.toFixed(2)}</td>
                  <td className="text-right tnum text-ink font-medium">{holding.currentPrice?.toFixed(2)}</td>
                  <td className={`text-right tnum font-medium ${isProfit ? 'up' : 'down'}`}>
                    {isProfit ? '+' : ''}{holding.pnl?.toLocaleString()}
                  </td>
                  <td className={`text-right tnum ${dayUp ? 'up' : 'down'}`}>
                    {dayUp ? '+' : ''}{holding.dailyChangePercent?.toFixed(2)}%
                  </td>
                  <td className="text-center">
                    <Link to={`/stock/${holding.symbol}`} className="inline-flex text-faint hover:accent transition-colors">
                      <ArrowUpRight className="h-4 w-4" />
                    </Link>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default HoldingsTable
