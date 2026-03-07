import { Link } from 'react-router-dom'
import { TrendingUp, TrendingDown, ArrowUpRight } from 'lucide-react'

const HoldingsTable = ({ holdings }) => {
  if (!holdings || holdings.length === 0) {
    return (
      <div className="card text-center py-16">
        <p className="text-gray-500 text-lg mb-2">No holdings yet</p>
        <p className="text-gray-400 text-sm">Add stocks to your portfolio to see them here</p>
      </div>
    )
  }

  return (
    <div className="card p-0 overflow-hidden">
      <div className="px-6 pt-5 pb-3">
        <h3 className="text-lg font-semibold text-gray-900">Your Holdings</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="data-table">
          <thead>
            <tr>
              <th>Symbol</th>
              <th className="text-right">Qty</th>
              <th className="text-right">Avg Price</th>
              <th className="text-right">LTP</th>
              <th className="text-right">P&L</th>
              <th className="text-right">Change</th>
              <th className="text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {holdings.map((holding) => {
              const isProfit = holding.pnl >= 0
              const dayChangeIsProfit = holding.change >= 0
              return (
                <tr key={holding._id}>
                  <td className="font-medium text-gray-900">{holding.symbol}</td>
                  <td className="text-right">{holding.quantity}</td>
                  <td className="text-right">Rs. {holding.avgPrice?.toFixed(2)}</td>
                  <td className="text-right font-medium">Rs. {holding.currentPrice?.toFixed(2)}</td>
                  <td className={`text-right font-medium ${isProfit ? 'text-green-600' : 'text-red-600'}`}>
                    {isProfit ? '+' : ''}{holding.pnl?.toLocaleString()}
                  </td>
                  <td className="text-right">
                    <span className={`badge ${dayChangeIsProfit ? 'badge-success' : 'badge-danger'}`}>
                      {dayChangeIsProfit ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
                      {holding.changePercent?.toFixed(2)}%
                    </span>
                  </td>
                  <td className="text-center">
                    <Link to={`/stock/${holding.symbol}`}
                      className="inline-flex items-center gap-1 text-primary-600 hover:text-primary-700 text-sm font-medium">
                      View <ArrowUpRight className="h-3.5 w-3.5" />
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