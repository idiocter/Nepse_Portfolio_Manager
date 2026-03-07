import { useState, useEffect } from 'react'
import axios from 'axios'
import { X, Search } from 'lucide-react'

const HoldingForm = ({ onClose, onSuccess, editingHolding = null }) => {
  const [symbol, setSymbol] = useState(editingHolding?.symbol || '')
  const [quantity, setQuantity] = useState(editingHolding?.quantity || '')
  const [avgPrice, setAvgPrice] = useState(editingHolding?.avgPrice || '')
  const [stocks, setStocks] = useState([])
  const [filteredStocks, setFilteredStocks] = useState([])
  const [showDropdown, setShowDropdown] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchStocks()
  }, [])

  useEffect(() => {
    if (symbol) {
      const filtered = stocks.filter(s => 
        s.symbol.toLowerCase().includes(symbol.toLowerCase()) ||
        s.name?.toLowerCase().includes(symbol.toLowerCase())
      ).slice(0, 5)
      setFilteredStocks(filtered)
    } else {
      setFilteredStocks([])
    }
  }, [symbol, stocks])

  const fetchStocks = async () => {
    try {
      const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/api/market/stocks`)
      setStocks(data)
    } catch (error) {
      console.error('Error fetching stocks:', error)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (editingHolding) {
        await axios.put(`${import.meta.env.VITE_API_URL}/api/portfolio/${symbol}`, {
          quantity: Number(quantity),
          avgPrice: Number(avgPrice)
        })
      } else {
        await axios.post(`${import.meta.env.VITE_API_URL}/api/portfolio`, {
          symbol: symbol.toUpperCase(),
          quantity: Number(quantity),
          avgPrice: Number(avgPrice)
        })
      }
      onSuccess()
      onClose()
    } catch (error) {
      alert(error.response?.data?.message || 'Error saving holding')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold">
            {editingHolding ? 'Edit Holding' : 'Add Holding'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">Stock Symbol</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                value={symbol}
                onChange={(e) => {
                  setSymbol(e.target.value)
                  setShowDropdown(true)
                }}
                disabled={!!editingHolding}
                className="input pl-10"
                placeholder="Search stock symbol..."
                required
              />
            </div>
            
            {showDropdown && filteredStocks.length > 0 && !editingHolding && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-auto">
                {filteredStocks.map((stock) => (
                  <button
                    key={stock.symbol}
                    type="button"
                    onClick={() => {
                      setSymbol(stock.symbol)
                      setShowDropdown(false)
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-gray-50 border-b border-gray-100 last:border-0"
                  >
                    <p className="font-medium">{stock.symbol}</p>
                    <p className="text-sm text-gray-500">{stock.name}</p>
                  </button>
                ))}
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
            <input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className="input"
              placeholder="Enter quantity"
              min="1"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Average Price (Rs.)</label>
            <input
              type="number"
              value={avgPrice}
              onChange={(e) => setAvgPrice(e.target.value)}
              className="input"
              placeholder="Enter average price"
              min="0"
              step="0.01"
              required
            />
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary flex-1"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary flex-1 disabled:opacity-50"
            >
              {loading ? 'Saving...' : (editingHolding ? 'Update' : 'Add')}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default HoldingForm