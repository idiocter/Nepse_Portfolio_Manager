import { useState, useEffect } from 'react'
import portfolioService from '../services/portfolioService'
import { formatCurrency, formatPercent, formatVolume } from '../utils/formatters'
import { Plus, Pencil, Trash2, Wallet, TrendingUp, TrendingDown } from 'lucide-react'
import HoldingForm from '../components/Portfolio/HoldingForm'

const Portfolio = () => {
  const [holdings, setHoldings] = useState([])
  const [summary, setSummary] = useState({})
  const [showForm, setShowForm] = useState(false)
  const [editingHolding, setEditingHolding] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => { fetchHoldings() }, [])

  const fetchHoldings = async () => {
    try {
      const data = await portfolioService.getHoldings()
      setHoldings(data.holdings)
      setSummary(data.summary)
    } catch (error) {
      console.error('Error fetching holdings:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (symbol) => {
    if (!confirm(`Are you sure you want to delete ${symbol}?`)) return
    try {
      await portfolioService.deleteHolding(symbol)
      fetchHoldings()
    } catch (error) { alert('Error deleting holding') }
  }

  const handleEdit = (holding) => { setEditingHolding(holding); setShowForm(true) }
  const handleAdd = () => { setEditingHolding(null); setShowForm(true) }

  // Calculate totals
  const totalHoldings = holdings.length
  const profitableCount = holdings.filter(h => h.pnl >= 0).length
  const lossCount = totalHoldings - profitableCount
  const totalPnl = holdings.reduce((sum, h) => sum + (h.pnl || 0), 0)

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 p-8 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-slate-200 border-b-slate-900 rounded-full animate-spin" />
          <p className="text-sm text-slate-500">Loading portfolio...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
              Portfolio
            </h1>
            <p className="text-sm text-slate-500">
              {totalHoldings} {totalHoldings === 1 ? 'holding' : 'holdings'} tracked
            </p>
          </div>
          <button
            onClick={handleAdd}
            className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-xl font-semibold hover:bg-slate-800 transition-all shadow-lg active:scale-95"
          >
            <Plus className="h-5 w-5" />
            Add Holding
          </button>
        </div>

        {/* Summary Stats */}
        {totalHoldings > 0 && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-slate-100 rounded-lg">
                  <Wallet className="h-4 w-4 text-slate-600" />
                </div>
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Holdings</span>
              </div>
              <p className="text-2xl font-bold text-slate-900 tabular-nums">{totalHoldings}</p>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-emerald-50 rounded-lg">
                  <TrendingUp className="h-4 w-4 text-emerald-600" />
                </div>
                <span className="text-xs font-semibold text-emerald-600 uppercase tracking-wider">Profitable</span>
              </div>
              <p className="text-2xl font-bold text-slate-900 tabular-nums">{profitableCount}</p>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-red-50 rounded-lg">
                  <TrendingDown className="h-4 w-4 text-red-600" />
                </div>
                <span className="text-xs font-semibold text-red-600 uppercase tracking-wider">In Loss</span>
              </div>
              <p className="text-2xl font-bold text-slate-900 tabular-nums">{lossCount}</p>
            </div>

            <div className={`rounded-2xl p-6 border shadow-sm ${totalPnl >= 0 ? 'bg-emerald-50 border-emerald-200' : 'bg-red-50 border-red-200'}`}>
              <div className="flex items-center gap-3 mb-4">
                <div className={`p-2 rounded-lg ${totalPnl >= 0 ? 'bg-emerald-100' : 'bg-red-100'}`}>
                  {totalPnl >= 0 ? (
                    <TrendingUp className={`h-4 w-4 ${totalPnl >= 0 ? 'text-emerald-600' : 'text-red-600'}`} />
                  ) : (
                    <TrendingDown className="h-4 w-4 text-red-600" />
                  )}
                </div>
                <span className={`text-xs font-semibold uppercase tracking-wider ${totalPnl >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                  Total P&L
                </span>
              </div>
              <p className={`text-2xl font-bold tabular-nums ${totalPnl >= 0 ? 'text-emerald-700' : 'text-red-700'}`}>
                {totalPnl >= 0 ? '+' : ''}{formatCurrency(totalPnl)}
              </p>
            </div>
          </div>
        )}

        {/* Holdings Table */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          {holdings.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    <th className="px-8 py-5 text-xs font-semibold text-slate-500 uppercase tracking-wider">Symbol</th>
                    <th className="px-6 py-5 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">Quantity</th>
                    <th className="px-6 py-5 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">Avg Price</th>
                    <th className="px-6 py-5 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">Current</th>
                    <th className="px-6 py-5 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">P&L</th>
                    <th className="px-8 py-5 text-center text-xs font-semibold text-slate-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {holdings.map((holding) => (
                    <tr key={holding._id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center font-bold text-sm text-slate-700">
                            {holding.symbol.charAt(0)}
                          </div>
                          <span className="font-bold text-slate-900">{holding.symbol}</span>
                        </div>
                      </td>
                      <td className="px-6 py-5 text-right font-medium text-slate-600 tabular-nums">
                        {formatVolume(holding.quantity)}
                      </td>
                      <td className="px-6 py-5 text-right text-slate-500 tabular-nums font-medium">
                        {formatCurrency(holding.avgPrice || 0)}
                      </td>
                      <td className="px-6 py-5 text-right font-bold text-slate-900 tabular-nums">
                        {formatCurrency(holding.currentPrice || 0)}
                      </td>
                      <td className="px-6 py-5 text-right">
                        <span className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold ${holding.pnl >= 0 ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'}`}>
                          {holding.pnl >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                          {holding.pnl >= 0 ? '+' : ''}{formatCurrency(holding.pnl)}
                        </span>
                      </td>
                      <td className="px-8 py-5">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleEdit(holding)}
                            className="p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-all"
                            title="Edit"
                          >
                            <Pencil className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(holding.symbol)}
                            className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                            title="Delete"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            /* Empty State */
            <div className="text-center py-20">
              <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Wallet className="h-8 w-8 text-slate-400" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Your portfolio is empty</h3>
              <p className="text-sm text-slate-500 mb-8 max-w-md mx-auto">
                Add your first stock holding to start tracking your investments and monitor performance.
              </p>
              <button
                onClick={handleAdd}
                className="inline-flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-xl font-semibold hover:bg-slate-800 transition-all shadow-lg"
              >
                <Plus className="h-5 w-5" />
                Add First Holding
              </button>
            </div>
          )}
        </div>

        {showForm && (
          <HoldingForm
            onClose={() => setShowForm(false)}
            onSuccess={fetchHoldings}
            editingHolding={editingHolding}
          />
        )}
      </div>
    </div>
  )
}

export default Portfolio