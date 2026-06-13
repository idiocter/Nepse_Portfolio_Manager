import { Link } from 'react-router-dom'
import { TrendingUp, TrendingDown, ArrowUpRight } from 'lucide-react'

const HoldingsTable = ({ holdings }) => {
  if (!holdings || holdings.length === 0) {
    return (
      <div className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-2xl sm:rounded-3xl p-8 sm:p-12 lg:p-16 text-center shadow-sm">
        <p className="text-zinc-500 dark:text-zinc-400 text-lg sm:text-xl font-bold mb-2 tracking-tight">No holdings yet</p>
        <p className="text-zinc-400 dark:text-zinc-500 text-xs sm:text-sm font-medium uppercase tracking-widest">Add stocks to your portfolio to begin tracking.</p>
      </div>
    )
  }

  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-2xl sm:rounded-3xl overflow-hidden shadow-sm transition-all duration-300">
      <div className="px-4 sm:px-6 lg:px-8 pt-5 sm:pt-6 lg:pt-8 pb-2 sm:pb-3">
        <h3 className="text-lg sm:text-xl font-black text-zinc-900 dark:text-zinc-100 tracking-tighter">Your Holdings</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[800px] sm:min-w-0">
          <thead>
            <tr className="bg-zinc-50/50 dark:bg-zinc-950/50 border-b border-zinc-100 dark:border-zinc-800">
              <th className="px-4 sm:px-6 lg:px-8 py-3 sm:py-5 text-[10px] sm:text-xs font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">Symbol</th>
              <th className="px-3 sm:px-6 py-3 sm:py-5 text-right text-[10px] sm:text-xs font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">Qty</th>
              <th className="px-3 sm:px-6 py-3 sm:py-5 text-right text-[10px] sm:text-xs font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">Avg Price</th>
              <th className="px-3 sm:px-6 py-3 sm:py-5 text-right text-[10px] sm:text-xs font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">LTP</th>
              <th className="px-3 sm:px-6 py-3 sm:py-5 text-right text-[10px] sm:text-xs font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">P&L</th>
              <th className="px-3 sm:px-6 py-3 sm:py-5 text-right text-[10px] sm:text-xs font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">Change</th>
              <th className="px-4 sm:px-6 lg:px-8 py-3 sm:py-5 text-center text-[10px] sm:text-xs font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
            {holdings.map((holding) => {
              const isProfit = holding.pnl >= 0
              const dayChangeIsProfit = (holding.dailyChangePercent || 0) >= 0
              return (
                <tr key={holding._id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/50 transition-colors">
                  <td className="px-4 sm:px-6 lg:px-8 py-3 sm:py-5">
                    <p className="font-black text-zinc-900 dark:text-zinc-100 text-sm sm:text-base">{holding.symbol}</p>
                  </td>
                  <td className="px-3 sm:px-6 py-3 sm:py-5 text-right font-bold text-zinc-600 dark:text-zinc-400 tabular-nums text-sm">{holding.quantity}</td>
                  <td className="px-3 sm:px-6 py-3 sm:py-5 text-right text-zinc-500 dark:text-zinc-500 tabular-nums text-sm">Rs. {holding.avgPrice?.toFixed(2)}</td>
                  <td className="px-3 sm:px-6 py-3 sm:py-5 text-right font-bold text-zinc-900 dark:text-zinc-100 tabular-nums text-sm">Rs. {holding.currentPrice?.toFixed(2)}</td>
                  <td className={`px-3 sm:px-6 py-3 sm:py-5 text-right font-black tabular-nums text-sm ${isProfit ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                    {isProfit ? '+' : ''}{holding.pnl?.toLocaleString()}
                  </td>
                  <td className="px-3 sm:px-6 py-3 sm:py-5 text-right">
                    <span className={`inline-flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1 rounded-full text-[10px] sm:text-xs font-black ${dayChangeIsProfit ? 'bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400' : 'bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400'}`}>
                      {dayChangeIsProfit ? <TrendingUp className="h-2.5 w-2.5 sm:h-3 sm:w-3" /> : <TrendingDown className="h-2.5 w-2.5 sm:h-3 sm:w-3" />}
                      {holding.dailyChangePercent?.toFixed(2)}%
                    </span>
                  </td>
                  <td className="px-4 sm:px-6 lg:px-8 py-3 sm:py-5 text-center">
                    <Link to={`/stock/${holding.symbol}`}
                      className="inline-flex items-center gap-1.5 sm:gap-2 text-zinc-900 dark:text-zinc-100 hover:text-zinc-600 dark:hover:text-zinc-400 text-xs sm:text-sm font-black transition-colors no-underline uppercase tracking-tight">
                      <span className="hidden sm:inline">Manage</span>
                      <span className="sm:hidden">View</span>
                      <ArrowUpRight className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
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