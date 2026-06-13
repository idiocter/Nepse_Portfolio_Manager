import { useState, useEffect } from 'react'
import portfolioService from '../services/portfolioService'
import { formatCurrency, formatVolume } from '../utils/formatters'
import { Plus, Pencil, Trash2, RefreshCw } from 'lucide-react'
import HoldingForm from '../components/Portfolio/HoldingForm'
import ConfirmModal from '../components/UI/ConfirmModal'

const Portfolio = () => {
  const [holdings, setHoldings] = useState([])
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
    if (holdings.length === 0) setLoading(true)
    try {
      const data = await portfolioService.getHoldings()
      setHoldings(data.holdings)
    } catch (error) {
      console.error('Error fetching holdings:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = (symbol) => setDeleteModal({ isOpen: true, symbol })
  const confirmDelete = async () => {
    try { await portfolioService.deleteHolding(deleteModal.symbol); fetchHoldings() }
    catch (error) { console.error('Error deleting holding:', error) }
  }
  const handleEdit = (holding) => { setEditingHolding(holding); setShowForm(true) }
  const handleAdd = () => { setEditingHolding(null); setShowForm(true) }

  const totalHoldings = holdings.length
  const profitableCount = holdings.filter(h => h.pnl >= 0).length
  const lossCount = totalHoldings - profitableCount
  const totalPnl = holdings.reduce((sum, h) => sum + (h.pnl || 0), 0)

  if (loading) {
    return (
      <div className="max-w-[1400px] mx-auto px-4 py-20 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-line border-b-[var(--color-accent)] rounded-full animate-spin" />
          <p className="label">LOADING PORTFOLIO</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-[1400px] mx-auto px-4 py-6 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-ink tracking-tight">Portfolio</h1>
          <p className="label mt-0.5">{totalHoldings} {totalHoldings === 1 ? 'HOLDING' : 'HOLDINGS'} TRACKED</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={fetchHoldings} className="btn btn-ghost px-2.5">
            <RefreshCw className={`h-4 w-4 ${loading && holdings.length > 0 ? 'animate-spin' : ''}`} />
          </button>
          <button onClick={handleAdd} className="btn btn-accent">
            <Plus className="h-4 w-4" /> Add Holding
          </button>
        </div>
      </div>

      {/* Summary strip */}
      {totalHoldings > 0 && (
        <div className="grid grid-cols-2 lg:grid-cols-4 border border-line divide-x divide-[var(--color-line)]">
          <div className="bg-panel p-3"><p className="label">HOLDINGS</p><p className="text-2xl font-semibold text-ink tnum mt-0.5">{totalHoldings}</p></div>
          <div className="bg-panel p-3"><p className="label up">PROFITABLE</p><p className="text-2xl font-semibold text-ink tnum mt-0.5">{profitableCount}</p></div>
          <div className="bg-panel p-3"><p className="label down">IN LOSS</p><p className="text-2xl font-semibold text-ink tnum mt-0.5">{lossCount}</p></div>
          <div className={`p-3 ${totalPnl >= 0 ? 'bg-[var(--color-up)]/8' : 'bg-[var(--color-down)]/8'}`}>
            <p className={`label ${totalPnl >= 0 ? 'up' : 'down'}`}>TOTAL P&L</p>
            <p className={`text-2xl font-semibold tnum mt-0.5 ${totalPnl >= 0 ? 'up' : 'down'}`}>{totalPnl >= 0 ? '+' : ''}{formatCurrency(totalPnl)}</p>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="panel overflow-hidden">
        {holdings.length > 0 ? (
          <div className="overflow-x-auto custom-scrollbar">
            <table className="dt min-w-[680px] sm:min-w-0">
              <thead>
                <tr>
                  <th>Symbol</th>
                  <th className="text-right">Qty</th>
                  <th className="text-right">Avg</th>
                  <th className="text-right">Current</th>
                  <th className="text-right">P&L</th>
                  <th className="text-center">·</th>
                </tr>
              </thead>
              <tbody>
                {holdings.map((holding) => (
                  <tr key={holding._id}>
                    <td className="font-semibold text-ink">{holding.symbol}</td>
                    <td className="text-right tnum text-muted">{formatVolume(holding.quantity)}</td>
                    <td className="text-right tnum text-faint">{formatCurrency(holding.avgPrice || 0)}</td>
                    <td className="text-right tnum text-ink font-medium">{formatCurrency(holding.currentPrice || 0)}</td>
                    <td className={`text-right tnum font-medium ${holding.pnl >= 0 ? 'up' : 'down'}`}>
                      {holding.pnl >= 0 ? '+' : ''}{formatCurrency(holding.pnl)}
                    </td>
                    <td>
                      <div className="flex items-center justify-center gap-1">
                        <button onClick={() => handleEdit(holding)} className="p-1 text-faint hover:text-ink transition-colors" title="Edit">
                          <Pencil className="h-3.5 w-3.5" />
                        </button>
                        <button onClick={() => handleDelete(holding.symbol)} className="p-1 text-faint hover:down transition-colors" title="Delete">
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-16 px-4">
            <p className="text-[15px] font-semibold text-ink mb-1">Your portfolio is empty</p>
            <p className="label mb-5">Add your first holding to start tracking</p>
            <button onClick={handleAdd} className="btn btn-accent mx-auto">
              <Plus className="h-4 w-4" /> Add First Holding
            </button>
          </div>
        )}
      </div>

      {showForm && (
        <HoldingForm onClose={() => setShowForm(false)} onSuccess={fetchHoldings} editingHolding={editingHolding} />
      )}

      <ConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, symbol: '' })}
        onConfirm={confirmDelete}
        title="Remove Holding"
        message={`Remove ${deleteModal.symbol} from your portfolio? This cannot be undone.`}
        confirmText="Remove"
      />
    </div>
  )
}

export default Portfolio
