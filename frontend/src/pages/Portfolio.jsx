import { useState, useEffect } from 'react'
import portfolioService from '../services/portfolioService'
import { formatCurrency, formatPercent, formatVolume } from '../utils/formatters'
import { Plus, Pencil, Trash2, Wallet, TrendingUp, TrendingDown, RefreshCw } from 'lucide-react'
import HoldingForm from '../components/Portfolio/HoldingForm'
import ConfirmModal from '../components/UI/ConfirmModal'

const Portfolio = () => {
  const [holdings, setHoldings] = useState([])
  const [summary, setSummary] = useState({})
  const [showForm, setShowForm] = useState(false)
  const [editingHolding, setEditingHolding] = useState(null)
  const [loading, setLoading] = useState(true)
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, symbol: '' })

  useEffect(() => {
    fetchHoldings()
    const interval = setInterval(fetchHoldings, 30000)
    return () => clearInterval(interval)
  }, [])

  const fetchHoldings = async () => {
    // Only show full loading if no data yet
    if (holdings.length === 0) setLoading(true)
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

  const handleDelete = (symbol) => {
    setDeleteModal({ isOpen: true, symbol })
  }

  const confirmDelete = async () => {
    try {
      await portfolioService.deleteHolding(deleteModal.symbol)
      fetchHoldings()
    } catch (error) {
      console.error('Error deleting holding:', error)
    }
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
      <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 p-4 sm:p-6 lg:p-8 flex items-center justify-center transition-colors duration-300">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 sm:w-12 sm:h-12 border-4 border-zinc-200 dark:border-zinc-800 border-b-zinc-900 dark:border-b-zinc-100 rounded-full animate-spin" />
          <p className="text-sm font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">Loading portfolio...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 p-4 sm:p-6 lg:p-8 transition-colors duration-300">
      <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6 lg:space-y-8">

        {/* Header - Responsive layout */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-6">
          <div className="space-y-1 sm:space-y-2">
            <h1 className="text-2xl sm:text-3xl font-black text-zinc-900 dark:text-zinc-100 tracking-tight">
              Portfolio
            </h1>
            <p className="text-xs sm:text-sm font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">
              {totalHoldings} {totalHoldings === 1 ? 'holding' : 'holdings'} tracked
            </p>
          </div>
          <div className="flex items-center gap-2 sm:gap-4">
            <button
              onClick={fetchHoldings}
              className="p-2.5 sm:p-3 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 rounded-lg sm:rounded-xl hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-all shadow-sm active:scale-95"
              title="Refresh Data"
            >
              <RefreshCw className={`h-4 w-4 sm:h-5 sm:w-5 ${loading && holdings.length > 0 ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={handleAdd}
              className="flex items-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-lg sm:rounded-xl font-black text-xs sm:text-sm uppercase tracking-widest hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-all shadow-lg active:scale-95"
            >
              <Plus className="h-4 w-4 sm:h-5 sm:w-5" />
              <span className="hidden sm:inline">Add Holding</span>
              <span className="sm:hidden">Add</span>
            </button>
          </div>
        </div>

        {/* Summary Stats - Responsive grid */}
        {totalHoldings > 0 && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
            <div className="bg-white dark:bg-zinc-900 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-zinc-100 dark:border-zinc-800 shadow-sm transition-all">
              <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                <div className="p-1.5 sm:p-2 bg-zinc-50 dark:bg-zinc-800 rounded-lg transition-colors">
                  <Wallet className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-zinc-500 dark:text-zinc-400" />
                </div>
                <span className="text-[10px] sm:text-xs font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">Holdings</span>
              </div>
              <p className="text-xl sm:text-2xl font-black text-zinc-900 dark:text-zinc-100 tabular-nums">{totalHoldings}</p>
            </div>

            <div className="bg-white dark:bg-zinc-900 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-zinc-100 dark:border-zinc-800 shadow-sm transition-all">
              <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                <div className="p-1.5 sm:p-2 bg-emerald-50 dark:bg-emerald-950/20 rounded-lg transition-colors">
                  <TrendingUp className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-emerald-600 dark:text-emerald-400" />
                </div>
                <span className="text-[10px] sm:text-xs font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">Profitable</span>
              </div>
              <p className="text-xl sm:text-2xl font-black text-zinc-900 dark:text-zinc-100 tabular-nums transition-colors">{profitableCount}</p>
            </div>

            <div className="bg-white dark:bg-zinc-900 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-zinc-100 dark:border-zinc-800 shadow-sm transition-all">
              <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                <div className="p-1.5 sm:p-2 bg-rose-50 dark:bg-rose-950/20 rounded-lg transition-colors">
                  <TrendingDown className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-rose-600 dark:text-rose-400" />
                </div>
                <span className="text-[10px] sm:text-xs font-black text-rose-600 dark:text-rose-400 uppercase tracking-widest">In Loss</span>
              </div>
              <p className="text-xl sm:text-2xl font-black text-zinc-900 dark:text-zinc-100 tabular-nums transition-colors">{lossCount}</p>
            </div>

            <div className={`rounded-xl sm:rounded-2xl p-4 sm:p-6 border shadow-sm transition-all duration-300 ${totalPnl >= 0 ? 'bg-emerald-50 dark:bg-emerald-950/20 border-emerald-100 dark:border-emerald-800' : 'bg-rose-50 dark:bg-rose-950/20 border-rose-100 dark:border-rose-800'}`}>
              <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                <div className={`p-1.5 sm:p-2 rounded-lg transition-colors ${totalPnl >= 0 ? 'bg-emerald-100/50 dark:bg-emerald-900/40' : 'bg-rose-100/50 dark:bg-rose-900/40'}`}>
                  {totalPnl >= 0 ? (
                    <TrendingUp className={`h-3.5 w-3.5 sm:h-4 sm:w-4 ${totalPnl >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`} />
                  ) : (
                    <TrendingDown className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-rose-600 dark:text-rose-400" />
                  )}
                </div>
                <span className={`text-[10px] sm:text-xs font-black uppercase tracking-widest transition-colors ${totalPnl >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                  Total P&L
                </span>
              </div>
              <p className={`text-lg sm:text-2xl font-black tabular-nums transition-colors ${totalPnl >= 0 ? 'text-emerald-700 dark:text-emerald-400' : 'text-rose-700 dark:text-rose-400'}`}>
                {totalPnl >= 0 ? '+' : ''}{formatCurrency(totalPnl)}
              </p>
            </div>
          </div>
        )}

        {/* Holdings Table - Mobile optimized */}
        <div className="bg-white dark:bg-zinc-900 rounded-xl sm:rounded-2xl border border-zinc-100 dark:border-zinc-800 shadow-sm overflow-hidden transition-all duration-300">
          {holdings.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[700px] sm:min-w-0">
                <thead>
                  <tr className="bg-zinc-50 dark:bg-zinc-950 border-b border-zinc-100 dark:border-zinc-800 transition-colors">
                    <th className="px-4 sm:px-6 lg:px-8 py-3 sm:py-5 text-[10px] sm:text-xs font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-widest transition-colors">Symbol</th>
                    <th className="px-3 sm:px-6 py-3 sm:py-5 text-right text-[10px] sm:text-xs font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-widest transition-colors">Qty</th>
                    <th className="px-3 sm:px-6 py-3 sm:py-5 text-right text-[10px] sm:text-xs font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-widest transition-colors">Avg Price</th>
                    <th className="px-3 sm:px-6 py-3 sm:py-5 text-right text-[10px] sm:text-xs font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-widest transition-colors">Current</th>
                    <th className="px-3 sm:px-6 py-3 sm:py-5 text-right text-[10px] sm:text-xs font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-widest transition-colors">P&L</th>
                    <th className="px-4 sm:px-6 lg:px-8 py-3 sm:py-5 text-center text-[10px] sm:text-xs font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-widest transition-colors">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-50 dark:divide-zinc-800">
                  {holdings.map((holding) => (
                    <tr key={holding._id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/50 transition-colors group">
                      <td className="px-4 sm:px-6 lg:px-8 py-3 sm:py-5">
                        <div className="flex items-center gap-2 sm:gap-3">
                          <div className="w-7 h-7 sm:w-8 sm:h-8 bg-zinc-50 dark:bg-zinc-800 rounded-lg flex items-center justify-center font-black text-[10px] sm:text-xs text-zinc-900 dark:text-zinc-100 transition-colors">
                            {holding.symbol.charAt(0)}
                          </div>
                          <span className="font-black text-zinc-900 dark:text-zinc-100 text-sm sm:text-base tracking-tight transition-colors">{holding.symbol}</span>
                        </div>
                      </td>
                      <td className="px-3 sm:px-6 py-3 sm:py-5 text-right font-bold text-zinc-500 dark:text-zinc-400 tabular-nums text-sm transition-colors">
                        {formatVolume(holding.quantity)}
                      </td>
                      <td className="px-3 sm:px-6 py-3 sm:py-5 text-right text-zinc-400 dark:text-zinc-500 tabular-nums font-bold text-sm transition-colors">
                        {formatCurrency(holding.avgPrice || 0)}
                      </td>
                      <td className="px-3 sm:px-6 py-3 sm:py-5 text-right font-black text-zinc-900 dark:text-zinc-100 tabular-nums text-sm transition-colors">
                        {formatCurrency(holding.currentPrice || 0)}
                      </td>
                      <td className="px-3 sm:px-6 py-3 sm:py-5 text-right">
                        <span className={`inline-flex items-center gap-1 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg text-[10px] sm:text-xs font-black transition-colors ${holding.pnl >= 0 ? 'bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 uppercase tracking-widest' : 'bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400 uppercase tracking-widest'}`}>
                          {holding.pnl >= 0 ? <TrendingUp className="h-2.5 w-2.5 sm:h-3 sm:w-3" /> : <TrendingDown className="h-2.5 w-2.5 sm:h-3 sm:w-3" />}
                          {holding.pnl >= 0 ? '+' : ''}{formatCurrency(holding.pnl)}
                        </span>
                      </td>
                      <td className="px-4 sm:px-6 lg:px-8 py-3 sm:py-5">
                        <div className="flex items-center justify-center gap-1 sm:gap-2">
                          <button
                            onClick={() => handleEdit(holding)}
                            className="p-1.5 sm:p-2 text-zinc-400 dark:text-zinc-600 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-all"
                            title="Edit"
                          >
                            <Pencil className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(holding.symbol)}
                            className="p-1.5 sm:p-2 text-zinc-400 dark:text-zinc-600 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-lg transition-all"
                            title="Delete"
                          >
                            <Trash2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            /* Empty State - Responsive */
            <div className="text-center py-12 sm:py-20 px-4">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-zinc-50 dark:bg-zinc-800 rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-6 transition-colors">
                <Wallet className="h-6 w-6 sm:h-8 sm:w-8 text-zinc-400 dark:text-zinc-600" />
              </div>
              <h3 className="text-lg sm:text-xl font-black text-zinc-900 dark:text-zinc-100 mb-2 sm:mb-3 transition-colors">Your portfolio is empty</h3>
              <p className="text-xs sm:text-sm font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest mb-6 sm:mb-8 max-w-md mx-auto transition-colors">
                Add your first stock holding to start tracking your investments and monitor performance.
              </p>
              <button
                onClick={handleAdd}
                className="inline-flex items-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-lg sm:rounded-xl font-black text-xs sm:text-sm uppercase tracking-widest hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-all shadow-lg active:scale-95"
              >
                <Plus className="h-4 w-4 sm:h-5 sm:w-5" />
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

        <ConfirmModal
          isOpen={deleteModal.isOpen}
          onClose={() => setDeleteModal({ isOpen: false, symbol: '' })}
          onConfirm={confirmDelete}
          title="Remove Holding"
          message={`Are you sure you want to remove ${deleteModal.symbol} from your portfolio? This action cannot be undone.`}
          confirmText="Yes, Remove"
        />
      </div>
    </div>
  )
}

export default Portfolio