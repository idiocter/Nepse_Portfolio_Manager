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

  useEffect(() => {
    fetchHoldings()
  }, [])

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
    } catch (error) {
      alert('Error deleting holding')
    }
  }

  const handleEdit = (holding) => {
    setEditingHolding(holding)
    setShowForm(true)
  }

  const handleAdd = () => {
    setEditingHolding(null)
    setShowForm(true)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Manage Portfolio</h1>
        <button
          onClick={handleAdd}
          className="btn-primary flex items-center space-x-2"
        >
          <Plus className="h-5 w-5" />
          <span>Add Holding</span>
        </button>
      </div>

      <div className="card overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Symbol</th>
              <th className="text-right py-3 px-4 text-sm font-medium text-gray-600">Quantity</th>
              <th className="text-right py-3 px-4 text-sm font-medium text-gray-600">Avg Price</th>
              <th className="text-right py-3 px-4 text-sm font-medium text-gray-600">Current</th>
              <th className="text-right py-3 px-4 text-sm font-medium text-gray-600">P&L</th>
              <th className="text-center py-3 px-4 text-sm font-medium text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody>
            {holdings.map((holding) => (
              <tr key={holding._id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="py-4 px-4 font-medium">{holding.symbol}</td>
                <td className="py-4 px-4 text-right">{holding.quantity}</td>
                <td className="py-4 px-4 text-right">Rs. {holding.avgPrice?.toFixed(2)}</td>
                <td className="py-4 px-4 text-right">Rs. {holding.currentPrice?.toFixed(2)}</td>
                <td className={`py-4 px-4 text-right font-medium ${holding.pnl >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {holding.pnl >= 0 ? '+' : ''}{holding.pnl?.toLocaleString()}
                </td>
                <td className="py-4 px-4">
                  <div className="flex items-center justify-center space-x-2">
                    <button
                      onClick={() => handleEdit(holding)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(holding.symbol)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {holdings.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">No holdings yet</p>
            <button onClick={handleAdd} className="btn-primary">
              Add your first holding
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