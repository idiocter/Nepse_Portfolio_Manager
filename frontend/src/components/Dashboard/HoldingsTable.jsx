import { Link } from 'react-router-dom'
import { TrendingUp, TrendingDown, Eye } from 'lucide-react'

const HoldingsTable = ({ holdings }) => {
  return (
    <div className="card overflow-x-auto">
      <h3 className="text-lg font-semibold mb-4">Your Holdings</h3>
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Symbol</th>
            <th className="text-right py-3 px-4 text-sm font-medium text-gray-600">Qty</th>
            <th className="text-right py-3 px-4 text-sm font-medium text-gray-600">Avg Price</th>
            <th className="text-right py-3 px-4 text-sm font-medium text-gray-600">LTP</th>
            <th className="text-right py-3 px-4 text-sm font-medium text-gray-600">P&L</th>
            <th className="text-right py-3 px-4 text-sm font-medium text-gray-600">Change</th>
            <th className="text-center py-3 px-4 text-sm font-medium text-gray-600">Action</th>
          </tr>
        </thead>
        <tbody>
          {holdings.map((holding) => {
            const isProfit = holding.pnl >= 0
            const dayChangeIsProfit = holding.change >= 0

            return (
              <tr key={holding._id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="py-4 px-4 font-medium">{holding.symbol}</td>
                <td className="py-4 px-4 text-right">{holding.quantity}</td>
                <td className="py-4 px-4 text-right">Rs. {holding.avgPrice?.toFixed(2)}</td>
                <td className="py-4 px-4 text-right">Rs. {holding.currentPrice?.toFixed(2)}</td>
                <td className={`py-4 px-4 text-right font-medium ${isProfit ? 'text-green-600' : 'text-red-600'}`}>
                  {isProfit ? '+' : ''}{holding.pnl?.toLocaleString()}
                </td>
                <td className="py-4 px-4 text-right">
                  <span className={`inline-flex items-center space-x-1 ${dayChangeIsProfit ? 'text-green-600' : 'text-red-600'}`}>
                    {dayChangeIsProfit ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                    <span>{holding.changePercent?.toFixed(2)}%</span>
                  </span>
                </td>
                <td className="py-4 px-4 text-center">
                  <Link
                    to={`/stock/${holding.symbol}`}
                    className="inline-flex items-center space-x-1 text-primary-600 hover:text-primary-700"
                  >
                    <Eye className="h-4 w-4" />
                    <span className="text-sm">View</span>
                  </Link>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

export default HoldingsTable