import { TrendingUp, TrendingDown, Wallet, PieChart } from 'lucide-react'

const PortfolioSummary = ({ summary }) => {
  const isProfit = (summary.totalPnl || 0) >= 0

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
      {/* Total Investment */}
      <div className="bg-white border border-zinc-100 rounded-2xl sm:rounded-3xl p-5 sm:p-6 lg:p-8 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="text-[10px] sm:text-xs font-bold text-zinc-400 uppercase tracking-widest mb-2 sm:mb-3">Total Investment</p>
            <p className="text-xl sm:text-2xl lg:text-3xl font-black text-zinc-900 tracking-tight truncate">
              Rs. {(summary.totalInvestment || 0).toLocaleString()}
            </p>
          </div>
          <div className="p-3 sm:p-4 lg:p-5 bg-zinc-50 rounded-xl sm:rounded-2xl flex-shrink-0">
            <Wallet className="h-5 w-5 sm:h-6 sm:h-7 lg:h-8 lg:w-8 text-zinc-600" />
          </div>
        </div>
      </div>

      {/* Current Value */}
      <div className="bg-white border border-zinc-100 rounded-2xl sm:rounded-3xl p-5 sm:p-6 lg:p-8 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="text-[10px] sm:text-xs font-bold text-zinc-400 uppercase tracking-widest mb-2 sm:mb-3">Current Value</p>
            <p className="text-xl sm:text-2xl lg:text-3xl font-black text-zinc-900 tracking-tight truncate">
              Rs. {(summary.totalCurrent || 0).toLocaleString()}
            </p>
          </div>
          <div className="p-3 sm:p-4 lg:p-5 bg-zinc-50 rounded-xl sm:rounded-2xl flex-shrink-0">
            <PieChart className="h-5 w-5 sm:h-6 sm:h-7 lg:h-8 lg:w-8 text-zinc-600" />
          </div>
        </div>
      </div>

      {/* Total P&L */}
      <div className="bg-white border border-zinc-100 rounded-2xl sm:rounded-3xl p-5 sm:p-6 lg:p-8 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="text-[10px] sm:text-xs font-bold text-zinc-400 uppercase tracking-widest mb-2 sm:mb-3">Total P&L</p>
            <div className="flex flex-col gap-0.5 sm:gap-1">
              <div className="flex items-center gap-2 sm:gap-3">
                <p className={`text-xl sm:text-2xl lg:text-3xl font-black tracking-tight truncate ${isProfit ? 'text-emerald-600' : 'text-rose-600'}`}>
                  Rs. {Math.abs(summary.totalPnl || 0).toLocaleString()}
                </p>
                {isProfit ? 
                  <TrendingUp className="h-4 w-4 sm:h-5 sm:h-6 lg:h-6 lg:w-6 text-emerald-600 flex-shrink-0" /> : 
                  <TrendingDown className="h-4 w-4 sm:h-5 sm:h-6 lg:h-6 lg:w-6 text-rose-600 flex-shrink-0" />
                }
              </div>
              <p className={`text-xs sm:text-sm font-black uppercase tracking-wider ${isProfit ? 'text-emerald-500' : 'text-rose-500'}`}>
                {isProfit ? '↑' : '↓'}{(summary.totalPnlPercent || 0).toFixed(2)}% Performance
              </p>
            </div>
          </div>
          <div className={`p-3 sm:p-4 lg:p-5 rounded-xl sm:rounded-2xl flex-shrink-0 ${isProfit ? 'bg-emerald-50' : 'bg-rose-50'}`}>
            {isProfit ? 
              <TrendingUp className="h-5 w-5 sm:h-6 sm:h-7 lg:h-8 lg:w-8 text-emerald-600" /> : 
              <TrendingDown className="h-5 w-5 sm:h-6 sm:h-7 lg:h-8 lg:w-8 text-rose-600" />
            }
          </div>
        </div>
      </div>
    </div>
  )
}

export default PortfolioSummary
