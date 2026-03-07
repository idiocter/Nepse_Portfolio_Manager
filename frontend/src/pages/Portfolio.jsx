import { useState, useEffect } from 'react'
import axios from 'axios'
import { Plus, Pencil, Trash2 } from 'lucide-react'
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
      const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/api/portfolio`)
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
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/portfolio/${symbol}`)
      fetchHoldings()
    } catch (error) { alert('Error deleting holding') }
  }

  const handleEdit = (holding) => { setEditingHolding(holding); setShowForm(true) }
  const handleAdd = () => { setEditingHolding(null); setShowForm(true) }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-96 animate-fade-in-up">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-zinc-100 border-b-zinc-900 mb-4"></div>
        <p className="text-xs font-black text-zinc-400 uppercase tracking-widest">Loading assets...</p>
      </div>
    )
  }

  return (
    <div className="animate-fade-in-up space-y-12 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-zinc-900 tracking-tighter">Manage Portfolio</h1>
          <p className="text-sm font-bold text-zinc-400 uppercase tracking-widest mt-2">Precision asset allocation control</p>
        </div>
        <button
          onClick={handleAdd}
          className="bg-zinc-900 text-white px-8 py-4 rounded-2xl font-black text-sm hover:bg-zinc-800 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-zinc-200 flex items-center justify-center gap-3 w-full md:w-auto"
        >
          <Plus className="h-5 w-5" />
          <span>Add New Holding</span>
        </button>
      </div>

      <div className="bg-white border border-zinc-100 rounded-3xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-zinc-50 border-b border-zinc-100">
                <th className="px-8 py-5 text-xs font-black text-zinc-400 uppercase tracking-widest">Symbol</th>
                <th className="px-6 py-5 text-right text-xs font-black text-zinc-400 uppercase tracking-widest">Quantity</th>
                <th className="px-6 py-5 text-right text-xs font-black text-zinc-400 uppercase tracking-widest">Avg Price</th>
                <th className="px-6 py-5 text-right text-xs font-black text-zinc-400 uppercase tracking-widest">Current</th>
                <th className="px-6 py-5 text-right text-xs font-black text-zinc-400 uppercase tracking-widest">P&L</th>
                <th className="px-8 py-5 text-center text-xs font-black text-zinc-400 uppercase tracking-widest">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {holdings.map((holding) => (
                <tr key={holding._id} className="hover:bg-zinc-50/50 transition-colors">
                  <td className="px-8 py-5 font-black text-zinc-900 uppercase tracking-tight">{holding.symbol}</td>
                  <td className="px-6 py-5 text-right font-bold text-zinc-600 tabular-nums">{holding.quantity}</td>
                  <td className="px-6 py-5 text-right text-zinc-500 tabular-nums font-medium">Rs. {holding.avgPrice?.toFixed(2)}</td>
                  <td className="px-6 py-5 text-right font-black text-zinc-900 tabular-nums">Rs. {holding.currentPrice?.toFixed(2)}</td>
                  <td className={`px-6 py-5 text-right font-black tabular-nums ${holding.pnl >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                    {holding.pnl >= 0 ? '+' : ''}{holding.pnl?.toLocaleString()}
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => handleEdit(holding)}
                        className="p-2.5 text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 rounded-xl transition-all"
                        title="Edit"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(holding.symbol)}
                        className="p-2.5 text-rose-300 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all"
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

        {holdings.length === 0 && (
          <div className="text-center py-24 bg-zinc-50/30">
            <p className="text-zinc-400 font-bold mb-8 uppercase tracking-[0.2em]">Portfolio is currently empty</p>
            <button
              onClick={handleAdd}
              className="px-10 py-5 bg-white border border-zinc-200 text-zinc-900 rounded-2xl font-black text-sm hover:bg-zinc-50 transition-all shadow-sm"
            >
              Add Your First Asset
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
  )
}

export default Portfolio