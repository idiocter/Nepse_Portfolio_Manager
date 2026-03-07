import { TrendingUp, TrendingDown, Wallet, PieChart } from 'lucide-react'

const PortfolioSummary = ({ summary }) => {
  const isProfit = (summary.totalPnl || 0) >= 0

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="card stat-card">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500 mb-1">Total Investment</p>
            <p className="text-2xl font-bold text-gray-900">Rs. {(summary.totalInvestment || 0).toLocaleString()}</p>
          </div>
          <div className="p-3 bg-blue-100 rounded-xl">
            <Wallet className="h-6 w-6 text-blue-600" />
          </div>
        </div>
      </div>

      <div className="card stat-card">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500 mb-1">Current Value</p>
            <p className="text-2xl font-bold text-gray-900">Rs. {(summary.totalCurrent || 0).toLocaleString()}</p>
          </div>
          <div className="p-3 bg-purple-100 rounded-xl">
            <PieChart className="h-6 w-6 text-purple-600" />
          </div>
        </div>
      </div>

      <div className="card stat-card">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500 mb-1">Total P&L</p>
            <div className="flex items-center gap-2">
              <p className={`text-2xl font-bold ${isProfit ? 'text-green-600' : 'text-red-600'}`}>
                Rs. {Math.abs(summary.totalPnl || 0).toLocaleString()}
              </p>
              {isProfit ? <TrendingUp className="h-5 w-5 text-green-600" /> : <TrendingDown className="h-5 w-5 text-red-600" />}
            </div>
            <p className={`text-sm ${isProfit ? 'text-green-600' : 'text-red-600'}`}>
              {isProfit ? '+' : ''}{(summary.totalPnlPercent || 0).toFixed(2)}%
            </p>
          </div>
          <div className={`p-3 rounded-xl ${isProfit ? 'bg-green-100' : 'bg-red-100'}`}>
            {isProfit ? <TrendingUp className="h-6 w-6 text-green-600" /> : <TrendingDown className="h-6 w-6 text-red-600" />}
          </div>
        </div>
      </div>
    </div>
  )
}

export default PortfolioSummary