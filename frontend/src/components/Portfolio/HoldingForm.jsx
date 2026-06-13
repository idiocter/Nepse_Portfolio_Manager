import { useState, useEffect } from 'react'
import marketService from '../../services/marketService'
import portfolioService from '../../services/portfolioService'
import { X, Search, ArrowUpRight } from 'lucide-react'

const HoldingForm = ({ onClose, onSuccess, editingHolding = null }) => {
  const [symbol, setSymbol] = useState(editingHolding?.symbol || '')
  const [quantity, setQuantity] = useState(editingHolding?.quantity || '')
  const [avgPrice, setAvgPrice] = useState(editingHolding?.avgPrice || '')
  const [stocks, setStocks] = useState([])
  const [filteredStocks, setFilteredStocks] = useState([])
  const [showDropdown, setShowDropdown] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    (async () => { try { setStocks(await marketService.getStocks()) } catch (e) { console.error(e) } })()
  }, [])

  useEffect(() => {
    if (symbol) {
      setFilteredStocks(stocks.filter(s =>
        s.symbol.toLowerCase().includes(symbol.toLowerCase()) ||
        s.name?.toLowerCase().includes(symbol.toLowerCase())).slice(0, 5))
    } else setFilteredStocks([])
  }, [symbol, stocks])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      if (editingHolding) await portfolioService.editHolding(symbol, Number(quantity), Number(avgPrice))
      else await portfolioService.addHolding(symbol.toUpperCase(), Number(quantity), Number(avgPrice))
      onSuccess(); onClose()
    } catch (error) {
      alert(error.response?.data?.message || 'Error saving holding')
    } finally { setLoading(false) }
  }

  return (
    <div className="fixed inset-0 bg-ink/40 flex items-center justify-center z-50 p-4">
      <div className="panel shadow-xl w-full max-w-md overflow-hidden">
        <div className="flex justify-between items-center px-4 py-2.5 bg-sunk border-b border-line">
          <span className="label">{editingHolding ? 'ADJUST HOLDING' : 'NEW HOLDING'}</span>
          <button onClick={onClose} className="text-faint hover:text-ink transition-colors"><X className="h-4 w-4" /></button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div className="relative">
            <label className="label block mb-1.5">SYMBOL</label>
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-faint" />
              <input type="text" value={symbol}
                onChange={(e) => { setSymbol(e.target.value); setShowDropdown(true) }}
                disabled={!!editingHolding}
                className="field pl-8 font-mono text-[13px] disabled:opacity-60"
                placeholder="e.g. NICA" required />
            </div>
            {showDropdown && filteredStocks.length > 0 && !editingHolding && (
              <div className="absolute z-10 w-full mt-1 panel shadow-lg overflow-hidden max-h-60 overflow-y-auto custom-scrollbar">
                {filteredStocks.map((stock) => (
                  <button key={stock.symbol} type="button"
                    onClick={() => { setSymbol(stock.symbol); setShowDropdown(false) }}
                    className="w-full text-left px-3 py-2 hover:bg-sunk border-b border-line last:border-0 transition-colors flex items-center justify-between">
                    <div className="min-w-0">
                      <p className="font-semibold text-ink text-[13px]">{stock.symbol}</p>
                      <p className="text-[11px] text-muted truncate">{stock.name}</p>
                    </div>
                    <ArrowUpRight className="h-3.5 w-3.5 text-faint shrink-0" />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label block mb-1.5">QUANTITY</label>
              <input type="number" value={quantity} onChange={(e) => setQuantity(e.target.value)}
                className="field font-mono text-[13px]" placeholder="0" min="1" required />
            </div>
            <div>
              <label className="label block mb-1.5">AVG PRICE</label>
              <input type="number" value={avgPrice} onChange={(e) => setAvgPrice(e.target.value)}
                className="field font-mono text-[13px]" placeholder="0.00" min="0" step="0.01" required />
            </div>
          </div>

          <div className="flex gap-2 pt-1">
            <button type="button" onClick={onClose} className="btn btn-ghost flex-1 py-2.5">Cancel</button>
            <button type="submit" disabled={loading} className="btn btn-accent flex-1 py-2.5 disabled:opacity-50">
              {loading ? 'Saving…' : (editingHolding ? 'Update' : 'Save')}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default HoldingForm
