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
      <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 sm:w-12 sm:h-12 border-4 border-slate-200 border-b-slate-900 rounded-full animate-spin" />
          <p className="text-sm text-slate-500">Loading portfolio...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6 lg:space-y-8">

        {/* Header - Responsive layout */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-6">
          <div className="space-y-1 sm:space-y-2">
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Portfolio
            </h1>
            <p className="text-xs sm:text-sm text-slate-500">
              {totalHoldings} {totalHoldings === 1 ? 'holding' : 'holdings'} tracked
            </p>
          </div>
          <div className="flex items-center gap-2 sm:gap-4">
            <button
              onClick={fetchHoldings}
              className="p-2.5 sm:p-3 bg-white border border-slate-300 text-slate-700 rounded-lg sm:rounded-xl hover:bg-slate-50 transition-all shadow-sm active:scale-95"
              title="Refresh Data"
            >
              <RefreshCw className={`h-4 w-4 sm:h-5 sm:w-5 ${loading && holdings.length > 0 ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={handleAdd}
              className="flex items-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 bg-slate-900 text-white rounded-lg sm:rounded-xl font-semibold text-sm sm:text-base hover:bg-slate-800 transition-all shadow-lg active:scale-95"
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
            <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-slate-200 shadow-sm">
              <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                <div className="p-1.5 sm:p-2 bg-slate-100 rounded-lg">
                  <Wallet className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-slate-600" />
                </div>
                <span className="text-[10px] sm:text-xs font-semibold text-slate-500 uppercase tracking-wider">Holdings</span>
              </div>
              <p className="text-xl sm:text-2xl font-bold text-slate-900 tabular-nums">{totalHoldings}</p>
            </div>

            <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-slate-200 shadow-sm">
              <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                <div className="p-1.5 sm:p-2 bg-emerald-50 rounded-lg">
                  <TrendingUp className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-emerald-600" />
                </div>
                <span className="text-[10px] sm:text-xs font-semibold text-emerald-600 uppercase tracking-wider">Profitable</span>
              </div>
              <p className="text-xl sm:text-2xl font-bold text-slate-900 tabular-nums">{profitableCount}</p>
            </div>

            <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-slate-200 shadow-sm">
              <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                <div className="p-1.5 sm:p-2 bg-red-50 rounded-lg">
                  <TrendingDown className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-red-600" />
                </div>
                <span className="text-[10px] sm:text-xs font-semibold text-red-600 uppercase tracking-wider">In Loss</span>
              </div>
              <p className="text-xl sm:text-2xl font-bold text-slate-900 tabular-nums">{lossCount}</p>
            </div>

            <div className={`rounded-xl sm:rounded-2xl p-4 sm:p-6 border shadow-sm ${totalPnl >= 0 ? 'bg-emerald-50 border-emerald-200' : 'bg-red-50 border-red-200'}`}>
              <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                <div className={`p-1.5 sm:p-2 rounded-lg ${totalPnl >= 0 ? 'bg-emerald-100' : 'bg-red-100'}`}>
                  {totalPnl >= 0 ? (
                    <TrendingUp className={`h-3.5 w-3.5 sm:h-4 sm:w-4 ${totalPnl >= 0 ? 'text-emerald-600' : 'text-red-600'}`} />
                  ) : (
                    <TrendingDown className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-red-600" />
                  )}
                </div>
                <span className={`text-[10px] sm:text-xs font-semibold uppercase tracking-wider ${totalPnl >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                  Total P&L
                </span>
              </div>
              <p className={`text-lg sm:text-2xl font-bold tabular-nums ${totalPnl >= 0 ? 'text-emerald-700' : 'text-red-700'}`}>
                {totalPnl >= 0 ? '+' : ''}{formatCurrency(totalPnl)}
              </p>
            </div>
          </div>
        )}

        {/* Holdings Table - Mobile optimized */}
        <div className="bg-white rounded-xl sm:rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          {holdings.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[700px] sm:min-w-0">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    <th className="px-4 sm:px-6 lg:px-8 py-3 sm:py-5 text-[10px] sm:text-xs font-semibold text-slate-500 uppercase tracking-wider">Symbol</th>
                    <th className="px-3 sm:px-6 py-3 sm:py-5 text-right text-[10px] sm:text-xs font-semibold text-slate-500 uppercase tracking-wider">Qty</th>
                    <th className="px-3 sm:px-6 py-3 sm:py-5 text-right text-[10px] sm:text-xs font-semibold text-slate-500 uppercase tracking-wider">Avg Price</th>
                    <th className="px-3 sm:px-6 py-3 sm:py-5 text-right text-[10px] sm:text-xs font-semibold text-slate-500 uppercase tracking-wider">Current</th>
                    <th className="px-3 sm:px-6 py-3 sm:py-5 text-right text-[10px] sm:text-xs font-semibold text-slate-500 uppercase tracking-wider">P&L</th>
                    <th className="px-4 sm:px-6 lg:px-8 py-3 sm:py-5 text-center text-[10px] sm:text-xs font-semibold text-slate-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {holdings.map((holding) => (
                    <tr key={holding._id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-4 sm:px-6 lg:px-8 py-3 sm:py-5">
                        <div className="flex items-center gap-2 sm:gap-3">
                          <div className="w-7 h-7 sm:w-8 sm:h-8 bg-slate-100 rounded-lg flex items-center justify-center font-bold text-xs text-slate-700">
                            {holding.symbol.charAt(0)}
                          </div>
                          <span className="font-bold text-slate-900 text-sm sm:text-base">{holding.symbol}</span>
                        </div>
                      </td>
                      <td className="px-3 sm:px-6 py-3 sm:py-5 text-right font-medium text-slate-600 tabular-nums text-sm">
                        {formatVolume(holding.quantity)}
                      </td>
                      <td className="px-3 sm:px-6 py-3 sm:py-5 text-right text-slate-500 tabular-nums font-medium text-sm">
                        {formatCurrency(holding.avgPrice || 0)}
                      </td>
                      <td className="px-3 sm:px-6 py-3 sm:py-5 text-right font-bold text-slate-900 tabular-nums text-sm">
                        {formatCurrency(holding.currentPrice || 0)}
                      </td>
                      <td className="px-3 sm:px-6 py-3 sm:py-5 text-right">
                        <span className={`inline-flex items-center gap-1 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg text-[10px] sm:text-xs font-semibold ${holding.pnl >= 0 ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'}`}>
                          {holding.pnl >= 0 ? <TrendingUp className="h-2.5 w-2.5 sm:h-3 sm:w-3" /> : <TrendingDown className="h-2.5 w-2.5 sm:h-3 sm:w-3" />}
                          {holding.pnl >= 0 ? '+' : ''}{formatCurrency(holding.pnl)}
                        </span>
                      </td>
                      <td className="px-4 sm:px-6 lg:px-8 py-3 sm:py-5">
                        <div className="flex items-center justify-center gap-1 sm:gap-2">
                          <button
                            onClick={() => handleEdit(holding)}
                            className="p-1.5 sm:p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-all"
                            title="Edit"
                          >
                            <Pencil className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(holding.symbol)}
                            className="p-1.5 sm:p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
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
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-slate-100 rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-6">
                <Wallet className="h-6 w-6 sm:h-8 sm:w-8 text-slate-400" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-2 sm:mb-3">Your portfolio is empty</h3>
              <p className="text-xs sm:text-sm text-slate-500 mb-6 sm:mb-8 max-w-md mx-auto">
                Add your first stock holding to start tracking your investments and monitor performance.
              </p>
              <button
                onClick={handleAdd}
                className="inline-flex items-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 bg-slate-900 text-white rounded-lg sm:rounded-xl font-semibold text-sm sm:text-base hover:bg-slate-800 transition-all shadow-lg"
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