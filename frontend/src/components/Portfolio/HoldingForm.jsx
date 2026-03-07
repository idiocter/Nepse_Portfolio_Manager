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

  useEffect(() => { fetchStocks() }, [])

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
          quantity: Number(quantity), avgPrice: Number(avgPrice)
        })
      } else {
        await axios.post(`${import.meta.env.VITE_API_URL}/api/portfolio`, {
          symbol: symbol.toUpperCase(), quantity: Number(quantity), avgPrice: Number(avgPrice)
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
    <div className="fixed inset-0 bg-zinc-950/60 backdrop-blur-md flex items-center justify-center z-50 p-6 animate-fade-in">
      <div className="bg-white rounded-[32px] shadow-2xl w-full max-w-lg animate-fade-in-up border border-zinc-100 overflow-hidden" style={{ animationDuration: '0.4s' }}>
        <div className="flex justify-between items-center px-10 py-8 border-b border-zinc-50">
          <div>
            <h2 className="text-2xl font-black text-zinc-900 tracking-tighter">
              {editingHolding ? 'Adjust Holding' : 'New Asset'}
            </h2>
            <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest mt-1">Portfolio configuration</p>
          </div>
          <button onClick={onClose} className="p-3 bg-zinc-50 text-zinc-400 hover:text-zinc-900 rounded-2xl transition-all">
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-10 space-y-8">
          <div className="relative">
            <label className="block text-xs font-black text-zinc-400 uppercase tracking-[0.2em] mb-3">Stock Symbol</label>
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-zinc-300 group-focus-within:text-zinc-900 transition-colors" />
              <input type="text" value={symbol}
                onChange={(e) => { setSymbol(e.target.value); setShowDropdown(true) }}
                disabled={!!editingHolding}
                className="w-full pl-12 pr-6 py-4 bg-zinc-50 border border-zinc-100 rounded-2xl text-zinc-900 font-bold placeholder:text-zinc-300 focus:bg-white focus:border-zinc-900 focus:ring-4 focus:ring-zinc-900/5 transition-all outline-none"
                placeholder="Search symbol (e.g. NICA)" required />
            </div>
            {showDropdown && filteredStocks.length > 0 && !editingHolding && (
              <div className="absolute z-10 w-full mt-2 bg-white border border-zinc-100 rounded-2xl shadow-2xl overflow-hidden max-h-72 overflow-y-auto">
                {filteredStocks.map((stock) => (
                  <button key={stock.symbol} type="button"
                    onClick={() => { setSymbol(stock.symbol); setShowDropdown(false) }}
                    className="w-full text-left px-6 py-4 hover:bg-zinc-50 border-b border-zinc-50 last:border-0 transition-colors flex items-center justify-between group">
                    <div>
                      <p className="font-black text-zinc-900 group-hover:text-zinc-950">{stock.symbol}</p>
                      <p className="text-xs font-bold text-zinc-400 uppercase tracking-tight">{stock.name}</p>
                    </div>
                    <ArrowUpRight className="h-4 w-4 text-zinc-200 group-hover:text-zinc-900 transition-colors" />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-black text-zinc-400 uppercase tracking-[0.2em] mb-3">Quantity</label>
              <input type="number" value={quantity} onChange={(e) => setQuantity(e.target.value)}
                className="w-full px-6 py-4 bg-zinc-50 border border-zinc-100 rounded-2xl text-zinc-900 font-bold placeholder:text-zinc-300 focus:bg-white focus:border-zinc-900 focus:ring-4 focus:ring-zinc-900/5 transition-all outline-none"
                placeholder="0" min="1" required />
            </div>

            <div>
              <label className="block text-xs font-black text-zinc-400 uppercase tracking-[0.2em] mb-3">Avg Price</label>
              <input type="number" value={avgPrice} onChange={(e) => setAvgPrice(e.target.value)}
                className="w-full px-6 py-4 bg-zinc-50 border border-zinc-100 rounded-2xl text-zinc-900 font-bold placeholder:text-zinc-300 focus:bg-white focus:border-zinc-900 focus:ring-4 focus:ring-zinc-900/5 transition-all outline-none"
                placeholder="0.00" min="0" step="0.01" required />
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <button type="button" onClick={onClose} className="flex-1 px-6 py-5 border border-zinc-200 text-zinc-600 rounded-2xl font-black text-sm hover:bg-zinc-50 transition-all">
              Discard
            </button>
            <button type="submit" disabled={loading} className="flex-1 px-6 py-5 bg-zinc-900 text-white rounded-2xl font-black text-sm hover:bg-zinc-800 transition-all shadow-xl shadow-zinc-200 disabled:opacity-50">
              {loading ? 'Processing...' : (editingHolding ? 'Update Asset' : 'Save Asset')}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default HoldingForm