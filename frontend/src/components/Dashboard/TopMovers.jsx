import { useState, useEffect } from 'react'
import marketService from '../../services/marketService'
import { formatCurrency, formatPercent } from '../../utils/formatters'
import { TrendingUp, TrendingDown } from 'lucide-react'

const TopMovers = () => {
  const [gainers, setGainers] = useState([])
  const [losers, setLosers] = useState([])
  const [activeTab, setActiveTab] = useState('gainers')

  useEffect(() => {
    fetchMovers()
    const interval = setInterval(fetchMovers, 30000)
    return () => clearInterval(interval)
  }, [])

  const fetchMovers = async () => {
    try {
      const [gainersData, losersData] = await Promise.all([
        marketService.getGainers(),
        marketService.getLosers()
      ])
      setGainers(gainersData)
      setLosers(losersData)
    } catch (error) {
      console.error('Error fetching movers:', error)
    }
  }

  const data = activeTab === 'gainers' ? gainers : losers
  const isGainers = activeTab === 'gainers'

  return (
    <div className="bg-white border border-zinc-100 rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 shadow-sm">
      {/* Tabs - Responsive sizing */}
      <div className="flex gap-2 sm:gap-3 mb-4 sm:mb-6 lg:mb-8">
        <button
          onClick={() => setActiveTab('gainers')}
          className={`flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-5 py-2 sm:py-2.5 rounded-lg sm:rounded-xl text-[10px] sm:text-xs font-black uppercase tracking-widest transition-all flex-1 sm:flex-none ${activeTab === 'gainers' ? 'bg-emerald-50 text-emerald-600 shadow-sm' : 'text-zinc-400 hover:text-zinc-900 hover:bg-zinc-50'
            }`}
        >
          <TrendingUp className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
          <span className="hidden sm:inline">Gainers</span>
          <span className="sm:hidden">Up</span>
        </button>
        <button
          onClick={() => setActiveTab('losers')}
          className={`flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-5 py-2 sm:py-2.5 rounded-lg sm:rounded-xl text-[10px] sm:text-xs font-black uppercase tracking-widest transition-all flex-1 sm:flex-none ${activeTab === 'losers' ? 'bg-rose-50 text-rose-600 shadow-sm' : 'text-zinc-400 hover:text-zinc-900 hover:bg-zinc-50'
            }`}
        >
          <TrendingDown className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
          <span className="hidden sm:inline">Losers</span>
          <span className="sm:hidden">Down</span>
        </button>
      </div>

      {/* Stock List - Responsive spacing */}
      <div className="space-y-2 sm:space-y-3 lg:space-y-4">
        {data.map((stock, index) => (
          <div key={stock.symbol} className="flex items-center justify-between p-3 sm:p-4 bg-zinc-50/50 rounded-xl sm:rounded-2xl hover:bg-zinc-100/50 transition-all border border-transparent hover:border-zinc-100">
            <div className="flex items-center gap-2 sm:gap-3 lg:gap-4 min-w-0">
              <span className="text-[10px] sm:text-xs font-black text-zinc-300 w-4 sm:w-5 flex-shrink-0">{index + 1}</span>
              <div className="min-w-0">
                <p className="font-black text-zinc-900 tracking-tight text-sm sm:text-base">{stock.symbol}</p>
                <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider truncate max-w-[100px] sm:max-w-[120px] lg:max-w-[160px]">{stock.name}</p>
              </div>
            </div>
            <div className="text-right flex-shrink-0 ml-2">
              <p className="font-black text-zinc-900 tabular-nums text-sm sm:text-base">{formatCurrency(stock.lastPrice)}</p>
              <p className={`text-xs sm:text-sm font-black tabular-nums ${isGainers ? 'text-emerald-600' : 'text-rose-600'}`}>
                {formatPercent(stock.changePercent)}
              </p>
            </div>
          </div>
        ))}
        {data.length === 0 && (
          <div className="py-8 sm:py-12 text-center">
            <p className="text-[10px] sm:text-xs font-black text-zinc-300 uppercase tracking-widest">No market data</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default TopMovers