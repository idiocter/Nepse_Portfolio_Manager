import { TrendingUp, TrendingDown, Wallet, PieChart } from 'lucide-react'

const PortfolioSummary = ({ summary }) => {
  const isProfit = (summary.totalPnl || 0) >= 0

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      <div className="bg-white border border-zinc-100 rounded-3xl p-8 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-3">Total Investment</p>
            <p className="text-3xl font-black text-zinc-900 tracking-tight">Rs. {(summary.totalInvestment || 0).toLocaleString()}</p>
          </div>
          <div className="p-5 bg-zinc-50 rounded-2xl">
            <Wallet className="h-8 w-8 text-zinc-600" />
          </div>
        </div>
      </div>

      <div className="bg-white border border-zinc-100 rounded-3xl p-8 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-3">Current Value</p>
            <p className="text-3xl font-black text-zinc-900 tracking-tight">Rs. {(summary.totalCurrent || 0).toLocaleString()}</p>
          </div>
          <div className="p-5 bg-zinc-50 rounded-2xl">
            <PieChart className="h-8 w-8 text-zinc-600" />
          </div>
        </div>
      </div>

      <div className="bg-white border border-zinc-100 rounded-3xl p-8 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-3">Total P&L</p>
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-3">
                <p className={`text-3xl font-black tracking-tight ${isProfit ? 'text-emerald-600' : 'text-rose-600'}`}>
                  Rs. {Math.abs(summary.totalPnl || 0).toLocaleString()}
                </p>
                {isProfit ? <TrendingUp className="h-6 w-6 text-emerald-600" /> : <TrendingDown className="h-6 w-6 text-rose-600" />}
              </div>
              <p className={`text-sm font-black uppercase tracking-wider ${isProfit ? 'text-emerald-500' : 'text-rose-500'}`}>
                {isProfit ? '↑' : '↓'}{(summary.totalPnlPercent || 0).toFixed(2)}% Performance
              </p>
            </div>
          </div>
          <div className={`p-5 rounded-2xl ${isProfit ? 'bg-emerald-50' : 'bg-rose-50'}`}>
            {isProfit ? <TrendingUp className="h-8 w-8 text-emerald-600" /> : <TrendingDown className="h-8 w-8 text-rose-600" />}
          </div>
        </div>
      </div>
    </div>
  )
}

export default PortfolioSummary