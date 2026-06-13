import { TrendingUp, TrendingDown } from 'lucide-react'

const PortfolioSummary = ({ summary }) => {
  const isProfit = (summary.totalPnl || 0) >= 0

  const cells = [
    { label: 'TOTAL INVESTMENT', value: `Rs. ${(summary.totalInvestment || 0).toLocaleString()}` },
    { label: 'CURRENT VALUE', value: `Rs. ${(summary.totalCurrent || 0).toLocaleString()}` },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 border border-line divide-y md:divide-y-0 md:divide-x divide-[var(--color-line)]">
      {cells.map(c => (
        <div key={c.label} className="bg-panel p-4">
          <p className="label">{c.label}</p>
          <p className="text-2xl font-semibold text-ink tnum mt-1 truncate">{c.value}</p>
        </div>
      ))}
      <div className="bg-panel p-4">
        <p className="label">TOTAL P&L</p>
        <div className="flex items-center gap-2 mt-1">
          <p className={`text-2xl font-semibold tnum truncate ${isProfit ? 'up' : 'down'}`}>
            {isProfit ? '+' : '−'}Rs. {Math.abs(summary.totalPnl || 0).toLocaleString()}
          </p>
          {isProfit ? <TrendingUp className="h-4 w-4 up shrink-0" /> : <TrendingDown className="h-4 w-4 down shrink-0" />}
        </div>
        <p className={`label mt-0.5 ${isProfit ? 'up' : 'down'}`}>
          {isProfit ? '▲' : '▼'} {Math.abs(summary.totalPnlPercent || 0).toFixed(2)}% RETURN
        </p>
      </div>
    </div>
  )
}

export default PortfolioSummary
