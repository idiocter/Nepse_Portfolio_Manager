import { Link } from 'react-router-dom'
import { TrendingUp, TrendingDown, ArrowUpRight } from 'lucide-react'

const HoldingsTable = ({ holdings }) => {
  if (!holdings || holdings.length === 0) {
    return (
      <div className="bg-white border border-zinc-100 rounded-3xl p-16 text-center shadow-sm">
        <p className="text-zinc-500 text-xl font-bold mb-2 tracking-tight">No holdings yet</p>
        <p className="text-zinc-400 text-sm font-medium uppercase tracking-widest">Add stocks to your portfolio to begin tracking.</p>
      </div>
    )
  }

  return (
    <div className="bg-white border border-zinc-100 rounded-3xl overflow-hidden shadow-sm">
      <div className="px-8 pt-8 pb-3">
        <h3 className="text-xl font-black text-zinc-900 tracking-tighter">Your Holdings</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-zinc-50/50 border-b border-zinc-100">
              <th className="px-8 py-5 text-xs font-black text-zinc-400 uppercase tracking-widest">Symbol</th>
              <th className="px-6 py-5 text-right text-xs font-black text-zinc-400 uppercase tracking-widest">Qty</th>
              <th className="px-6 py-5 text-right text-xs font-black text-zinc-400 uppercase tracking-widest">Avg Price</th>
              <th className="px-6 py-5 text-right text-xs font-black text-zinc-400 uppercase tracking-widest">LTP</th>
              <th className="px-6 py-5 text-right text-xs font-black text-zinc-400 uppercase tracking-widest">P&L</th>
              <th className="px-6 py-5 text-right text-xs font-black text-zinc-400 uppercase tracking-widest">Change</th>
              <th className="px-8 py-5 text-center text-xs font-black text-zinc-400 uppercase tracking-widest">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100">
            {holdings.map((holding) => {
              const isProfit = holding.pnl >= 0
              const dayChangeIsProfit = (holding.dailyChangePercent || 0) >= 0
              return (
                <tr key={holding._id} className="hover:bg-zinc-50/50 transition-colors">
                  <td className="px-8 py-5">
                    <p className="font-black text-zinc-900">{holding.symbol}</p>
                  </td>
                  <td className="px-6 py-5 text-right font-bold text-zinc-600 tabular-nums">{holding.quantity}</td>
                  <td className="px-6 py-5 text-right text-zinc-500 tabular-nums">Rs. {holding.avgPrice?.toFixed(2)}</td>
                  <td className="px-6 py-5 text-right font-bold text-zinc-900 tabular-nums">Rs. {holding.currentPrice?.toFixed(2)}</td>
                  <td className={`px-6 py-5 text-right font-black tabular-nums ${isProfit ? 'text-emerald-600' : 'text-rose-600'}`}>
                    {isProfit ? '+' : ''}{holding.pnl?.toLocaleString()}
                  </td>
                  <td className="px-6 py-5 text-right">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black ${dayChangeIsProfit ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                      {dayChangeIsProfit ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                      {holding.dailyChangePercent?.toFixed(2)}%
                    </span>
                  </td>
                  <td className="px-8 py-5 text-center">
                    <Link to={`/stock/${holding.symbol}`}
                      className="inline-flex items-center gap-2 text-zinc-900 hover:text-zinc-600 text-sm font-black transition-colors no-underline uppercase tracking-tight">
                      Manage <ArrowUpRight className="h-4 w-4" />
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